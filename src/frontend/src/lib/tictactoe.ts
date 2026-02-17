export type Player = 'X' | 'O' | null;
export type Board = Player[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], // Top row
  [3, 4, 5], // Middle row
  [6, 7, 8], // Bottom row
  [0, 3, 6], // Left column
  [1, 4, 7], // Middle column
  [2, 5, 8], // Right column
  [0, 4, 8], // Diagonal top-left to bottom-right
  [2, 4, 6], // Diagonal top-right to bottom-left
];

/**
 * Check if there's a winner on the board
 */
export function checkWinner(board: Board): Player {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

/**
 * Check if the board is full (no empty cells)
 */
export function isBoardFull(board: Board): boolean {
  return board.every((cell) => cell !== null);
}

/**
 * Get all available moves (empty cell indices)
 */
function getAvailableMoves(board: Board): number[] {
  return board.map((cell, index) => (cell === null ? index : -1)).filter((index) => index !== -1);
}

/**
 * Quick check for immediate win or block opportunities
 */
function findCriticalMove(board: Board, player: Player): number {
  const availableMoves = getAvailableMoves(board);
  
  for (const move of availableMoves) {
    board[move] = player;
    if (checkWinner(board) === player) {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }
  
  return -1;
}

/**
 * Convert board state to a string key for memoization
 */
function boardToKey(board: Board): string {
  return board.map(cell => cell || '_').join('');
}

// Memoization cache for minimax results
const minimaxCache = new Map<string, number>();

/**
 * MiniMax algorithm with alpha-beta pruning and memoization
 * Returns the score for the current board state
 */
function minimax(
  board: Board,
  depth: number,
  isMaximizing: boolean,
  alpha: number = -Infinity,
  beta: number = Infinity
): number {
  // Check cache first
  const cacheKey = `${boardToKey(board)}-${isMaximizing}`;
  if (minimaxCache.has(cacheKey)) {
    return minimaxCache.get(cacheKey)!;
  }

  const winner = checkWinner(board);
  
  // Terminal states
  if (winner === 'O') return 10 - depth; // AI wins (prefer faster wins)
  if (winner === 'X') return depth - 10; // Human wins (prefer slower losses)
  if (isBoardFull(board)) return 0; // Draw

  const availableMoves = getAvailableMoves(board);
  
  if (isMaximizing) {
    // AI's turn (O) - maximize score
    let bestScore = -Infinity;
    
    // Move ordering: try center and corners first for better pruning
    const orderedMoves = availableMoves.sort((a, b) => {
      const priorityA = a === 4 ? 2 : [0, 2, 6, 8].includes(a) ? 1 : 0;
      const priorityB = b === 4 ? 2 : [0, 2, 6, 8].includes(b) ? 1 : 0;
      return priorityB - priorityA;
    });
    
    for (const move of orderedMoves) {
      board[move] = 'O';
      const score = minimax(board, depth + 1, false, alpha, beta);
      board[move] = null;
      bestScore = Math.max(score, bestScore);
      alpha = Math.max(alpha, score);
      if (beta <= alpha) break; // Beta cutoff
    }
    
    minimaxCache.set(cacheKey, bestScore);
    return bestScore;
  } else {
    // Human's turn (X) - minimize score
    let bestScore = Infinity;
    
    for (const move of availableMoves) {
      board[move] = 'X';
      const score = minimax(board, depth + 1, true, alpha, beta);
      board[move] = null;
      bestScore = Math.min(score, bestScore);
      beta = Math.min(beta, score);
      if (beta <= alpha) break; // Alpha cutoff
    }
    
    minimaxCache.set(cacheKey, bestScore);
    return bestScore;
  }
}

/**
 * Find the best move for the AI using optimized MiniMax algorithm
 * Returns the index of the best move, or -1 if no moves available
 */
export function makeAIMove(board: Board): number {
  const availableMoves = getAvailableMoves(board);
  
  if (availableMoves.length === 0) return -1;
  
  // Clear cache periodically to prevent memory issues
  if (minimaxCache.size > 1000) {
    minimaxCache.clear();
  }
  
  // If it's the first move and board is empty, play center or corner for variety
  if (availableMoves.length === 9) {
    const strategicMoves = [4, 0, 2, 6, 8]; // Center, then corners
    return strategicMoves[Math.floor(Math.random() * strategicMoves.length)];
  }

  // Quick check: can AI win immediately?
  const winMove = findCriticalMove(board, 'O');
  if (winMove !== -1) return winMove;

  // Quick check: must AI block opponent's win?
  const blockMove = findCriticalMove(board, 'X');
  if (blockMove !== -1) return blockMove;

  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  // Evaluate each possible move with alpha-beta pruning
  for (const move of availableMoves) {
    board[move] = 'O';
    const score = minimax(board, 0, false);
    board[move] = null;

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}
