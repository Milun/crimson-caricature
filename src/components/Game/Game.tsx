/**
 * Main game entry point.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import Tile, { type TileProps } from "../Tile";
import Board from "../Board";
import {MatterScope} from "../Matter";

import './Game.scss';

type StageProps = {
    letter: string;
    tile:   React.ComponentType<TileProps>;
}
const STAGES:StageProps[] = [
    { letter: "A", tile: Tile },
    { letter: "B", tile: Tile },
    { letter: "C", tile: Tile },
    { letter: "D", tile: Tile },
    { letter: "E", tile: Tile },
    { letter: "F", tile: Tile },
    { letter: "G", tile: Tile },
    { letter: "H", tile: Tile },
    { letter: "I", tile: Tile },
    { letter: "J", tile: Tile },
    { letter: "K", tile: Tile },
    { letter: "L", tile: Tile },
    { letter: "M", tile: Tile },
    { letter: "N", tile: Tile },
    { letter: "O", tile: Tile },
    { letter: "P", tile: Tile },
    { letter: "Q", tile: Tile },
    { letter: "R", tile: Tile },
    { letter: "S", tile: Tile },
    { letter: "T", tile: Tile },
    { letter: "U", tile: Tile },
    { letter: "V", tile: Tile },
    { letter: "W", tile: Tile },
    { letter: "X", tile: Tile },
    { letter: "Y", tile: Tile },
    { letter: "Z", tile: Tile },
];


type GameProps = {};
export default function Game({}: GameProps) {

    return <>
        <div
            id="game"
            className={clsx(
                "game"
            )}
        >
            <header className="p-4">
                HEADER TBA
            </header>
            <div className="p-4">
                <MatterScope>
                    <Board
                        columnCount={10}
                    >
                        {STAGES.map((stage, idx) => {
                            return (
                                <Tile
                                    key={idx}
                                    letter={stage.letter}
                                    index={idx}
                                />
                            );
                        })}
                    </Board>
                </MatterScope>
            </div>
        </div>
    </>
}