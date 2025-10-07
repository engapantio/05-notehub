import css from './SearchBox.module.css';

interface SearchBoxProps {
  defValue: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBox({ defValue, onChange }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={defValue}
      onChange={onChange}
    />
  );
}
