import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trophy, RefreshCw, Loader2 } from 'lucide-react';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import { ScrollArea } from '@/components/ui/scroll-area';

export function LeaderboardPanel() {
  const { leaderboard, isLoading, refetch } = useLeaderboard();

  return (
    <Card className="border-neon-pink/30 bg-card/50 backdrop-blur-sm h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-neon-pink flex items-center gap-2">
          <Trophy className="w-5 h-5" />
          Leaderboard
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => refetch()}
          disabled={isLoading}
          className="hover:bg-neon-pink/10 hover:text-neon-pink"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {isLoading && leaderboard.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-neon-pink" />
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No wins recorded yet.</p>
              <p className="text-sm mt-2">Be the first to win!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((score, index) => (
                <div
                  key={`${score.username}-${index}`}
                  className={`
                    flex items-center justify-between p-3 rounded-lg
                    border transition-all
                    ${index === 0
                      ? 'border-neon-blue/50 bg-neon-blue/5 neon-glow-blue-subtle'
                      : index === 1
                      ? 'border-neon-pink/50 bg-neon-pink/5'
                      : index === 2
                      ? 'border-neon-blue/30 bg-neon-blue/5'
                      : 'border-border/30 bg-card/30'
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`
                        font-bold text-lg w-8 text-center
                        ${index === 0
                          ? 'text-neon-blue neon-glow-blue'
                          : index === 1
                          ? 'text-neon-pink neon-glow-pink'
                          : index === 2
                          ? 'text-neon-blue'
                          : 'text-muted-foreground'
                        }
                      `}
                    >
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                    </span>
                    <span className="font-medium truncate max-w-[150px]">
                      {score.username}
                    </span>
                  </div>
                  <span
                    className={`
                      font-bold
                      ${index === 0
                        ? 'text-neon-blue'
                        : index === 1
                        ? 'text-neon-pink'
                        : 'text-foreground'
                      }
                    `}
                  >
                    {score.wins.toString()} {Number(score.wins) === 1 ? 'win' : 'wins'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
