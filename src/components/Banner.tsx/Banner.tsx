/**
 * Banner at the top of the Game.
 */

import clsx from 'clsx';
import { useGame } from '../Game/useGameState';
import './Banner.scss';
import { indexToLetter } from '../Game/useGameState';
import { useMatter } from '../Matter';

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

    const {
        objectCount,
        clear
    } = useMatter();

    return <div
        className={clsx(
            "banner"
        )}
        style={{
            visibility: activeStageIdx < 26 ? 'visible' : 'hidden'
        }}
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
        
        {objectCount > 20 && <div 
            className='banner__clear'
            onClick={clear}
        >
            <img src="game/main/recycle.png" />
        </div>}
        <div 
            className='banner__score'
        >
            <div>
                <div>{(activeStageIdx+1) * 5}</div>
                <div style={{fontSize: '0.25em'}}>Points</div>
            </div>
        </div>
    </div>
}