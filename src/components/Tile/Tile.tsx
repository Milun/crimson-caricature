/**
 * Generic wrapper for each letter tile
 */

import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import "./Tile.scss";

export type TileProps = {
    letter: string,     // A-Z,
    index: number,      // When this === gameState's index, this tile is the one which should be chosen.
};
export default function Tile({
    letter,
    index
}: TileProps) {

    return <>
        <div
            className={clsx(
                "tile"
            )}
        >
            <div className="tile__content">
                {letter}
            </div>
        </div>
    </>
}