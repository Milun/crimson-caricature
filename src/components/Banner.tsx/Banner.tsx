/**
 * Banner at the top of the Game.
 */

import clsx from 'clsx';
import { useGame } from '../Game/useGameState';
import './Banner.scss';
import { indexToLetter } from '../Game/useGameState';

type BannerProps = {
    label: string,
    letter: string
}
export default function Banner({
    label,
    letter
} : BannerProps) {


    const {
        activeStageIdx
    } = useGame();

    return <div
        className={clsx(
            "banner"
        )}
    >
        <div className='banner__inner'>
            <img 
                className='banner__img'
                src="game/main/scroll.png" 
            />
            <div className='banner__content'>
                <div className='banner__label'>
                    {label}
                </div>
                <div className='banner__letter'>
                    {letter.toUpperCase()}
                </div>
            </div>
        </div>
    </div>
}