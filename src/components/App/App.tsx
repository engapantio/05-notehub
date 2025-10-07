import css from './App.module.css';
import type { Note } from '../../types/note';
import { fetchNotes, createNote, deleteNote } from '../../services/noteService';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import {
  useQuery,
  keepPreviousData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Toaster, toast } from 'react-hot-toast';
import NoteList from '../NoteList/NoteList';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import NoteForm from '../NoteForm/NoteForm';
import SearchBox from '../SearchBox/SearchBox';
import Loader from '../Loader/Loader';
import Error from '../Error/Error';

export default function App() {
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const perPage = 12;

  const queryClient = useQueryClient();
  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(search, page, perPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;
  const totalNotes = data?.notes?.length ?? 0;

  useEffect(() => {
    if (isSuccess && totalNotes === 0) {
      toast.error('No notes found for your request.');
    }
  }, [isSuccess, totalNotes]);

  const updateSearchQuery = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value),
    500
  );

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deletedNote = useMutation({
    mutationFn: (id: Note['id']) => deleteNote(id),
    onSuccess: () => {
      toast('Note deleted!', { duration: 1500, position: 'bottom-left' });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleToBeDeletedNote = (id: Note['id']) => {
    deletedNote.mutate(id);
  };

  const newNote = useMutation({
    mutationFn: (note: Note) => createNote(note),
    onSuccess: () => {
      closeModal();
      toast.success('Note added!', { position: 'bottom-left' });
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleNewNote = ({ title, content, tag }: Note) => {
    newNote.mutate({
      title: title,
      content: content,
      tag: tag,
    });
  };

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox defValue={search} onChange={updateSearchQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {(isLoading || deletedNote.isPending) && <Loader />}
      {[isError, newNote.isError, deletedNote.isError].some(
        err => err === true
      ) && <Error />}
      {data?.notes && totalNotes > 0 && (
        <NoteList notes={data?.notes} onDelete={handleToBeDeletedNote} />
      )}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} onSubmit={handleNewNote} />
          {newNote.isPending && <Loader />}
        </Modal>
      )}
    </div>
  );
}
