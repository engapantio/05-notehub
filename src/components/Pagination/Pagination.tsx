import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';
interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (selected: number) => void;
}

export default function Pagination({
  page,
  totalPages,
  setPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      pageCount={totalPages}
      pageRangeDisplayed={1}
      marginPagesDisplayed={3}
      onPageChange={({ selected }) => setPage(selected + 1)}
      forcePage={page - 1}
      containerClassName={css.pagination}
      activeClassName={css.active}
      nextLabel="→"
      previousLabel="←"
    />
  );
}
