import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { getSyncStatus, triggerSync } from '../../api/sync';

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function TopBar() {
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const { data: syncStatus } = useQuery({
    queryKey: ['sync-status'],
    queryFn: getSyncStatus,
    refetchInterval: (query) =>
      query.state.data?.status === 'RUNNING' ? 3000 : 30000,
  });

  const syncMutation = useMutation({
    mutationFn: triggerSync,
    onMutate: () => setSyncing(true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sync-status'] });
    },
    onSettled: () => setSyncing(false),
  });

  const isRunning = syncStatus?.status === 'RUNNING' || syncing;

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>
          עדכון אחרון:{' '}
          <span className="font-medium">
            {formatDate(syncStatus?.finishedAt)}
          </span>
        </span>
        {syncStatus?.status === 'ERROR' && (
          <span className="text-red-500 text-xs">שגיאת sync: {syncStatus.errorMsg}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => syncMutation.mutate()}
            disabled={isRunning}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRunning ? (
              <>
                <span className="animate-spin">⟳</span>
                <span>מסנכרן...</span>
              </>
            ) : (
              <>
                <span>⟳</span>
                <span>סנכרן פריוריטי</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={logout}
          className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          יציאה
        </button>
      </div>
    </header>
  );
}
