/**
 * Generic wrapper for each letter tile
 */

import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";
import clsx from "clsx";
import { useMatter } from "../Matter";

import "./Tile.scss";
import "../tiles/tilesCustom.scss";

export type TileProps = {
    letter: string,     // A-Z,
    name: string,       // Name/description of the tile to show on the splash screen,
    index: number,      // When this === gameState's index, this tile is the one which should be chosen.
    
    children?: React.ReactNode,
    imgSrc?: string,                            // Image to use (for generic tiles)
    onClick?: (isCorrect:boolean) => boolean    // Custom onClick event. Return false to prevent the tile's default click event.
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

    const {addBalloon} = useMatter();

    function handleClick(event:MouseEvent<HTMLElement>) {

        if (onClick?.(false) === false) return; // Prevent default callback if custom event returns false.
        addBalloon(0,0);
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