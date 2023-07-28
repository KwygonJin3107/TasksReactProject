import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TaskItem } from "../../components/modals/TaskItemModal";
import { TaskStatusEnum } from "../../enums/TaskStatusEnum";

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
        isChecked: action.payload.isChecked
      });
    },
    changeIsChecked(state, action: PayloadAction<{task: TaskItem; isChecked: boolean}>) {
      const editedTask = state.tasks.find(t => t.id === action.payload.task.id);
      if (editedTask !== undefined){
        editedTask.isChecked = action.payload.isChecked;
      }
    },
    changeStatus(state, action: PayloadAction<TaskStatusEnum>) {
      for (const task of state.tasks) {
        if (task.isChecked) {
          task.status = action.payload;
          task.isChecked = false;
        }
      }
    }
  },
});
const { reducer } = taskSlice;

export const { addTask, changeIsChecked, changeStatus } = taskSlice.actions;
export const tasksReducer = taskSlice.reducer;

export default reducer;
