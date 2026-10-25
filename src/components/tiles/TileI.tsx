/**
 * Invisible
 * 
 * INCORRECT:
 * Shows the image for 'Le Fish Au Chocolat'
 * 
 * CORRECT:
 * Shows no image (transparent tile).
 */

import Tile, {type TileProps} from "../Tile";
import { useGame } from "../Game/useGameState";

export default function TileL({
    index,
    ...props
}: TileProps) {

    const {
        activeStageIdx
    } = useGame();

    return <>
        <Tile 
            index={index}
            imgSrc={activeStageIdx !== index ? "game/i.jpg" : undefined}
            {...props}
        />
    </>
}