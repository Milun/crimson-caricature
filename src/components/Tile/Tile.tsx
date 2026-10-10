/**
 * Generic wrapper for each letter tile
 */

import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";
import clsx from "clsx";
import { useMatter } from "../Matter";
import { useGame } from "../Game/useGameState";

import "./Tile.scss";
import "../tiles/tilesCustom.scss";

export type TileProps = {
    letter: string,     // A-Z,
    name: string,       // Name/description of the tile to show on the splash screen,
    index: number,      // When this === gameState's index, this tile is the one which should be chosen.
    
    children?: React.ReactNode,
    imgSrc?: string,                            // Image to use (for generic tiles)
    onClick?: (event:MouseEvent<HTMLElement>, isCorrect:boolean) => boolean    // Custom onClick event. Return false to prevent the tile's default click event.
    style?: React.CSSProperties
};
export default function Tile({
    letter,
    name,
    index,

    children,
    imgSrc,
    onClick,
    style
}: TileProps) {

    const {
        activeStageIdx,
        showFeedback
    } = useGame();
    const {addBalloon} = useMatter();

    const isCorrect = activeStageIdx === index; 

    function handleClick(event:MouseEvent<HTMLElement>) {

        if (onClick?.(event, isCorrect) === false) return; // Prevent default callback if custom event returns false.

        if (!isCorrect) {
            addBalloon({
                src: 'game/balloons/oops.png',
                x: event.clientX,
                y: event.clientY,
                width: 100,
                height: 35,
            });
        }
        else {
            myShowFeedback();
        }
    }

    function myShowFeedback() {
        showFeedback(name);
    }

    return <>
        <div
            className={clsx(
                "tile",
                `tile--${letter.toLowerCase()}`
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
                {letter}
            </div>
        </div>
    </>
}