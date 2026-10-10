/**
 * Feedback splash screen (shown whenever the correct tile is clicked).
 */

import clsx from 'clsx';
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
        FEEDBACK
        <button onClick={handleCloseClick}>Hide</button>
    </div>
}