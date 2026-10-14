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
                    <span
                        style={{
                            fontSize: `${label.length > 70 ? 0.8 : 1}em`
                        }}
                    >{label}</span>
                </div>
                <div className='banner__letter'>
                    {letter.toUpperCase()}
                </div>
            </div>
        </div>
    </div>
}