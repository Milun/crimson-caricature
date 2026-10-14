/**
 * Main background behind the game. Crossfades as stages progress.
 */

import clsx from 'clsx';
import { useGame } from '../Game/useGameState';
import './Background.scss';
import { indexToLetter } from '../Game/useGameState';
import { useAudio } from '../Game/useAudio';
import { useEffect } from 'react';

export default function Background() {


    const {
        activeStageIdx,
        activeStageLetter
    } = useGame();

    const {
        preload,
        playMusic
    } = useAudio();

    preload({src: 'audio/bgm-danger.mp3', loop: true});
    useEffect(() => {
        if (activeStageLetter.toLowerCase() === 'v') {
            playMusic({src: 'audio/bgm-danger.mp3', loop: true, crossFadeDuration: 4000, volume: 0.5});
        }
    }, [activeStageIdx]);

    return <div
        className={clsx(
            "background"
        )}
    >
        <div style={{opacity: 0.6}}>
            <BackgroundItem src={'game/bgs/bg-stage.jpg'} active={true} />
            <BackgroundItem src={'game/bgs/bg-mtg.jpg'} active={activeStageIdx > 7} />
            <BackgroundItem src={'game/bgs/bg-ballpit.jpg'} active={activeStageIdx > 14} />
            <BackgroundItem src={'game/bgs/bg-mtg2.jpg'} active={activeStageIdx > 15} />
            <BackgroundItem src={'game/bgs/bg-meatloaf-scary.jpg'} active={activeStageIdx > 20} />
            <BackgroundItem src={'game/bgs/bg-vinny.jpg'} active={indexToLetter(activeStageIdx) === 'v'} />
        </div>

        {/* Fake Muppet RaceMania loading bar. */}
        <div 
            className='beaker'
            style={{
                // Start off hidden for a few rounds
                transform: `translateY(${(Math.max(0, 1-(activeStageIdx/8))) * 70}%)`
            }}
        >
            <img 
                className='beaker__main'
                src={'game/main/beaker-main.png'}
                style={{
                    transform: `translateY(${(1-(activeStageIdx/25)) * 60}%)`
                }}
            />
            <img 
                className='beaker__base'
                src={'game/main/beaker-base.png'} 
            />
        </div>
    </div>
}

function BackgroundItem({
    active,
    children,
    src
} : {
    active: boolean, // Background fades in here.
    children?: React.ReactNode,
    src?: string,
}) {
    return <div 
        className={clsx(
            'background__item',
            active && 'active'
        )}
        style={{
            backgroundImage: src ? `url(${src})` : ''
        }}
    >
        {children}
    </div>
}