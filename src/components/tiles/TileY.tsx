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
import { Webcam } from "../Background/Webcam";

export default function TileL({
    ...props
}: TileProps) {

    const {
        activeStageLetter
    } = useGame();

    return <>
        <Tile 
            {...props}
        >
            {activeStageLetter.toLowerCase() !== 'v' && <Webcam 
                width={500}
                height={500}
            />}
        </Tile>
    </>
}