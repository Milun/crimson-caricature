/**
 * Main background behind the game. Crossfades as stages progress.
 */

import clsx from 'clsx';
import { useGame } from '../Game/useGameState';
import './Background.scss';
import { indexToLetter } from '../Game/useGameState';
import { useAudio } from '../Game/useAudio';
import { useEffect } from 'react';
import { Webcam } from './Webcam';
import { useRef } from 'react';

export default function Background() {


    const {
        activeStageIdx,
        activeStageLetter
    } = useGame();

    const {
        preload,
        playSound,
        muteBGM,
        unmuteBGM
    } = useAudio();

    const bgmDanger = useRef<Howl>(null);

    preload({src: 'audio/bgm-danger.mp3', loop: true});
    useEffect(() => {
        if (activeStageLetter.toLowerCase() === 'v') {
            muteBGM(1000);
            bgmDanger.current = playSound({src: 'audio/bgm-danger.mp3', loop: true, volume: 0.4});
        }
        else if (activeStageLetter.toLowerCase() === 'w') {
            unmuteBGM(0.1, 0);
            bgmDanger.current?.stop();
            bgmDanger.current?.unload();
        }
    }, [activeStageLetter]);

    return <div
        className={clsx(
            "background"
        )}
    >
        <div style={{opacity: 0.6}}>
            <BackgroundItem src={'game/bgs/bg-stage.jpg'} active={true} />
            <BackgroundItem src={'game/bgs/bg-2.jpg'} active={activeStageIdx === 4} stretch />
            <BackgroundItem src={'game/bgs/bg-mtg.jpg'} active={activeStageIdx > 7} />
            <BackgroundItem src={'game/bgs/bg-mtg2.jpg'} active={activeStageIdx > 10} />
            <BackgroundItem active={activeStageIdx > 13}><Webcam /></BackgroundItem>
            <BackgroundItem src={'game/bgs/bg-meatloaf-scary.jpg'} active={activeStageIdx > 17} />
            <BackgroundItem src={'game/bgs/bg-1.jpg'} active={activeStageIdx > 21} stretch />
            <BackgroundItem src={'game/bgs/bg-vinny.jpg'} active={indexToLetter(activeStageIdx) === 'v'} />
            <BackgroundItem src={'game/bgs/bg-end.jpg'} active={activeStageIdx >= 26} />
        </div>

        {/* Fake Muppet RaceMania loading bar. */}
        {activeStageIdx < 26 && <div 
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
        </div>}
    </div>
}

function BackgroundItem({
    active,
    children,
    src,
    stretch = false
} : {
    active: boolean, // Background fades in here.
    children?: React.ReactNode,
    src?: string,
    stretch?: boolean
}) {
    return <div 
        className={clsx(
            'background__item',
            active && 'active'
        )}
        style={{
            backgroundImage: src ? `url(${src})` : '',
            backgroundSize: stretch ? '100% 100%' : 'cover'
        }}
    >
        {children}
    </div>
}