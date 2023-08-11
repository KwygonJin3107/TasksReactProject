import { configureStore } from '@reduxjs/toolkit';

import {
  addTask,
  changeStatus,
  editTask,
  tasksReducer,
} from './slices/taskSlice';

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
});

export { addTask, changeStatus, editTask, store, tasksReducer };

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch