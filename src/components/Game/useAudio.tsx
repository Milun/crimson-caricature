import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import { Howl, type HowlOptions } from "howler";

export type MusicOptions = HowlOptions & { crossFadeDuration?: number };
export type PlaylistOptions = Omit<MusicOptions, "src">;
export type Playlist = { stop: (fadeMs?: number) => void };

export type AudioState = {

    preload: (options: HowlOptions) => Howl; // Creates (or returns a cached) Howl.
    
    playSound: (options: HowlOptions) => number;
    playMusic: (options: MusicOptions) => Howl;
    playPlaylist: (srcs: (string | string[])[], options?: PlaylistOptions) => Playlist;
    stopMusic: (fadeMs?: number) => void;
    getCurrentMusic: () => Howl | null;
};

// Not called "AudioContext" so it doesn't shadow the browser's Web Audio AudioContext.
const GameAudioContext = createContext<AudioState | null>(null);

export function useAudio(): AudioState {
    const ctx = useContext(GameAudioContext);
    if (!ctx) throw new Error("useAudio() must be used inside an <AudioProvider>");
    return ctx;
}

const keyOf = (src: string | string[]) => (Array.isArray(src) ? src.join("|") : src);

function useAudioState(): AudioState {
    const sfxCache = useRef(new Map<string, Howl>());
    const currentMusic = useRef<Howl | null>(null);
    const playlistToken = useRef(0); // bumped to cancel whichever playlist is running

    // Everything below only touches refs, so build the API once and keep it stable.
    const api = useMemo<AudioState>(() => {

        function preload(options: HowlOptions): Howl {
            const key = keyOf(options.src);
            let howl = sfxCache.current.get(key);
            if (!howl) {
                howl = new Howl(options); // keep the full src array so format fallbacks still work
                sfxCache.current.set(key, howl);
            }
            return howl;
        }

        function playSound(options: HowlOptions): number {
            const howl = preload(options);
            const id = howl.play();
            // Apply per-play settings to this playback only, since the Howl is shared.
            if (options.volume !== undefined) howl.volume(options.volume, id);
            if (options.loop !== undefined) howl.loop(options.loop, id);
            return id;
        }

        function fadeOutAndUnload(howl: Howl, ms: number) {
            howl.off("end"); // stop an outgoing playlist track from advancing the playlist
            if (ms <= 0 || !howl.playing()) {
                howl.unload();
                return;
            }
            howl.fade(howl.volume(), 0, ms);
            howl.once("fade", () => howl.unload());
        }

        // Music is never cached: each track gets a fresh Howl that's unloaded when it's replaced.
        function startMusic({
            crossFadeDuration = 1500,
            volume = 1,
            loop = true,
            html5 = true, // stream long tracks rather than decoding them up front
            ...options
        }: MusicOptions): Howl {
            const next = new Howl({ ...options, loop, html5, volume: 0 });
            next.play();
            next.fade(0, volume, crossFadeDuration);

            const old = currentMusic.current;
            if (old) fadeOutAndUnload(old, crossFadeDuration);

            currentMusic.current = next;
            return next;
        }

        function playMusic(options: MusicOptions): Howl {
            playlistToken.current++;
            return startMusic(options);
        }

        function stopMusic(fadeMs = 1000) {
            playlistToken.current++;
            const cur = currentMusic.current;
            if (cur) fadeOutAndUnload(cur, fadeMs);
            currentMusic.current = null;
        }

        function playPlaylist(
            srcs: (string | string[])[],
            { crossFadeDuration = 2000, ...options }: PlaylistOptions = {}
        ): Playlist {
            const token = ++playlistToken.current;
            let index = 0;

            const playTrack = () => {
                if (token !== playlistToken.current) return; // a newer playlist/track took over
                startMusic({
                    ...options,
                    src: srcs[index],
                    loop: false,
                    crossFadeDuration,
                    onend: () => {
                        index = (index + 1) % srcs.length;
                        playTrack();
                    },
                });
            };

            playTrack();
            return {
                stop: (fadeMs?: number) => {
                    if (token === playlistToken.current) stopMusic(fadeMs);
                },
            };
        }

        return {
            preload,
            playSound,
            playMusic,
            playPlaylist,
            stopMusic,
            getCurrentMusic: () => currentMusic.current,
        };
    }, []);

    // Release everything if the provider unmounts.
    useEffect(() => {
        const cache = sfxCache.current;
        return () => {
            playlistToken.current++;
            currentMusic.current?.unload();
            currentMusic.current = null;
            cache.forEach((howl) => howl.unload());
            cache.clear();
        };
    }, []);

    return api;
}

export function AudioProvider({ children }: { children: ReactNode }) {
    const state = useAudioState();
    return <GameAudioContext.Provider value={state}>{children}</GameAudioContext.Provider>;
}
