import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Score } from '../backend';

export function useLeaderboard() {
  const { actor, isFetching: isActorFetching } = useActor();
  const queryClient = useQueryClient();

  const leaderboardQuery = useQuery<Score[]>({
    queryKey: ['leaderboard'],
    queryFn: async () => {
      if (!actor) return [];
      const scores = await actor.getLeaderboard();
      // Sort by wins descending, then by username ascending (for deterministic tie-breaking)
      return scores.sort((a, b) => {
        if (b.wins !== a.wins) {
          return Number(b.wins - a.wins);
        }
        return a.username.localeCompare(b.username);
      });
    },
    enabled: !!actor && !isActorFetching,
  });

  const recordWin = useMutation({
    mutationFn: async (username: string) => {
      if (!actor) throw new Error('Actor not initialized');
      if (!username.trim()) throw new Error('Username cannot be empty');
      await actor.recordWin(username.trim());
    },
    onSuccess: () => {
      // Refresh leaderboard after recording a win
      queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
    },
  });

  return {
    leaderboard: leaderboardQuery.data || [],
    isLoading: leaderboardQuery.isLoading,
    isError: leaderboardQuery.isError,
    refetch: leaderboardQuery.refetch,
    recordWin,
  };
}
