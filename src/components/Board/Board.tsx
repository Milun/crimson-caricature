/**
 * Handles randomization of tiles to prevent overlaps.
 * Can be set to create fixed shapes.
 */

import { useRef, useState,useEffect, useCallback, Children } from "react";
import clsx from "clsx";

import "./Board.scss";

export type BoardProps = {
    seed?:          number, // Increment this value to re-shuffle,
    children:       React.ReactNode,
    columnCount:    number, // Number of columns in the grid (will affect size of child items)
};
export default function Board({
    seed,
    children,
    columnCount
}: BoardProps) {

    const boardRef = useRef<HTMLDivElement>(null);
    const [rowCount, setRowCount] = useState(0);

    const tiles = Children.toArray(children);

    // Observe 
    const recalculate = useCallback(() => {

        const board = boardRef.current;
        if (!board) return;
        
        const bb = board.getBoundingClientRect();
        
        // Determine how many rows the board should have based on aspect ratio.
        const a = bb.height / bb.width;
        setRowCount(Math.floor(columnCount*a));

    }, [columnCount]);

    useEffect(() => {

        const board = boardRef.current;
        if (!board) return;

        const observer = new ResizeObserver(recalculate);
        observer.observe(board);

        return () => observer.disconnect();

    }, []);

    const gridTemplateColumns = `repeat(${columnCount}, 1fr)`;
    const gridTemplateRows = rowCount ? `repeat(${rowCount}, 1fr)` : '';

    function renderItems() {

        const allCells: { 
            row: number; 
            col: number;
            offsetX: number,
            offsetY: number
        }[] = [];
        for (let r = 1; r <= rowCount; r++) {
            for (let c = 1; c <= columnCount; c++) {
                allCells.push({ 
                    row: r, 
                    col: c,
                    offsetX: Math.random() - 0.5,
                    offsetY: Math.random() - 0.5
                });
            }
        }

        for (let i = allCells.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allCells[i], allCells[j]] = [allCells[j], allCells[i]];
        }

        const gridAreas = allCells.slice(0, tiles.length);

        return <>
            {tiles.map((tile, idx) => {

                const ga = gridAreas[idx];

                return (
                    <div 
                        key={idx}
                        className="board__item"
                        style={{
                            gridArea: `${ga.row} / ${ga.col}`,
                            transform: `translate(${ga.offsetX*100}%, ${ga.offsetY*100}%)`
                        }}
                    >
                        {tile}
                    </div>
                )
            })}
        </>
    }


    return <>
        <div
            ref={boardRef} 
            className={clsx(
                "board"
            )}
            style={{
                gridTemplateColumns: gridTemplateColumns,
                gridTemplateRows: gridTemplateRows
            }}
        >
            {rowCount && renderItems()}
        </div>
    </>
}