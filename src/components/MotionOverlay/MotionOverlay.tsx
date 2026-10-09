/**
 * Overlay which renders Motion.js "balloons" that stay at the top of the screen.
 */

import { useRef, useState, useEffect, useCallback } from "react";
import clsx from "clsx";

import { Engine, Render, Runner, Bodies, Composite } from "matter-js";

import "./MotionOverlay.scss";

export type MotionOverlayProps = {
    
};
export default function MotionOverlay({
}: MotionOverlayProps) {

    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {

        if (!ref.current) return;

        const w = ref.current.clientWidth;
        const h = ref.current.clientHeight;

        // create an engine
        const engine = Engine.create();
        engine.gravity.y = engine.gravity.y*-1; // Invert gravity.

        // create a renderer
        const render = Render.create({
            element: ref.current,
            engine: engine,
            options: {
                width: w,
                height: h,
                wireframeBackground: 'transparent',
                background: 'transparent'
            }
        });

        // create two boxes and a ground
        const boxA = Bodies.rectangle(400, 200, 80, 80);
        const boxB = Bodies.rectangle(450, 50, 80, 80);
        const ground = Bodies.rectangle(w/2, -10, w*1.25, 20, { isStatic: true });

        // add all of the bodies to the world
        Composite.add(engine.world, [boxA, boxB, ground]);

        // run the renderer
        Render.run(render);

        // create runner
        const runner = Runner.create();

        // run the engine
        Runner.run(runner, engine);

        // Unmount
        return () => {
            Render.stop(render);
            Runner.stop(runner);
            Engine.clear(engine);
            render.canvas.remove();
        };
    }, []);

    return <>
        <div
            ref={ref}
            className={clsx(
                "motion-overlay"
            )}
        >
            
        </div>
    </>
}