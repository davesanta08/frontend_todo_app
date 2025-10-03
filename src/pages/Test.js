import React, { useState, useEffect, useCallback } from "react";
const clickSound = "https://charisintelligence.com.ng/portal/audio/click.mp3";
const captureSound =
  "https://charisintelligence.com.ng/portal/audio/capturetwo.mp3";

const Game = () => {
  const BOARD_SIZE = 6;
  const PLAYER_ONE = 1;
  const PLAYER_TWO = 2;
  const EMPTY_CELL = 0;

  const [board, setBoard] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(PLAYER_ONE);
  const [status, setStatus] = useState("playing");
  const [playerScores, setPlayerScores] = useState({
    [PLAYER_ONE]: 0,
    [PLAYER_TWO]: 0,
  });
  const [message, setMessage] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [validMoves, setValidMoves] = useState([]);

  const clickAudio = new Audio(clickSound);
  const captureAudio = new Audio(captureSound);

  const initializeBoard = useCallback(() => {
    const initialBoard = Array(BOARD_SIZE)
      .fill(null)
      .map(() => Array(BOARD_SIZE).fill(EMPTY_CELL));
    const mid = Math.floor(BOARD_SIZE / 2);
    initialBoard[mid - 1][mid - 1] = PLAYER_ONE;
    initialBoard[mid][mid] = PLAYER_ONE;
    initialBoard[mid - 1][mid] = PLAYER_TWO;
    initialBoard[mid][mid - 1] = PLAYER_TWO;

    setBoard(initialBoard);
    setCurrentPlayer(PLAYER_ONE);
    setStatus("playing");
    setPlayerScores({ [PLAYER_ONE]: 0, [PLAYER_TWO]: 0 });
    setMessage("");
    setIsAiThinking(false);
    setValidMoves([]);
  }, []);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const getPlayerColorClass = (player) => {
    if (player === PLAYER_ONE) return "bg-blue-500 hover:bg-blue-600";
    if (player === PLAYER_TWO) return "bg-red-500 hover:bg-red-600";
    return "bg-gray-200 hover:bg-gray-300";
  };

  const getPlayerTextColorClass = (player) => {
    if (player === PLAYER_ONE) return "text-blue-700";
    if (player === PLAYER_TWO) return "text-red-700";
    return "text-gray-700";
  };

  const calculateCaptures = useCallback((currentBoard, r, c, player) => {
    if (!currentBoard || currentBoard.length !== BOARD_SIZE || !currentBoard[r])
      return 0;
    if (currentBoard[r][c] !== EMPTY_CELL) return 0;
    const opponent = player === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    let capturedCount = 0;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    for (const [dr, dc] of directions) {
      const newR = r + dr,
        newC = c + dc;
      if (
        newR >= 0 &&
        newR < BOARD_SIZE &&
        newC >= 0 &&
        newC < BOARD_SIZE &&
        currentBoard[newR][newC] === opponent
      ) {
        capturedCount++;
      }
    }
    return capturedCount;
  }, []);

  const hasValidMoves = useCallback(
    (player) => {
      if (!board || board.length !== BOARD_SIZE) return false;
      const valid = [];
      for (let r = 0; r < BOARD_SIZE; r++) {
        for (let c = 0; c < BOARD_SIZE; c++) {
          if (
            board[r][c] === EMPTY_CELL &&
            calculateCaptures(board, r, c, player) > 0
          ) {
            valid.push([r, c]);
          }
        }
      }
      if (player === currentPlayer) setValidMoves(valid);
      return valid.length > 0;
    },
    [board, calculateCaptures, currentPlayer]
  );

  const updateGameStatus = useCallback(() => {
    if (!board || board.length !== BOARD_SIZE) return;
    let p1Score = 0,
      p2Score = 0,
      emptyCells = 0;

    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell === PLAYER_ONE) p1Score++;
        else if (cell === PLAYER_TWO) p2Score++;
        else emptyCells++;
      });
    });

    setPlayerScores({ [PLAYER_ONE]: p1Score, [PLAYER_TWO]: p2Score });

    const currentHasValidMove = hasValidMoves(currentPlayer);
    const otherPlayer = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
    const otherHasValidMove = hasValidMoves(otherPlayer);

    if (emptyCells === 0 || (!currentHasValidMove && !otherHasValidMove)) {
      if (p1Score > p2Score) setStatus(`Player 1 wins with ${p1Score} points!`);
      else if (p2Score > p1Score)
        setStatus(`Player 2 wins with ${p2Score} points!`);
      else setStatus("It's a draw!");
    } else if (!currentHasValidMove) {
      setMessage(
        `Player ${currentPlayer} has no valid moves. Passing turn to Player ${otherPlayer}.`
      );
      setCurrentPlayer(otherPlayer);
    } else {
      setStatus("playing");
    }
  }, [board, currentPlayer, hasValidMoves]);

  useEffect(() => {
    if (status === "playing" && board.length === BOARD_SIZE) updateGameStatus();
  }, [board, currentPlayer, status, updateGameStatus]);

  const handleCellClick = useCallback(
    (row, col) => {
      if (currentPlayer === PLAYER_ONE && isAiThinking) return;
      if (
        !board ||
        !board[row] ||
        board[row][col] !== EMPTY_CELL ||
        status !== "playing"
      ) {
        if (
          board[row] &&
          board[row][col] !== EMPTY_CELL &&
          currentPlayer === PLAYER_ONE
        ) {
          setMessage("Cell is already occupied!");
        }
        return;
      }

      const newBoard = board.map((row) => row.slice());
      const capturedCount = calculateCaptures(board, row, col, currentPlayer);

      if (capturedCount === 0) {
        if (currentPlayer === PLAYER_ONE)
          setMessage(
            "Invalid move: Must capture at least one opponent's piece!"
          );
        return;
      }

      clickAudio.play();
      captureAudio.play();

      newBoard[row][col] = currentPlayer;
      const opponent = currentPlayer === PLAYER_ONE ? PLAYER_TWO : PLAYER_ONE;
      const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
      ];

      for (const [dr, dc] of directions) {
        const newR = row + dr,
          newC = col + dc;
        if (
          newR >= 0 &&
          newR < BOARD_SIZE &&
          newC >= 0 &&
          newC < BOARD_SIZE &&
          newBoard[newR][newC] === opponent
        ) {
          newBoard[newR][newC] = currentPlayer;
        }
      }

      setBoard(newBoard);
      setMessage("");
      setCurrentPlayer(opponent);
    },
    [board, currentPlayer, status, calculateCaptures, isAiThinking]
  );

  const aiMove = useCallback(() => {
    if (currentPlayer !== PLAYER_TWO || status !== "playing" || isAiThinking)
      return;

    setIsAiThinking(true);
    setMessage("AI is thinking...");

    const possibleMoves = [];
    for (let r = 0; r < BOARD_SIZE; r++) {
      for (let c = 0; c < BOARD_SIZE; c++) {
        if (
          board[r][c] === EMPTY_CELL &&
          calculateCaptures(board, r, c, PLAYER_TWO) > 0
        ) {
          possibleMoves.push({ row: r, col: c });
        }
      }
    }

    setTimeout(() => {
      if (possibleMoves.length > 0) {
        const chosenMove =
          possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        handleCellClick(chosenMove.row, chosenMove.col);
      } else {
        setMessage("AI has no valid moves. Passing turn.");
        setCurrentPlayer(PLAYER_ONE);
      }
      setIsAiThinking(false);
    }, 5000);
  }, [
    board,
    calculateCaptures,
    currentPlayer,
    status,
    isAiThinking,
    handleCellClick,
  ]);

  useEffect(() => {
    if (currentPlayer === PLAYER_TWO && status === "playing") aiMove();
  }, [currentPlayer, status, aiMove]);

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">Nexus Grid</h1>

      <div className="mb-4">
        <p
          className={`text-lg font-medium ${getPlayerTextColorClass(
            currentPlayer
          )}`}
        >
          {status === "playing"
            ? isAiThinking
              ? "AI is thinking..."
              : `Current Turn: Player ${currentPlayer}`
            : status}
        </p>
        {message && (
          <p className="text-yellow-300 mt-1 animate-pulse">{message}</p>
        )}
      </div>

      <div className="mb-4 flex space-x-6">
        <div className="text-blue-300">
          Player 1: {playerScores[PLAYER_ONE]}
        </div>
        <div className="text-red-300">
          Player 2 (AI): {playerScores[PLAYER_TWO]}
        </div>
      </div>

      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: `repeat(${BOARD_SIZE}, minmax(0, 1fr))`,
        }}
      >
        {board.map((row, r) =>
          row.map((cell, c) => {
            const isHint = validMoves.some(([vr, vc]) => vr === r && vc === c);
            return (
              <div
                key={`${r}-${c}`}
                className={`w-14 h-14 border border-gray-600 flex items-center justify-center rounded cursor-pointer
                  ${
                    cell === EMPTY_CELL
                      ? "bg-gray-700 hover:scale-105"
                      : getPlayerColorClass(cell)
                  }
                  ${isHint ? "animate-pulse ring ring-yellow-400" : ""}
                  ${
                    status !== "playing" ||
                    (currentPlayer === PLAYER_TWO && isAiThinking)
                      ? "pointer-events-none"
                      : ""
                  }
                `}
                onClick={() => handleCellClick(r, c)}
              ></div>
            );
          })
        )}
      </div>

      <div className="mt-6">
        <button
          onClick={initializeBoard}
          className="mt-4 px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded shadow text-white"
        >
          New Game
        </button>
      </div>
    </div>
  );
};

export default Game;
