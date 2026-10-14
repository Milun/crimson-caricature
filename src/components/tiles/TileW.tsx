/**
 * Laughing Gnome
 * 
 * INCORRECT:
 * Tile moves away on click; spawn laughing bubbles
 * 
 * CORRECT:
 * Normal
 */

import { useRef, useEffect, useState, type MouseEvent } from "react";
import Tile, {type TileProps} from "../Tile";
import { useMatter } from "../Matter";
import { useGame } from "../Game/useGameState";
import { useAudio } from "../Game/useAudio";

export default function TileL({
    ...props
}: TileProps) {

    const {
        activeStageIdx
    } = useGame();

    const [transform, setTransform] = useState('');

    useEffect(() => {

        let stream: MediaStream | null = null;
        let ctx: AudioContext | null = null;
        let raf = 0;
        let cancelled = false;

        (async () => {
            stream = await navigator.mediaDevices.getUserMedia({
                // Browser voice processing flattens levels; turn it off for a livelier response
                audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
            });
            if (cancelled) { stream.getTracks().forEach((t) => t.stop()); return; }

            ctx = new AudioContext();
            await ctx.resume(); // may need a user gesture first (see note)
            const analyser = ctx.createAnalyser();
            analyser.fftSize = 512;
            ctx.createMediaStreamSource(stream).connect(analyser); // don't connect to destination, or you'll hear yourself

            const data = new Float32Array(analyser.fftSize);
            let level = 0;

            const tick = () => {
                analyser.getFloatTimeDomainData(data);
                let sum = 0;
                for (const v of data) sum += v * v;
                const rms = Math.sqrt(sum / data.length); // roughly 0–0.5 for normal speech

                // Rise fast, fall slowly, for a punchy bounce
                const target = Math.min(rms * 4, 1);
                level += (target - level) * (target > level ? 0.5 : 0.1);

                setTransform(`translateY(${-level * 140}px)`);
                raf = requestAnimationFrame(tick);
            };
            tick();
        })().catch((err) => console.error("Mic unavailable:", err));

        return () => {
            cancelled = true;
            cancelAnimationFrame(raf);
            stream?.getTracks().forEach((t) => t.stop());
            ctx?.close();
        };
    }, []);

    return <>
        <Tile 
            imgSrc="game/w.jpg"
            style={{
                transform: transform
            }}
            {...props}
        />
    </>
}