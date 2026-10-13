/**
 * Z64 ROM
 * 
 * INCORRECT:
 * Bond shoots; an animation + music plays that effects the whole game.
 * 
 * CORRECT:
 * Normal
 */

import { useState, type MouseEvent } from "react";
import Tile, {type TileProps} from "../Tile";
import { useGame } from "../Game/useGameState";

export default function TileL({
    index,
    ...props
}: TileProps) {

    const [state, setState] = useState<number>(0); // 0 = idle, 1 = shooting, 2 = locked.

    const {
        activeStageIdx,
        playMusic
    } = useGame();

    function handleClick(event:MouseEvent<HTMLElement>, isCorrect:boolean) {

        if (isCorrect) return true;

        if (state === 0) {
            setState(1);
            playMusic('audio/goldeneye-gameover.mp3', {
                loop: false,
                volume: 1
            });

            document.getElementById('game-wrapper')?.classList.add('tilez-gameover');
        }

        return false; // Prevent default.
    }

    return <>
        <Tile 
            index={index}
            imgSrc={`game/z-${state === 1 ? '1' : '0'}.jpg`}
            onClick={handleClick}
            hoverEnabled={state === 0}
            style={{
                transform: `scale(${state === 1 ? '3' : '1'})`
            }}
            {...props}
        />
    </>
}