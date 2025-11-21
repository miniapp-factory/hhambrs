"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

const fruits = ["apple", "banana", "cherry", "lemon"] as const;
type Fruit = typeof fruits[number];

function randomFruit(): Fruit {
  return fruits[Math.floor(Math.random() * fruits.length)];
}

export default function SlotMachine() {
  const [grid, setGrid] = useState<Fruit[][]>([
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
    [randomFruit(), randomFruit(), randomFruit()],
  ]);
  const [spinning, setSpinning] = useState(false);
  const [win, setWin] = useState(false);

  useEffect(() => {
    if (!spinning) return;
    const interval = setInterval(() => {
      setGrid((prev) => {
        const newGrid = prev.map((col) => {
          const newCol = [...col];
          newCol.pop();
          newCol.unshift(randomFruit());
          return newCol;
        });
        return newGrid;
      });
    }, 200);
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setSpinning(false);
    }, 2000);
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [spinning]);

  useEffect(() => {
    if (spinning) return;
    const rows = grid[0].map((_, i) => grid.map((col) => col[i]));
    const cols = grid;
    const check = (arr: Fruit[][]) =>
      arr.some(
        (line) =>
          line[0] === line[1] &&
          line[1] === line[2]
      );
    setWin(check(rows) || check(cols));
  }, [grid, spinning]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="grid grid-cols-3 gap-2">
        {grid.map((col, colIdx) =>
          col.map((fruit, rowIdx) => (
            <div
              key={`${colIdx}-${rowIdx}`}
              className="w-16 h-16 flex items-center justify-center border rounded"
            >
              <img
                src={`/${fruit}.png`}
                alt={fruit}
                className="w-12 h-12"
              />
            </div>
          ))
        )}
      </div>
      <Button
        variant="outline"
        onClick={() => setSpinning(true)}
        disabled={spinning}
      >
        Spin
      </Button>
      {win && !spinning && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <p className="text-green-800 font-semibold">
            You won! Share your win:
          </p>
          <Share text={`I just won the Fruit Slot Machine! ${url}`} />
        </div>
      )}
    </div>
  );
}
