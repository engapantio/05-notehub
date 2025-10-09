import css from './App.module.css';
import { fetchNotes } from '../../services/noteService';
import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
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

  const { data, isSuccess, isError, isLoading } = useQuery({
    queryKey: ['notes', search, page],
    queryFn: () => fetchNotes(search, page, perPage),
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.totalPages ?? 0;
  const totalNotes = data?.notes?.length ?? 0;

  useEffect(() => {
    if (isSuccess && totalNotes === 0) {
      toast.error('No notes found for your request.', { duration: 1000 });
    }
  }, [isSuccess, totalNotes]);

  const updateSearchQuery = useDebouncedCallback((value: string) => {
    setPage(1);
    setSearch(value);
  }, 400);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={css.app}>
      <Toaster />
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={updateSearchQuery} />
        {isSuccess && totalPages > 1 && (
          <Pagination page={page} totalPages={totalPages} setPage={setPage} />
        )}
        <button className={css.button} onClick={openModal}>
          Create note +
        </button>
      </header>
      {isLoading && <Loader />}
      {isError && <Error />}
      {data?.notes && totalNotes > 0 && <NoteList notes={data?.notes} />}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <NoteForm onCancel={closeModal} />
        </Modal>
      )}
    </div>
  );
}
