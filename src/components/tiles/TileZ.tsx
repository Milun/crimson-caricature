/**
 * Z64 ROM
 * 
 * INCORRECT:
 * Bond shoots; an animation + music plays that effects the whole game.
 * 
 * CORRECT:
 * Normal
 */

import { useEffect, useState, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import Tile, {type TileProps} from "../Tile";
import { useGame } from "../Game/useGameState";
import { useAudio } from "../Game/useAudio";

export default function TileL({
    index,
    ...props
}: TileProps) {

    const [state, setState] = useState<number>(0); // 0 = idle, 1 = shooting, 2 = locked.

    const {
        activeStageIdx,
    } = useGame();

    const {
        preload,
        playMusic
    } = useAudio();

    preload({src: 'audio/goldeneye-gameover.mp3'});

    const overlayEl = document.getElementById('game-overlay');
    const gameWrapperEl = document.getElementById('game-wrapper');

    function handleClick(event:MouseEvent<HTMLElement>, isCorrect:boolean) {

        if (isCorrect || state === 2) return true;

        if (state === 0) {
            setState(1);
        }

        return false; // Prevent default.
    }

    function handleOverlayClick() {
        setState(2);
    }

    useEffect(() => {

        switch (state) {

            case 0:
                break;

            case 1:
                playMusic({
                    src: 'audio/goldeneye-gameover.mp3',
                    loop: false,
                    volume: 1,
                    crossFadeDuration: 0
                });
                gameWrapperEl?.classList.add('tilez-anim');
                break;

            case 2:
                gameWrapperEl?.classList.remove('tilez-anim');
                break;
        }

    }, [state]);

    // Reset state once the stage changes.
    useEffect(() => {
        setState(0);
    }, [activeStageIdx])


    return <>
        <Tile 
            index={index}
            imgSrc={`game/z-${state}.jpg`}
            onClick={handleClick}
            hoverEnabled={state !== 1}
            style={{
                transform: `scale(${state === 1 ? '3' : '1'})`
            }}
            {...props}
        />
        {state === 1 && overlayEl && createPortal(<>
            <div className="tilez-overlay">
                <div className="tilez-overlay__wipe">
                    <div className="tilez-overlay__wipe-inner">
                        <div className="tilez-overlay__wipe-top" />
                        <img src="game/wipe.png"  className="tilez-overlay__wipe-bottom" />
                    </div>
                </div>
                <div 
                    className="tilez-overlay__fade"
                    onClick={handleOverlayClick}
                >
                    <div>Lose <span>007</span> points</div>
                </div>
            </div>
        </>, overlayEl)}
    </>
}