/**
 * Main game entry point.
 */

import React, { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import Tile from "../Tile";
import Background from "../Background";
import Board from "../Board";
import Feedback from "../Feedback";
import {MatterScope} from "../Matter";
import {GameProvider, useGame} from "./useGameState";
import { AudioProvider, useAudio } from "./useAudio.tsx";
import Banner from "../Banner.tsx";

import TileI from "../tiles/TileI";
import TileF from "../tiles/TileF";
import TileL from "../tiles/TileL";
import TileZ from "../tiles/TileZ";

import './Game.scss';

type StageProps = {
    letter: string;
    phrase: string;
    tile:   React.ReactElement;
}
const STAGES:StageProps[] = [
    { letter: "A", phrase: "Here we are for fun today, now what begins with the letter", tile: <Tile letter="A" name="A.A.R.D.V.A.R.K" index={0} imgSrc="game/a.jpg" /> },
    { letter: "B", phrase: "That last one was easy, but now we'll see, if you know what starts with", tile: <Tile letter="B" name="Bobo & Lil' Debil" index={1} imgSrc="game/b.jpg" /> },
    { letter: "C", phrase: "By the answer of the last one, I'm sure you're pissed, now what begins with the letter", tile: <Tile letter="C" name="Синяя Борода" index={2} imgSrc="game/c.jpg"  /> },
    { letter: "D", phrase: "Use your eyes and you will see, the one I've hid that starts with", tile: <Tile letter="D" name="Derryn the Dog" index={3} imgSrc="game/d.jpg" /> },
    { letter: "E", phrase: "Until you win, you're stuck with me, now find the one which starts with", tile: <Tile letter="E" name="Einstein, Albert" index={4} imgSrc="game/e.jpg" /> },
    { letter: "F", phrase: "In the future, there's a Jeff. But for now what starts with", tile: <TileF letter="F" name="Flawless work of art" index={5} /> },
    { letter: "G", phrase: "Why did I come up with one for each of these? It ain't so hard, now look for", tile: <Tile letter="G" name="Gumi-chan" index={6} imgSrc="game/g.jpg" incorrectAudioSrc="audio/wuewuewue.mp3" /> },
    { letter: "H", phrase: ".........the fuck rhymes with", tile: <Tile letter="H" name="Holli Would" index={7} imgSrc="game/h.jpg" /> },
    { letter: "I", phrase: "You'll need to search low and high to find the one that starts with", tile: <TileI letter="I" name="Invisible Fish" index={8} /> },
    { letter: "J", phrase: "Please be quick, don't spend all day, looking for the letter", tile: <Tile letter="J" name="Jake English impersonator" index={9} imgSrc="game/j.jpg" /> },
    { letter: "K", phrase: "I've run out of things to say, while I think, go find the", tile: <Tile letter="K" name="K" index={10} /> },
    { letter: "L", phrase: "You're half way there, and doing swell. Now what starts wth the letter", tile: <TileL letter="L" name="Laughing Gnome" index={11} /> },
    { letter: "M", phrase: "I'm sure this next one is a gem, and it begins with the letter", tile: <Tile letter="M" name="M" index={12} /> },
    { letter: "N", phrase: "So we're back here once again. What begins with the letter", tile: <Tile letter="N" name="Nebuchadnezzar" index={13} imgSrc="game/n.jpg" /> },
    { letter: "O", phrase: "Only those who are in the know will know the one which starts with", tile: <Tile letter="O" name="O" index={14} /> },
    { letter: "P", phrase: "The answer to this one is new to me, now what starts with the letter", tile: <Tile letter="P" name="Pioneer 9" index={15} imgSrc="game/p.jpg" /> },
    { letter: "Q", phrase: "You know what you have to do, find the one which starts with", tile: <Tile letter="Q" name="Quizzical Mr. Jeff, The" index={16} imgSrc="game/q.jpg" /> },
    { letter: "R", phrase: "You won't have to search very far to find the one which starts with", tile: <Tile letter="R" name="R" index={17} /> },
    { letter: "S", phrase: "Look how you've cleared out this mess, now tell me which of these is", tile: <Tile letter="S" name="Spin Cycle" index={18} imgSrc="game/s.jpg" /> },
    { letter: "T", phrase: "My voice is giving out I see, can someone please get me some", tile: <Tile letter="T" name="Time to turn the TV off" index={19} imgSrc="game/t.jpg" /> },
    { letter: "U", phrase: "Roses are red and violets are PURPLE. Honey is sweet but not as sweet as", tile: <Tile letter="U" name="U" index={20} /> },
    { letter: "V", phrase: "Vinny Vinny Vinny Vinny Vinny Vinny Vinny Vinny Vinny Vinny Vinny Vinny", tile: <Tile letter="V" name="V" index={21} imgSrc="game/v.jpg" /> },
    { letter: "W", phrase: "I promise this round will not trouble you, when you find what starts with", tile: <Tile letter="W" name="W" index={22} /> },
    { letter: "X", phrase: "Bitch lasagna", tile: <Tile letter="X" name="Xheffajell" index={23} imgSrc="game/x.jpg" /> },
    { letter: "Y", phrase: "You're nearly there, no need to cry. Just find the one which starts with", tile: <Tile letter="Y" name="Y" index={24} /> },
    { letter: "Z", phrase: "Grunty's rhymes live rent-free in my head, to free yourselves, you must find", tile: <TileZ letter="Z" name=".z64 ROM file" index={25} /> },

    // Red herring
    { letter: "", phrase: "", tile: <Tile letter="FAKE" name="" index={99} imgSrc="game/0.jpg" /> },
];

function GameMain() {

    const {
        feedbackActive,
        activeStageIdx,
        setActiveStageIdx
    } = useGame();

    const {
        playPlaylist
    } = useAudio();

    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
        if (activeStageIdx >= 0) setGameActive(true);
    }, [activeStageIdx]);

    useEffect(() => {

        // FIXME: Needs a clickable overlay.
        /*playPlaylist([
            'audio/uhoh.mp3',
            'audio/bgm-1.opus',
            'audio/bgm-2.opus',
            'audio/bgm-3.opus',
            'audio/bgm-4.opus',
            'audio/bgm-5.opus',
        ], {src: '', volume: 0.25});*/

    }, [gameActive]);

    return <>
        <div className="game-wrapper" id="game-wrapper">
            {gameActive && <>
                <Background />
                <div
                    id="game"
                    className={clsx(
                        "game"
                    )}
                >
                    <header className="p-4">
                        {activeStageIdx >= 0 &&
                            <Banner 
                                letter={STAGES[activeStageIdx].letter}
                                label={STAGES[activeStageIdx].phrase}
                            />
                        }
                    </header>
                    <div className="position-relative p-4">
                        <MatterScope enabled={true} >
                            <div className="game__main">
                                <div 
                                    className={clsx(
                                        "game__board",
                                        feedbackActive && 'is-hidden'
                                    )}
                                >
                                    <Board
                                        columnCount={9 - Math.floor(activeStageIdx/6)}
                                    >
                                        {STAGES.map((stage, idx) => {
                                            if (idx < activeStageIdx) return;
                                            return (
                                                <React.Fragment key={idx}>
                                                    {stage.tile}
                                                </React.Fragment>
                                            );
                                        })}
                                    </Board>
                                </div>
                                <div 
                                    className={clsx(
                                        "game__feedback",
                                        feedbackActive || 'is-hidden'
                                    )}
                                >
                                    <Feedback />
                                </div>
                            </div>
                        </MatterScope>
                    </div>
                </div>
            </>}
            {!gameActive && 
                <div 
                    id="game-splash"
                    className="game-splash" 
                    style={{
                        backgroundImage: `url(game/bgs/bg-splash.jpg)`
                    }}
                >
                    <button onClick={() => {
                        setActiveStageIdx(0);
                    }}>
                        Start
                    </button>
                </div>
            }
        </div>
        <div className="game-overlay" id="game-overlay" />
    </>
}


type GameProps = {};
export default function Game({}: GameProps) {

    return <>
        <GameProvider>
            <AudioProvider>
                <GameMain />
            </AudioProvider>
        </GameProvider>
    </>
}