import {
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { TaskItem } from '../../components/modals/TaskItemModal';
import { TaskStatusEnum } from '../../enums/TaskStatusEnum';

interface TaskState {
  tasks: TaskItem[];
}

const initialState: TaskState = {
  tasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    addTask(state, action: PayloadAction<TaskItem>) {
      state.tasks.push({
        id: action.payload.id,
        title: action.payload.title,
        status: action.payload.status,
        date: action.payload.date,
        description: action.payload.description,
      });
    },
    editTask(state, action: PayloadAction<TaskItem>) {
      const editedTask = state.tasks.find((t) => t.id === action.payload.id);
      if (editedTask !== undefined) {
        editedTask.date = action.payload.date;
        editedTask.description = action.payload.description;
        editedTask.status = action.payload.status;
        editedTask.title = action.payload.title;
      }
    },
    changeStatus(state, action: PayloadAction<{ ids: string[]; newStatus: TaskStatusEnum }>) {
      for (const id of action.payload.ids){
        const curInd = state.tasks.findIndex((task => {
          return task.id === id
        }));
        if (curInd >= 0) {
          state.tasks[curInd].status = action.payload.newStatus;
        }
      }
    },
  },
});
const { reducer } = taskSlice;

export const { addTask, editTask, changeStatus } = taskSlice.actions;
export const tasksReducer = taskSlice.reducer;

export default reducer;
