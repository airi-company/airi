"use client";
import { useState } from "react";

const empty = Array(9).fill(null) as ("X" | "O" | null)[];

function calcWinner(squares: ("X" | "O" | null)[]) {
  const lines = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6],
  ];
  for (const [a,b,c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  if (squares.every(Boolean)) return "draw";
  return null;
}

export default function GamesPage() {
  const [board, setBoard] = useState<("X" | "O" | null)[]>(empty);
  const [xIsNext, setXIsNext] = useState(true);
  const winner = calcWinner(board);

  const handleClick = (idx: number) => {
    if (board[idx] || winner) return;
    const next = board.slice();
    next[idx] = xIsNext ? "X" : "O";
    setBoard(next);
    setXIsNext(!xIsNext);
  };

  const reset = () => { setBoard(empty); setXIsNext(true); };

  const status = winner === "draw" ? "Hòa" : winner ? `Thắng: ${winner}` : `Lượt: ${xIsNext ? "X" : "O"}`;

  return (
    <div className="container-page space-y-4">
      <h1 className="text-2xl font-semibold">Game Hub</h1>
      <p className="text-slate-600">Chơi nhanh cờ caro (tic-tac-toe). Sẽ bổ sung thêm mini-game khác.</p>

      <div className="card space-y-3 max-w-md">
        <div className="font-semibold">Cờ caro 3x3</div>
        <div className="text-sm text-slate-700">{status}</div>
        <div className="grid grid-cols-3 gap-1 w-48">
          {board.map((cell, i) => (
            <button
              key={i}
              onClick={() => handleClick(i)}
              className="h-16 w-16 border border-slate-300 text-2xl font-bold bg-white hover:bg-slate-50"
            >
              {cell}
            </button>
          ))}
        </div>
        <button onClick={reset} className="px-3 py-2 bg-slate-900 text-white rounded">Chơi lại</button>
      </div>
    </div>
  );
}
