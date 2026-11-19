import React from "react";
import SearchIcon from "../../assets/icons/search.svg?react";
import styles from "./SearchField.module.css";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchField = ({ value, onChange, className }: Props) => (
  <label className={className ? `${styles.field} ${className}` : styles.field}>
    <SearchIcon className={styles.icon} aria-hidden="true" />
    <input
      className={styles.input}
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="поиск..."
      aria-label="Поиск по описанию или дате в формате дд.мм.гггг"
      title="Описание или дата в формате дд.мм.гггг"
      autoComplete="off"
      spellCheck={false}
    />
  </label>
);
