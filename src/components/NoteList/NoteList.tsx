import css from './NoteList.module.css';
import { type Note } from '../../types/note';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { deleteNote } from '../../services/noteService';
import { toast } from 'react-hot-toast';
import Loader from '../Loader/Loader';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  const toBeDeletedNote = useMutation({
    mutationFn: (id: Note['id']) => deleteNote(id),
    onSuccess: () => {
      toast('Note deleted!', { duration: 1500, position: 'bottom-left' });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleToBeDeletedNote = (id: Note['id']) => {
    toBeDeletedNote.mutate(id);
  };

  return (
    <ul className={css.list}>
      {notes.map((note: Note) => (
        <li key={note.id} className={css.listItem}>
          {toBeDeletedNote.isPending && <Loader />}
          <h2 className={css.title}>{note.title}</h2>
          <p className={css.content}>{note.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{note.tag}</span>
            <button
              className={css.button}
              onClick={() => handleToBeDeletedNote(note.id)}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
