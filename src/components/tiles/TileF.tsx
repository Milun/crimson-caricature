/**
 * Laughing Gnome
 * 
 * INCORRECT:
 * Tile moves away on click; spawn laughing bubbles
 * 
 * CORRECT:
 * Normal
 */

import { useEffect, useState, type MouseEvent } from "react";
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

    const {
        preload,
        playSound
    } = useAudio();

    preload({src: 'audio/can.mp3'});

    const {addBalloon} = useMatter();

    function handleClick(event:MouseEvent<HTMLElement>, isCorrect:boolean) {

        if (isCorrect) return true;

        addBalloon({
            src: `game/balloons/can.png`,
            x: event.clientX,
            y: event.clientY,
            width: 58,
            height: 100,
        });

        playSound({src: 'audio/can.mp3', volume: 0.5});

        return false; // Prevent default.
    }

    return <>
        <Tile 
            imgSrc="game/f.jpg"
            onClick={handleClick}
            {...props}
        />
    </>
}