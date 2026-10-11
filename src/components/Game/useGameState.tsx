
import { createContext, useContext, useState, useCallback, useMemo, type ReactNode, useEffect } from "react";

export type GameState = {

    activeStageIdx: number,                 // Index of the tile we're currently looking at.
    activeStageLetter: string,              // Shortcut for converting the above.
    setActiveStageIdx: (idx:number) => void,

    feedbackActive: boolean,
    showFeedback: (title: string) => void,  // When called, fades out the board and shows feedback for the clicked tile.
    hideFeedback: () => void,
}

const GameContext = createContext<GameState | null>(null);

export function useGame(): GameState {
    const ctx = useContext(GameContext);
    if (!ctx) throw new Error('useGame() must be used inside a <GameProvider>');
    return ctx;
}

// 0 = a, 25 = z
export function indexToLetter(idx: number) {
    if (idx > 25 || idx < 0) idx = 0;
    return String.fromCharCode(idx + 97);
}
export function letterToIndex(letter: string) {
    let idx = letter.charCodeAt(0) - 97;
    if (idx < 0 || idx > 25) idx = 0;
    return idx;
}

function useGameState(): GameState {

    // Detect if we're in editor mode or not.
    const urlStage = new URLSearchParams(window.location.search)?.get('stage') ?? '0';
    const urlStageIdx = isNaN(Number(urlStage)) ? letterToIndex(urlStage) : parseInt(urlStage);

    const [activeStageIdx, setActiveStageIdx] = useState(urlStageIdx);   // Index of the current block.
    
    const [feedbackActive, setFeedbackActive] = useState(false);

    // Allows for resetting of the currently active block.
    const [resetKey, setResetKey] = useState(0);

    useEffect(() => {

        // Update the URL when activeStageIdx changes.
        const url = new URL(window.location.href);
        url.searchParams.set('stage', `${indexToLetter(activeStageIdx)}`);
        window.history.replaceState({}, '', url);

    }, [activeStageIdx]);

    function showFeedback(title: string) {
        setFeedbackActive(true);
    }

    function hideFeedback() {
        setFeedbackActive(false);
        setActiveStageIdx(activeStageIdx+1);
    }

    return {
        activeStageIdx,
        activeStageLetter: indexToLetter(activeStageIdx),
        setActiveStageIdx,
        showFeedback,
        hideFeedback,
        feedbackActive
    }
}

type GameProviderProps = {
    children: ReactNode;
};
export function GameProvider({ children }: GameProviderProps) {
    const state = useGameState();
    return (
        <GameContext.Provider value={state}>
            {children}
        </GameContext.Provider>
    );
}
