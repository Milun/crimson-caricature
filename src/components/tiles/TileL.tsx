/**
 * Laughing Gnome
 * 
 * INCORRECT:
 * Tile moves away on click; spawn laughing bubbles
 * 
 * CORRECT:
 * Normal
 */

import { useState } from "react";
import Tile, {type TileProps} from "../Tile";

export default function TileL({
    ...props
}: TileProps) {

    const [offset, setOffset] = useState<{x:number, y:number}>({x: 0, y: 0});

    function handleClick(isCorrect:boolean) {

        // Pick a random direction to run away from the cursor.
        const off = {...offset};
        const r = Math.random()*2*Math.PI;
        off.x += Math.cos(r);
        off.y += Math.sin(r);
        setOffset(off);

        return false; // Prevent default.
    }

    return <>
        <Tile 
            imgSrc="game/l.jpg"
            style={{
                transform: `translate(${offset.x*100}%, ${offset.y*100}%)`
            }}
            onClick={handleClick}
            {...props}
        />
    </>
}