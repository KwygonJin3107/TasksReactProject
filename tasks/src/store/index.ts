import { configureStore } from "@reduxjs/toolkit";
import { tasksReducer, addTask, changeIsChecked, changeStatus } from "./slices/taskSlice";

const store = configureStore({
    reducer: {
        tasks: tasksReducer,
    },
});

export { store, tasksReducer, addTask, changeIsChecked, changeStatus };

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch