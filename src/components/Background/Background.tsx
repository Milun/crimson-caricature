/**
 * Main background behind the game. Crossfades as stages progress.
 */

import clsx from 'clsx';
import { useGame } from '../Game/useGameState';
import './Background.scss';
import { indexToLetter } from '../Game/useGameState';

export default function Background() {


    const {
        activeStageIdx
    } = useGame();

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