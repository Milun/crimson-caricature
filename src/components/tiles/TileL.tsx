/**
 * Laughing Gnome
 * 
 * INCORRECT:
 * Tile moves away on click; spawn laughing bubbles
 * 
 * CORRECT:
 * Normal
 */

import { useState, type MouseEvent } from "react";
import Tile, {type TileProps} from "../Tile";
import { useMatter } from "../Matter";

export default function TileL({
    ...props
}: TileProps) {

    const {addBalloon} = useMatter();
    const [offset, setOffset] = useState<{x:number, y:number}>({x: 0, y: 0});

    const [clickCount, setClickCount] = useState(0);

    function handleClick(event:MouseEvent<HTMLElement>, isCorrect:boolean) {

        // Pick a random direction to run away from the cursor.
        const off = {...offset};
        const r = Math.random()*2*Math.PI;
        off.x += Math.cos(r);
        off.y += Math.sin(r);
        setOffset(off);

        addBalloon({
            src: `game/balloons/${clickCount%2 ? 'hehehe' : 'hahaha'}.png`,
            x: event.clientX,
            y: event.clientY,
            width: 140,
            height: 30,
        });

        setClickCount(clickCount+1);

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