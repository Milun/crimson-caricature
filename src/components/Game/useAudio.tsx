
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
    playMusic: (options:HowlOptions & {crossFadeDuration?: number}) => void,
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
    }

    return {
        preload,
        playMusic
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
