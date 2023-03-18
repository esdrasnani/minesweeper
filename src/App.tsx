import React, { useEffect, useState } from 'react';
import './App.css';
import { GiMineExplosion } from "react-icons/gi";
import { BsFillFlagFill } from "react-icons/bs";
import { Cell } from './models/Cell';


function App() {

    const gridSize = 10;
    const [grid, setGrid] = useState(() => {
        // create initial 2D array
        const rows = [];
        for (let i = 0; i < gridSize; i++) {
            const cols = [];
            for (let j = 0; j < gridSize; j++) {
                cols.push(new Cell(i, j, true));
            }
            rows.push(cols);
        }
        return rows;
    });
    
    useEffect(() => {
        // update the 2D array in state
        const newGrid = [];
        for (let i = 0; i < gridSize; i++) {
            const cols = [];
            for (let j = 0; j < gridSize; j++) {
                //randomly set mines
                const isMine = Math.random() < 0.2;
                cols.push(new Cell(i, j, isMine));
            }
            newGrid.push(cols);
        }

        // update the neighborMinesCount
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j < gridSize; j++) {
                const cell = newGrid[i][j];
                if (cell.isMine) {
                    // update the neighbor cells
                    for (let k = i - 1; k <= i + 1; k++) {
                        for (let l = j - 1; l <= j + 1; l++) {
                            if (k >= 0 && k < gridSize && l >= 0 && l < gridSize) {
                                newGrid[k][l].neighborMinesCount++;
                            }
                        }
                    }
                }
            }
        }
        setGrid(newGrid);

    }, [gridSize]);


    
    function revealCells (row: number, col: number) {
        const newGrid = [...grid];
        newGrid[row][col].isRevealed = true;
        if (newGrid[row][col].neighborMinesCount === 0) {
            for (let k = row - 1; k <= row + 1; k++) {
                for (let l = col - 1; l <= col + 1; l++) {
                    if (k >= 0 && k < gridSize && l >= 0 && l < gridSize) {
                        if (!newGrid[k][l].isRevealed) {
                            revealCells(k, l);
                        }
                    }
                }
            }
        }
        setGrid(newGrid);
    }
    
    function handleCellClick (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        const target = e.target as HTMLDivElement;

        var currentTarget = target;
        for (var i = 0; i < 10; i++) {
            if (currentTarget.hasAttribute('data-row')) {
                break;
            }
            currentTarget = currentTarget.parentElement as HTMLDivElement;
        }
        const row = parseInt(currentTarget.getAttribute('data-row') || '-1');
        const col = parseInt(currentTarget.getAttribute('data-col') || '-1');
        
        const newGrid = [...grid];

        if (!newGrid[row][col].isFlagged) {

            newGrid[row][col].isRevealed = true;
        
            if (newGrid[row][col].neighborMinesCount === 0) {
                revealCells(row, col);
            }
        }
        

        setGrid(newGrid);
    }

    function handleFlagCell (e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
        e.preventDefault();

        const target = e.target as HTMLDivElement;

        var currentTarget = target;
        for (var i = 0; i < 10; i++) {
            if (currentTarget.hasAttribute('data-row')) {
                break;
            }
            currentTarget = currentTarget.parentElement as HTMLDivElement;
        }
        const row = parseInt(currentTarget.getAttribute('data-row') || '-1');
        const col = parseInt(currentTarget.getAttribute('data-col') || '-1');

        const newGrid = [...grid];
        
        newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged;
        setGrid(newGrid);
    }

    function drawCell (cell: Cell) {
        if(!cell.isRevealed){
            if(cell.isFlagged){
                return (
                    
                    <div className="cell-flagged" key={`cell-${cell.row}-${cell.col}`} data-row={`${cell.row}`} data-col={`${cell.col}`} onClick={handleCellClick} onContextMenu={handleFlagCell}>
                        <BsFillFlagFill color="#f2f2f2"/>
                    </div>
                );
            }	
            return (
                <div className="cell" key={`cell-${cell.row}-${cell.col}`} data-row={`${cell.row}`} data-col={`${cell.col}`} onClick={handleCellClick} onContextMenu={handleFlagCell}>
                </div>
            );
        }

        if(cell.isMine){
            return (
                <div className="cell-mine" key={`cell-${cell.row}-${cell.col}`} data-row={`${cell.row}`} data-col={`${cell.col}`} onClick={handleCellClick} onContextMenu={handleFlagCell}>
                    <GiMineExplosion color='black' width={90} />
                </div>
            );
        }
        
        return (
            <div className="cell-number" key={`cell-${cell.row}-${cell.col}`} data-row={`${cell.row}`} data-col={`${cell.col}`} onClick={handleCellClick} onContextMenu={handleFlagCell}>
                {cell.neighborMinesCount > 0 && cell.neighborMinesCount}
            </div>
        );
    }


    return (
        <div className="container">
            <div className="grid">
                {grid.map((row, i) => (
                    <div className="row" key={`row-${i}`}>
                        {row.map((cell, j) => (                            
                            drawCell(cell)
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
