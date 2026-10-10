/**
 * Main game entry point.
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import Tile from "../Tile";
import Board from "../Board";
import {MatterScope} from "../Matter";

import TileL from "../tiles/TileL";

import './Game.scss';

type StageProps = {
    letter: string;
    tile:   React.ReactElement;
}
const STAGES:StageProps[] = [
    { letter: "A", tile: <Tile letter="A" name="A" index={0} /> },
    { letter: "B", tile: <Tile letter="B" name="B" index={1} /> },
    { letter: "C", tile: <Tile letter="C" name="C" index={2} /> },
    { letter: "D", tile: <Tile letter="D" name="D" index={3} /> },
    { letter: "E", tile: <Tile letter="E" name="E" index={4} /> },
    { letter: "F", tile: <Tile letter="F" name="F" index={5} /> },
    { letter: "G", tile: <Tile letter="G" name="G" index={6} /> },
    { letter: "H", tile: <Tile letter="H" name="H" index={7} /> },
    { letter: "I", tile: <Tile letter="I" name="I" index={8} /> },
    { letter: "J", tile: <Tile letter="J" name="J" index={9} /> },
    { letter: "K", tile: <Tile letter="K" name="K" index={10} /> },
    { letter: "L", tile: <TileL letter="L" name="Laughing Gnome" index={11} /> },
    { letter: "M", tile: <Tile letter="M" name="M" index={12} /> },
    { letter: "N", tile: <Tile imgSrc="game/n.jpg" letter="N" name="N" index={13} /> },
    { letter: "O", tile: <Tile letter="O" name="O" index={14} /> },
    { letter: "P", tile: <Tile letter="P" name="P" index={15} /> },
    { letter: "Q", tile: <Tile letter="Q" name="Q" index={16} /> },
    { letter: "R", tile: <Tile letter="R" name="R" index={17} /> },
    { letter: "S", tile: <Tile letter="S" name="S" index={18} /> },
    { letter: "T", tile: <Tile letter="T" name="T" index={19} /> },
    { letter: "U", tile: <Tile letter="U" name="U" index={20} /> },
    { letter: "V", tile: <Tile letter="V" name="V" index={21} /> },
    { letter: "W", tile: <Tile letter="W" name="W" index={22} /> },
    { letter: "X", tile: <Tile letter="X" name="X" index={23} /> },
    { letter: "Y", tile: <Tile letter="Y" name="Y" index={24} /> },
    { letter: "Z", tile: <Tile letter="Z" name="Z" index={25} /> },
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
                <MatterScope enabled={false} >
                    <Board
                        columnCount={7}
                    >
                        {STAGES.map((stage, idx) => {
                            return (
                                <React.Fragment key={idx}>
                                    {stage.tile}
                                </React.Fragment>
                            );
                        })}
                    </Board>
                </MatterScope>
            </div>
        </div>
    </>
}