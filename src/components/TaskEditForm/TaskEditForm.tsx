import React, { useEffect, useId, useRef, useState } from "react";
import type { Task } from "../../types/task";
import {
  applyFormValues,
  toFormValues,
  validateTaskForm,
  type TaskFormErrors,
  type TaskFormValues,
} from "../../utils/taskForm";
import CheckIcon from "../../assets/icons/check.svg?react";
import CrossIcon from "../../assets/icons/cross.svg?react";
import styles from "./TaskEditForm.module.css";

interface Props {
  task: Task;
  onSave: (task: Task) => void;
  onCancel: () => void;
}

const FIELDS: { name: keyof TaskFormValues; label: string; inputMode?: "numeric" }[] = [
  { name: "startDay", label: "Начало:", inputMode: "numeric" },
  { name: "endDay", label: "Окончание:", inputMode: "numeric" },
  { name: "text", label: "Описание:" },
];

export const TaskEditForm = ({ task, onSave, onCancel }: Props) => {
  const id = useId();
  const [values, setValues] = useState<TaskFormValues>(() => toFormValues(task));
  const [errors, setErrors] = useState<TaskFormErrors>({});
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const input = firstInputRef.current;
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  }, []);

  const handleChange = (name: keyof TaskFormValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((prev) => ({ ...prev, [name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validateTaskForm(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    onSave(applyFormValues(task, values));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onCancel();
    }
  };

  const errorMessage = FIELDS.map(({ name }) => errors[name]).find(Boolean);
  const errorId = `${id}-error`;

  return (
    <form className={styles.form} onSubmit={handleSubmit} onKeyDown={handleKeyDown} noValidate>
      {FIELDS.map(({ name, label, inputMode }, index) => (
        <div key={name} className={styles.row}>
          <label className={styles.label} htmlFor={`${id}-${name}`}>
            {label}
          </label>
          <input
            ref={index === 0 ? firstInputRef : undefined}
            id={`${id}-${name}`}
            className={styles.input}
            type="text"
            inputMode={inputMode}
            placeholder={inputMode ? "дд.мм.гггг" : undefined}
            value={values[name]}
            onChange={handleChange(name)}
            aria-invalid={Boolean(errors[name])}
            aria-describedby={errors[name] ? errorId : undefined}
          />
        </div>
      ))}
      {errorMessage && (
        <p id={errorId} className={styles.error} role="alert">
          {errorMessage}
        </p>
      )}
      <div className={styles.buttons}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancel}`}
          onClick={onCancel}
          aria-label="Отменить изменения"
          title="Отменить"
        >
          <CrossIcon aria-hidden="true" />
        </button>
        <button
          type="submit"
          className={`${styles.button} ${styles.save}`}
          aria-label="Сохранить изменения"
          title="Сохранить"
        >
          <CheckIcon aria-hidden="true" />
        </button>
      </div>
    </form>
  );
};
