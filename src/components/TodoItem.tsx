import React, { useContext, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from '../types/Todo';
import { TodosContext } from './TodosContext';

type Props = {
  todo: Todo;
};

export const TodoItem: React.FC<Props> = ({ todo }) => {
  const { todos, setTodos } = useContext(TodosContext);
  const [newTitle, setNewTitle] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const titleField = useRef<HTMLInputElement>(null);

  const handlerCompleteTodo = () => {
    const updatedTodos = [...todos];
    const currentTodoIndex = updatedTodos.findIndex((elem: Todo) => {
      return elem.id === todo.id;
    });

    if (currentTodoIndex !== -1) {
      const newCompleted = !updatedTodos[currentTodoIndex].completed;

      updatedTodos[currentTodoIndex] = {
        ...updatedTodos[currentTodoIndex],
        completed: newCompleted,
      };
      updatedTodos.splice(currentTodoIndex, 1, updatedTodos[currentTodoIndex]);

      setTodos(updatedTodos);
    }
  };

  const handlerDeleteTodo = () => {
    setTodos(currentTodos => currentTodos.filter(elem => elem.id !== todo.id));
  };

  const handlerEditTodo = () => {
    setNewTitle(todo.title);
    setIsEditing(true);

    setTimeout(() => {
      if (titleField.current !== null) {
        titleField.current.focus();
      }
    }, 0);
  };

  const handlerEditTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const handlerEndEditTodoOnBlur = () => {
    if (isEditing) {
      if (newTitle !== '') {
        const updatedTodos = [...todos];
        const currentTodoIndex = updatedTodos.findIndex(
          (elem: Todo) => elem.id === todo.id,
        );

        if (currentTodoIndex !== -1) {
          updatedTodos[currentTodoIndex] = {
            ...updatedTodos[currentTodoIndex],
            title: newTitle.trim(),
          };
          updatedTodos.splice(
            currentTodoIndex,
            1,
            updatedTodos[currentTodoIndex],
          );

          setTodos(updatedTodos);
        }
      } else {
        setTodos(currentTodos =>
          currentTodos.filter(elem => elem.id !== todo.id),
        );
      }
    }

    setIsEditing(false);
  };

  const handlerKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && isEditing) {
      setIsEditing(false);
    } else if (event.key === 'Enter' && isEditing) {
      handlerEndEditTodoOnBlur();
    }
  };

  return (
    <li
      className={cn({
        completed: todo.completed,
        editing: isEditing,
      })}
      data-id={todo.id}
    >
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.completed}
          onChange={handlerCompleteTodo}
        />
        <label onDoubleClick={handlerEditTodo}>{todo.title}</label>
        <button
          type="button"
          className="destroy"
          data-cy="deleteTodo"
          aria-label="deleteTodo"
          onClick={handlerDeleteTodo}
        />
      </div>
      {isEditing && (
        <input
          ref={titleField}
          className="edit"
          value={newTitle}
          onChange={handlerEditTitle}
          onBlur={handlerEndEditTodoOnBlur}
          onKeyUp={handlerKeyUp}
        />
      )}
    </li>
  );
};