import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, Trophy } from 'lucide-react';
import { makeAIMove, checkWinner, isBoardFull, type Board, type Player } from '@/lib/tictactoe';
import { useSound } from '@/hooks/useSound';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { useUsername } from '@/hooks/useUsername';
import { useAISpeed } from '@/hooks/useAISpeed';
import { LeaderboardPanel } from '@/components/LeaderboardPanel';
import { UsernameForm } from '@/components/UsernameForm';
import { AISpeedControl } from '@/components/AISpeedControl';

type GameStatus = 'playing' | 'won' | 'lost' | 'draw';

function App() {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showThinkingIndicator, setShowThinkingIndicator] = useState(false);
  
  const { playSound } = useSound(soundEnabled);
  const { recordWin } = useLeaderboard();
  const { username } = useUsername();
  const { aiDelay, thinkingThreshold } = useAISpeed();
  
  // Ref to prevent re-entrant AI moves
  const aiMoveInProgressRef = useRef(false);

  // Check for winner or draw after each move
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const winner = checkWinner(board);
    if (winner === 'X') {
      setGameStatus('won');
      playSound('win');
      // Record win if username is set
      if (username.trim()) {
        recordWin.mutate(username);
      }
    } else if (winner === 'O') {
      setGameStatus('lost');
      playSound('lose');
    } else if (isBoardFull(board)) {
      setGameStatus('draw');
      playSound('draw');
    }
  }, [board, gameStatus, playSound, username, recordWin]);

  // AI move logic with optimized timing and UX
  useEffect(() => {
    if (!isPlayerTurn && gameStatus === 'playing' && !aiMoveInProgressRef.current) {
      aiMoveInProgressRef.current = true;
      setIsAIThinking(true);
      
      const startTime = performance.now();
      
      // Start thinking indicator timer
      const thinkingTimer = setTimeout(() => {
        setShowThinkingIndicator(true);
      }, thinkingThreshold);
      
      // Compute AI move immediately
      const aiMove = makeAIMove([...board]);
      const computeTime = performance.now() - startTime;
      
      // Calculate remaining delay to reach target aiDelay
      const remainingDelay = Math.max(0, aiDelay - computeTime);
      
      const moveTimer = setTimeout(() => {
        clearTimeout(thinkingTimer);
        
        if (aiMove !== -1) {
          const newBoard = [...board];
          newBoard[aiMove] = 'O';
          setBoard(newBoard);
          playSound('move');
        }
        
        setIsPlayerTurn(true);
        setIsAIThinking(false);
        setShowThinkingIndicator(false);
        aiMoveInProgressRef.current = false;
      }, remainingDelay);
      
      return () => {
        clearTimeout(thinkingTimer);
        clearTimeout(moveTimer);
      };
    }
  }, [isPlayerTurn, gameStatus, board, playSound, aiDelay, thinkingThreshold]);

  const handleCellClick = (index: number) => {
    // Prevent moves if game is over, not player's turn, cell is occupied, or AI is thinking
    if (gameStatus !== 'playing' || !isPlayerTurn || board[index] !== null || isAIThinking) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    playSound('move');
    setIsPlayerTurn(false);
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameStatus('playing');
    setIsAIThinking(false);
    setShowThinkingIndicator(false);
    aiMoveInProgressRef.current = false;
  };

  const getStatusMessage = () => {
    if (showThinkingIndicator && isAIThinking) return 'AI is thinking...';
    if (gameStatus === 'won') return '🎉 You Won!';
    if (gameStatus === 'lost') return '😔 AI Wins!';
    if (gameStatus === 'draw') return '🤝 Draw!';
    return isPlayerTurn ? 'Your Turn (X)' : "AI's Turn (O)";
  };

  const getCellContent = (value: Player) => {
    if (value === 'X') return <span className="text-neon-blue text-5xl font-bold neon-glow-blue">X</span>;
    if (value === 'O') return <span className="text-neon-pink text-5xl font-bold neon-glow-pink">O</span>;
    return null;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-neon-blue/30 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Trophy className="w-8 h-8 text-neon-pink neon-glow-pink" />
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-neon-blue to-neon-pink bg-clip-text text-transparent">
              Neon Tic-Tac-Toe
            </h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="border-neon-blue/50 hover:border-neon-blue hover:bg-neon-blue/10"
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-neon-blue" />
            ) : (
              <VolumeX className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Left Panel - Username & AI Speed */}
          <div className="lg:col-span-1 space-y-6">
            <UsernameForm />
            <AISpeedControl />
            <Card className="border-neon-pink/30 bg-card/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-neon-pink">How to Play</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p>• You are <span className="text-neon-blue font-bold">X</span>, AI is <span className="text-neon-pink font-bold">O</span></p>
                <p>• Click any empty cell to make your move</p>
                <p>• Get 3 in a row to win!</p>
                <p>• The AI is unbeatable - can you draw?</p>
              </CardContent>
            </Card>
          </div>

          {/* Center Panel - Game Board */}
          <div className="lg:col-span-1 flex flex-col items-center justify-start space-y-6">
            {/* Status Display */}
            <Card className="w-full border-neon-blue/30 bg-card/50 backdrop-blur-sm">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${
                    gameStatus === 'won' ? 'text-neon-blue neon-glow-blue' :
                    gameStatus === 'lost' ? 'text-neon-pink neon-glow-pink' :
                    gameStatus === 'draw' ? 'text-foreground' :
                    showThinkingIndicator && isAIThinking ? 'text-neon-pink animate-pulse' :
                    'text-neon-blue'
                  }`}>
                    {getStatusMessage()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Game Board */}
            <div className="w-full max-w-md aspect-square">
              <div className="grid grid-cols-3 gap-3 w-full h-full">
                {board.map((cell, index) => (
                  <button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={gameStatus !== 'playing' || !isPlayerTurn || cell !== null || isAIThinking}
                    className={`
                      aspect-square rounded-lg border-2 
                      flex items-center justify-center
                      transition-all duration-200
                      ${cell === null && gameStatus === 'playing' && isPlayerTurn && !isAIThinking
                        ? 'border-neon-blue/50 hover:border-neon-blue hover:bg-neon-blue/10 cursor-pointer hover:scale-105'
                        : 'border-border/30'
                      }
                      ${cell !== null ? 'bg-card/80' : 'bg-card/30'}
                      backdrop-blur-sm
                      disabled:cursor-not-allowed
                    `}
                  >
                    {getCellContent(cell)}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset Button */}
            <Button
              onClick={handleReset}
              size="lg"
              className="w-full max-w-md bg-gradient-to-r from-neon-blue to-neon-pink hover:opacity-90 text-white font-bold border-0 neon-glow-blue"
            >
              Reset Game
            </Button>
          </div>

          {/* Right Panel - Leaderboard */}
          <div className="lg:col-span-1">
            <LeaderboardPanel />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-neon-pink/30 bg-card/50 backdrop-blur-sm py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'neon-tictactoe'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-blue hover:text-neon-pink transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
