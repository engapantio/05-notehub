import axios from 'axios';
import { type Note } from '../types/note';

interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

interface CreateNoteProps {
  title: string;
  tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
  content: string;
}

const noteHubToken = import.meta.env.VITE_NOTEHUB_TOKEN;
axios.defaults.baseURL = 'https://notehub-public.goit.study/api';
axios.defaults.headers.common['Authorization'] = noteHubToken;
export const fetchNotes = async (
  search: string,
  page: number
): Promise<FetchNotesResponse> => {
  const response = await axios.get<FetchNotesResponse>(
    `/notes?search=${search}&page=${page}`
  );

  return response.data;
};

export const createNote = async (newNote: CreateNoteProps): Promise<Note> => {
  const response = await axios.post<Note>('/notes', newNote);

  return response.data;
};

export const deleteNote = async (id: Note['id']): Promise<Note> => {
  const response = await axios.delete<Note>(`notes/${id}`);
  return response.data;
};
