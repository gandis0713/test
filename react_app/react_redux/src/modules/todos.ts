import { ActionType, createReducer} from 'typesafe-actions';
import {createAction} from 'typesafe-actions';

// 액션 type
const ADD_TODO = 'todos/ADD_TODO' as const;
const TOGGLE_TODO = 'todos/TOGGLE_TODO' as const;
const REMOVE_TODO = 'todos/REMOVE_TODO' as const;

// 액션 생성 함수
// export const addTodo = (text: string) => ({
//   type: ADD_TODO,
//   payload: text
// });

// export const toggleTodo = (id: number) => ({
//   type: TOGGLE_TODO,
//   payload: id
// });

// export const removeTodo = (id: number) => ({
//   type: REMOVE_TODO,
//   payload: id
// });
export const addTodo = createAction(ADD_TODO)<string>();
export const toggleTodo = createAction(TOGGLE_TODO)<number>();
export const removeTodo = createAction(REMOVE_TODO)<number>();

// 액션들의 타입스크립트 타입 준비
// type TodosAction =
//   | ReturnType<typeof addTodo>
//   | ReturnType<typeof toggleTodo>
//   | ReturnType<typeof removeTodo>;
const actions = { addTodo, toggleTodo, removeTodo };
type TodosAction = ActionType<typeof actions>;

  // 상태를 위한 타입 선언
export type Todo = {
  id: number;
  text: string;
  done: boolean;
};
type TodosState = Todo[];

// 초깃값 설정
const initialState: TodosState = [
  { id: 1, text: '타입스크립트 배우기', done: true },
  { id: 2, text: '타입스크립트와 리덕스 함께 사용해보기', done: true },
  { id: 3, text: '투두리스트 만들기', done: false }
];

// function todos(state: TodosState = initialState, action: TodosAction): TodosState {
//   switch (action.type) {
//     case ADD_TODO:
//       const nextId = Math.max(...state.map(todo => todo.id)) + 1;
//       return state.concat({
//         id: nextId,
//         text: action.payload,
//         done: false
//       });
//     case TOGGLE_TODO:
//       return state.map(todo =>
//         todo.id === action.payload ? { ...todo, done: !todo.done } : todo
//       );
//     case REMOVE_TODO:
//       return state.filter(todo => todo.id !== action.payload);
//     default:
//       return state;
//   }
// }
const todos = createReducer<TodosState, TodosAction>(initialState, {
  [ADD_TODO]: (state, { payload: text }) =>
    state.concat({
      id: Math.max(...state.map(todo => todo.id)) + 1,
      text,
      done: false
    }),
  [TOGGLE_TODO]: (state, { payload: id }) =>
    state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
  [REMOVE_TODO]: (state, { payload: id }) =>
    state.filter(todo => todo.id !== id)
});

export default todos;