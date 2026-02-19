import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getNotes, addNote } from '../../api/invoices';
import type { Note } from '../../types';

interface Props {
  invoiceNumber: string;
  initialNotes?: Note[];
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function NotesPanel({ invoiceNumber, initialNotes = [] }: Props) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const { data: notes } = useQuery({
    queryKey: ['notes', invoiceNumber],
    queryFn: () => getNotes(invoiceNumber),
    initialData: initialNotes,
    staleTime: 10_000,
  });

  const mutation = useMutation({
    mutationFn: (text: string) => addNote(invoiceNumber, text),
    onSuccess: (newNote) => {
      queryClient.setQueryData(['notes', invoiceNumber], (old: Note[] = []) => [
        newNote,
        ...old,
      ]);
      queryClient.invalidateQueries({ queryKey: ['customer'] });
      setContent('');
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (content.trim()) {
      mutation.mutate(content);
    }
  }

  return (
    <div className="p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
      {/* Add note form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="כתוב הערה לגבייה..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          disabled={mutation.isPending}
        />
        <button
          type="submit"
          disabled={mutation.isPending || !content.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {mutation.isPending ? '...' : 'שמור'}
        </button>
      </form>

      {/* Notes list */}
      {notes && notes.length > 0 ? (
        <ul className="space-y-2 max-h-48 overflow-y-auto">
          {notes.map((note) => (
            <li key={note.id} className="bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-700">{note.author.fullName}</span>
                <span className="text-xs text-gray-400">{formatDateTime(note.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-700">{note.content}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-xs text-gray-400 text-center">אין הערות עדיין</p>
      )}
    </div>
  );
}
