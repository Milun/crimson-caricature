/**
 * Feedback splash screen (shown whenever the correct tile is clicked).
 */

import clsx from 'clsx';
import { createPortal } from 'react-dom';
import { useGame } from '../Game/useGameState';
import './Feedback.scss';

export default function Feedback() {

    const {
        hideFeedback
    } = useGame();

    function handleCloseClick() {
        hideFeedback();
    }

    return <div
        className={clsx(
            "feedback"
        )}
    >
        <div className='feedback__content'>
            <div id="feedback-item" />
            <button onClick={handleCloseClick}>Continue</button>
        </div>
    </div>
}

export function FeedbackItem({
    title,
    children
}: {
    title: string,
    children?: React.ReactNode,
}) {

    const parentEl = document.getElementById('feedback-item');
    if (!parentEl) return <></>;

    return createPortal(<>
    
        <h1 className='feedback-item__title'>{title}</h1>
        <div className='feedback-item__img'>
            {children}
        </div>

    </>, parentEl);
}