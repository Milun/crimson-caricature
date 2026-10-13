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

export default function TileL({
    ...props
}: TileProps) {

    const {
        activeStageIdx
    } = useGame();

    const {addBalloon} = useMatter();
    const [offset, setOffset] = useState<{x:number, y:number}>({x: 0, y: 0});

    const [clickCount, setClickCount] = useState(0);

    // Important: reset the tile's offset on each stage change
    // (It can go out of bounds on incorrect stages, but it needs to be visible on the correct one)
    useEffect(() => {
        setOffset({x:0, y:0});
    }, [activeStageIdx]);

    function handleClick(event:MouseEvent<HTMLElement>, isCorrect:boolean) {

        if (isCorrect) return true;

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