/**
 * Generic wrapper for each letter tile
 */

import { useRef, useState, useEffect, useCallback, type MouseEvent } from "react";
import clsx from "clsx";
import { useMatter } from "../Matter";

import "./Tile.scss";

export type TileProps = {
    letter: string,     // A-Z,
    index: number,      // When this === gameState's index, this tile is the one which should be chosen.
};
export default function Tile({
    letter,
    index
}: TileProps) {

    const {addBalloon} = useMatter();

    function handleClick(event:MouseEvent<HTMLElement>) {

        addBalloon(0,0);
    }

    return <>
        <div
            className={clsx(
                "tile"
            )}
            onClick={handleClick}
        >
            <div 
                className="tile__content"
            >
                {letter}
            </div>
        </div>
    </>
}