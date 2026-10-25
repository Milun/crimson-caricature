import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Howl, type HowlOptions } from "howler";

export type MusicOptions = HowlOptions & { crossFadeDuration?: number };
export type PlaylistOptions = Omit<MusicOptions, "src">;
export type Playlist = { stop: (fadeMs?: number) => void };
import { useGame } from "./useGameState";

export type AudioState = {

    preload: (options: HowlOptions) => Howl; // Creates (or returns a cached) Howl.
    
    playSound: (options: HowlOptions) => Howl;
    playBGMs: (srcs: (string | string[])[], startingIdx: number, options?: PlaylistOptions) => Playlist;

    unmuteBGM: (volume:number, crossFadeDuration: number) => void,
    muteBGM: (fadeMs:number) => void,
    //stopMusic: (fadeMs?: number) => void;
    //getCurrentMusic: () => Howl | null;
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
    const currentBGMIdx = useRef(0);

    // Everything below only touches refs, so build the API once and keep it stable.
    const api = useMemo<AudioState>(() => {

        // Preloads sound into the SFX cache.
        function preload(options: HowlOptions): Howl {
            const key = keyOf(options.src);
            let howl = sfxCache.current.get(key);
            if (!howl) {
                howl = new Howl(options);
                sfxCache.current.set(key, howl);
            }
            return howl;
        }

        // Plays a sound from the SFX cache.
        // Note: the TileZ and TileV BGMs should be entered as SFXs.
        function playSound(options: HowlOptions): Howl {
            const howl = preload(options);
            const id = howl.play();
            
            // Apply per-play settings to this playback only, since the Howl is shared.
            if (options.volume !== undefined) howl.volume(options.volume, id);
            if (options.loop !== undefined) howl.loop(options.loop, id);
            
            return howl;
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
        function startBGM({
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

        function unmuteBGM(volume = 0.7, crossFadeDuration = 1500) {
            currentMusic.current?.fade(0, volume, crossFadeDuration);
        }

        function muteBGM(fadeMs = 0) {
            const cur = currentMusic.current;
            if (!cur) return;
            cur.fade(cur.volume(), 0, fadeMs);
        }

        // Start playing the playlist, 
        function playBGMs(
            srcs: (string | string[])[],
            startingIdx: number = 0,
            { crossFadeDuration = 2000, ...options }: PlaylistOptions = {},
        ): Playlist {

            let index = startingIdx;

            const playTrack = () => {

                startBGM({
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
                    if (currentMusic.current) {
                        fadeOutAndUnload(currentMusic.current, fadeMs || 0);
                        currentMusic.current = null;
                    }
                },
            };
        }

        return {
            preload,
            playSound,
            playBGMs,

            unmuteBGM,
            muteBGM
            //getCurrentMusic: () => currentMusic.current,
        };
    }, []);

    // Release everything if the provider unmounts.
    useEffect(() => {
        const cache = sfxCache.current;
        return () => {
            currentBGMIdx.current++;
            currentMusic.current?.unload();
            currentMusic.current = null;
            cache.forEach((howl) => howl.unload());
            cache.clear();
        };
    }, []);

    return api;
}

export function AudioProvider({ children }: { children: ReactNode }) {
    
    const [hasClicked, setHasClicked] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);

    const state = useAudioState();
    const {
        activeStageIdx
    } = useGame();

    const {
        playBGMs,
        muteBGM,
        unmuteBGM
    } = state;

    useEffect(() => {

        if (!hasClicked) return;

        // Initial splaash screen music
        if (activeStageIdx < 0) {
            playBGMs([
                'audio/bgm-0.mp3'
            ], 0, {volume: 0.3});
        }
        else {
            
            if (hasStarted) return;

            muteBGM(0);
            setTimeout(() => {
                playBGMs([
                    'audio/bgm-1.opus',
                    'audio/bgm-2.opus',
                    'audio/bgm-3.opus',
                    'audio/bgm-4.opus',
                    'audio/bgm-5.opus',
                    'audio/bgm-8.opus',
                    'audio/bgm-9.opus',
                    'audio/bgm-10.opus',
                    'audio/bgm-6.opus',
                ], Math.floor(activeStageIdx/3), {volume: 0.1});
                unmuteBGM(0.1, 0);

            }, 1000);

            setHasStarted(true);
        }

    }, [hasClicked, activeStageIdx, hasStarted]);

    return <GameAudioContext.Provider 
        value={state}
    >
        {!hasClicked && <div 
            style={{
                backgroundColor: `rgba(255,255,255,0.5)`,
                width: `100%`,
                height: `100%`,
                top: 0,
                left: 0,
                cursor: 'pointer',
                position: 'absolute',
                zIndex: 99
            }} 
            onClick={() => setHasClicked(true)}
        />}
        {children}
    </GameAudioContext.Provider>;
}
