import * as Yup from 'yup';

import { TaskStatusEnum } from '../enums/TaskStatusEnum';

const requiredMessage = "Field is required";

export const createValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(99, "Title should be 99 characters maximum")
    .required(requiredMessage),
  date: Yup.date()
    .required(),
  status: Yup.mixed<TaskStatusEnum>()
    .oneOf(Object.values(TaskStatusEnum))
    .required(requiredMessage),
  description: Yup.string()
    .trim()
    .max(1024, "Description should be 1024 characters maximum"),
});