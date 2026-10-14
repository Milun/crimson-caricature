
import { createContext, useContext, useRef, useState, useCallback, useMemo, type ReactNode, useEffect } from "react";
import { Howl, type HowlOptions } from 'howler';

const AudioContext = createContext<AudioState | null>(null);

export function useAudio(): AudioState {
    const ctx = useContext(AudioContext);
    if (!ctx) throw new Error('useAudio() must be used inside a <AudioProvider>');
    return ctx;
}

export type AudioState = {
    preload: (options:HowlOptions) => Howl,

    getCurrentMusic: () => Howl | null,
    playMusic: (options:HowlOptions & {crossFadeDuration?: number}) => Howl,
    playSound: (options:HowlOptions) => Howl,
    playPlaylist: (srsc:string[], options:HowlOptions) => void,
}

function useAudioState(): AudioState {

    const audioRef = useRef<Record<string, Howl>>(null); // Dictionary of audio.
    const curMusicRef = useRef<Howl>(null);

    function preload({
        src,
        ...props
    }:HowlOptions) {

        // Determine if we already have this audio preloaded.
        // Note: saving a bit of time by only loading one src at a time.
        const _src:string = Array.isArray(src) ? src[0] : src;
        if (audioRef?.current?.[_src]) return audioRef.current[_src];

        // Otherwise, preload it.
        const audio = new Howl({src: _src, ...props});
        return audio;
    }

    function playMusic({
        src,
        crossFadeDuration = 1500,
        volume = 1,
        loop = true,
        ...props
    }: HowlOptions & {crossFadeDuration?: number}) {

        const next = preload({ src: src, loop: loop, volume: 0, ...props });
        next.play();
        next.fade(0, volume, crossFadeDuration);

        if (curMusicRef.current) {
            const old = curMusicRef.current;
            old.fade(old.volume(), 0, crossFadeDuration);
            old.once('fade', () => old.unload());
        }
        curMusicRef.current = next;
        return next;
    }

    function playSound({
        src,
        loop = false,
        ...props
    }: HowlOptions & {crossFadeDuration?: number}) {

        const next = preload({ src: src, loop: loop, ...props });
        next.play();
        return next;
    }

    function getCurrentMusic() {
        return curMusicRef.current;
    }

    function playPlaylist(srcs:string[], options:HowlOptions) {
        
        let index = 0;
        let current:Howl|null = null;

        function playTrack(i:number) {
            
            const o = {
                ...options, 
                src: srcs[i], 
                html5: true, 
                loop: false,
                onend: () => {
                    index++;
                    if (index >= srcs.length) {
                        index = 0;
                    }
                    playTrack(index);
                }
            }

            current = preload({ ...o });
            playMusic({...o, crossFadeDuration: 2000});
        }

        playTrack(index);
        return { 
            stop: () => current?.stop(), 
            get current() { 
                return current; 
            } 
        };
    }

    return {
        preload,
        playMusic,
        playSound,
        playPlaylist,
        getCurrentMusic,
    }
}

export function AudioProvider({ 
    children 
}: {
    children: ReactNode;
}) {
    const state = useAudioState();
    return (
        <AudioContext.Provider value={state}>
            {children}
        </AudioContext.Provider>
    );
}
