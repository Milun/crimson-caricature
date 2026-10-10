/**
 * Allows other components to add objects to the Matter overlay.
 */

import { createContext, useContext, useState, useCallback, useEffect, useMemo, useId, useRef } from 'react';
import { Engine, Render, Runner, Bodies, Composite } from "matter-js";

type MatterContextProps = {
    addBalloon: (x: number, y:number) => void;
}
import "./Matter.scss";

const MatterContext = createContext<MatterContextProps | null>(null);
const MatterProvider = MatterContext.Provider;

export function useMatter() {

    const ctx = useContext(MatterContext);
    if (!ctx) throw new Error('useMatter() must be used inside a child of a <MatterScope> component');

    const { addBalloon } = ctx;

    return {
        addBalloon
    }
}
export {MatterContext};


type MatterScopeProps = {
    children: React.ReactNode;
    enabled?: boolean
};
export function MatterScope({
    children,
    enabled = true
}: MatterScopeProps) {

    const matterRef = useRef<HTMLDivElement>(null);
    const engine = useRef<Engine>(null);

    const addBalloon = useCallback((x: number, y: number) => {
        // Add balloon here.
        if (!engine.current) return;
        const boxA = Bodies.rectangle(400, 200, 80, 80, {
            render: {
                sprite: {
                    texture: '/hero.png',
                    xScale: 0.1,
                    yScale: 0.1
                }
            }
        });
        Composite.add(engine.current.world, [boxA]);
    }, []);

    const value = useMemo(() => ({ addBalloon }), [addBalloon]);

    // Initial MotionJS setup.
    useEffect(() => {

        if (!enabled) return;
        if (!matterRef.current) return;

        const w = matterRef.current.clientWidth;
        const h = matterRef.current.clientHeight;

        // create an engine
        engine.current = Engine.create();
        engine.current.gravity.y = engine.current.gravity.y*-1; // Invert gravity.

        // create a renderer
        const render = Render.create({
            element: matterRef.current,
            engine: engine.current,
            options: {
                width: w,
                height: h,
                wireframes: false, // Enable for debugging.
                wireframeBackground: 'transparent',
                background: 'transparent'
            }
        });

        // create two boxes and a ground
        const boxA = Bodies.rectangle(400, 200, 80, 80);
        const boxB = Bodies.rectangle(450, 50, 80, 80);
        const ground = Bodies.rectangle(w/2, -10, w*1.25, 20, { isStatic: true });

        // add all of the bodies to the world
        Composite.add(engine.current.world, [boxA, boxB, ground]);

        // run the renderer
        Render.run(render);

        // create runner
        const runner = Runner.create();

        // run the engine
        Runner.run(runner, engine.current);

        // Unmount
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            if (engine.current) Engine.clear(engine.current);
            render.canvas.remove();
        };
    }, [enabled]);

    return (
        <MatterProvider value={value}>
            {children}

            <div
                ref={matterRef}
                className={"matter"}
            />
        </MatterProvider>
    );
}