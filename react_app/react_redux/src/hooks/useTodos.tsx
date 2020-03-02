import { useSelector } from 'react-redux';
import { RootState } from '../modules';
import { TodosState } from '../modules/todos';

export default function useTodos(): TodosState {
  const todos: TodosState = useSelector((state: RootState) => state.todos);
  return todos;
}