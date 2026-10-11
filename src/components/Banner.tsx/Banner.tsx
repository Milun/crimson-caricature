/**
 * Banner at the top of the Game.
 */

import clsx from 'clsx';
import { useGame } from '../Game/useGameState';
import './Banner.scss';
import { indexToLetter } from '../Game/useGameState';

export default function Banner() {


    const {
        activeStageIdx
    } = useGame();

    return <div
        className={clsx(
            "banner"
        )}
    >
        <div className='banner__content'>
            <img 
                className='banner__img'
                src="game/main/scroll.png" 
            />
        </div>
    </div>
}