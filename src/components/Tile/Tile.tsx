/**
 * Generic wrapper for each letter tile
 */

import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";
import clsx from "clsx";
import { useMatter } from "../Matter";
import { useGame } from "../Game/useGameState";
import { useAudio } from "../Game/useAudio";

import "./Tile.scss";
import "../tiles/tilesCustom.scss";

export type TileProps = {
    letter: string,     // A-Z,
    name: string,       // Name/description of the tile to show on the splash screen,
    index: number,      // When this === gameState's index, this tile is the one which should be chosen.
    
    children?: React.ReactNode,
    imgSrc?: string,                            // Image to use (for generic tiles)
    onClick?: (event:MouseEvent<HTMLElement>, isCorrect:boolean) => boolean    // Custom onClick event. Return false to prevent the tile's default click event.
    style?: React.CSSProperties,

    incorrectAudioSrc?: string,

    hoverEnabled?: boolean
};
export default function Tile({
    letter,
    name,
    index,

    children,
    imgSrc,
    onClick,
    style,
    hoverEnabled = true,
    
    incorrectAudioSrc = 'audio/oops.mp3',
}: TileProps) {

    const {
        activeStageIdx,
        showFeedback,
        activeStageLetter
    } = useGame();
    
    const {
        addBalloon
    } = useMatter();

    const {
        preload,
        playSound
    } = useAudio();

    preload({src: 'audio/yippee.mp3'});
    preload({src: incorrectAudioSrc});
    preload({src: 'audio/uhoh.mp3'});

    const isCorrect = activeStageIdx === index; 
    
    // On the letter 'V' round, every tile becomes Vinny.
    const stageVinny = (letter.toLowerCase() === 'v' || activeStageLetter === 'v');
    if (stageVinny) {
        imgSrc = 'game/v.jpg';
    }

    function handleClick(event:MouseEvent<HTMLElement>) {

        // Disable custom click events during stageVinny.
        if (!stageVinny && onClick?.(event, isCorrect) === false) return; // Prevent default callback if custom event returns false.

        if (!isCorrect) {

            if (stageVinny) {
                addBalloon({
                    src: 'game/balloons/vinny.png',
                    x: event.clientX,
                    y: event.clientY,
                    width: 100,
                    height: 100,
                    scale: 0.8,
                    shape: 'circle'
                });
                playSound({src: 'audio/uhoh.mp3', volume: 0.7});
            }
            else {
                const r = Math.floor(Math.random()*3);

                addBalloon({
                    src: `game/balloons/oops-${r}.png`,
                    x: event.clientX,
                    y: event.clientY,
                    width: 100,
                    height: 35,
                });
                playSound({src: incorrectAudioSrc, volume: 0.7});
            }
        }
        else {
            myShowFeedback();
            playSound({src: 'audio/yippee.mp3'});
        }
    }

    function myShowFeedback() {
        showFeedback(name);
    }

    return <>
        <div
            className={clsx(
                "tile",
                `tile--${letter.toLowerCase()}`,
                hoverEnabled && 'hover-enabled'
            )}
            onClick={handleClick}
            style={style}
        >
            <div 
                className="tile__content"
                style={{
                    backgroundImage: imgSrc ? `url(${imgSrc})` : '',
                }}
            >
                {children}
                {/*letter*/}
            </div>
        </div>
    </>
}