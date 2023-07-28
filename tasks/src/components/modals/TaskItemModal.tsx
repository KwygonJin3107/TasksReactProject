import React from "react";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import {createUseStyles} from 'react-jss'

import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import { TaskStatusEnum } from "../../enums/TaskStatusEnum";
import { addTask } from "../../store";

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const useStyles = createUseStyles({
  boxStyle: {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    backgroundColor: "rgb(255, 255, 255)",
    border: "2px solid #000",
    boxShadow: 24,
    padding: 15,
  },
  buttonsStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    justifyContent: "center",
    alignItems: "baseline",
  }
})

const requiredMessage = "Field is required";

export const createValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .max(99, "Title should be 99 characters maximum")
    .required(requiredMessage),
  date: Yup.date().required(),
  status: Yup.mixed<TaskStatusEnum>()
    .oneOf(Object.values(TaskStatusEnum))
    .required(requiredMessage),
  description: Yup.string()
    .trim()
    .max(1024, "Description should be 1024 characters maximum"),
});

export interface TaskItem {
  id: string;
  title: string;
  date: string;
  status: TaskStatusEnum;
  description?: string;
  isChecked: boolean
}

interface TaskFormInputs {
  title: string;
  status: TaskStatusEnum;
  date: Date;
  description: string | undefined;
}

export const statuses = [
  TaskStatusEnum.TO_DO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.DONE,
  TaskStatusEnum.DELETED,
];

export default function TaskItemModal() {
  const dispatch = useDispatch();
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { handleSubmit, formState, reset, control } = useForm<TaskFormInputs>({
    resolver: yupResolver(createValidationSchema),
    mode: "all",
    defaultValues: {
      title: "",
      status: TaskStatusEnum.TO_DO,
      date: new Date(),
      description: "",
    },
  });

  const { errors } = formState;

  const onSubmit = (data: TaskFormInputs) => {
    const newTask: TaskItem = {
      date: data.date.toJSON(),
      status: data.status,
      title: data.title,
      description: data.description,
      id: nanoid(),
      isChecked: false
    };
    dispatch(addTask(newTask));
    reset();
    setOpen(false);
  };

  const menuItems = statuses.map((status) => (
    <MenuItem key={status} value={status}>
      {status.toString()}
    </MenuItem>
  ));

  return (
    <div>
      <Button onClick={handleOpen}>Create</Button>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box className={classes.boxStyle}>
              <Grid container direction="column" rowSpacing={1}>
                <Grid item xs={12}>
                  <Controller
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Title"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                      />
                    )}
                    name="title"
                    control={control}
                    rules={{ required: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    render={({ field }) => (
                      <DatePicker {...field} label="Date" />
                    )}
                    name="date"
                    control={control}
                    rules={{ required: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputLabel id="status-select-label">Status</InputLabel>
                  <Controller
                    render={({ field }) => (
                      <Select
                        {...field}
                        labelId="status-select-label"
                        fullWidth
                      >
                        {menuItems}
                      </Select>
                    )}
                    name="status"
                    control={control}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    render={({ field }) => (
                      //<Tooltip title={field.value}>
                      <TextField
                        {...field}
                        fullWidth
                        label="Description"
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        // sx={{
                        //   "& .MuiInputBase-input": {
                        //     overflow: "hidden",
                        //     textOverflow: "ellipsis",
                        //   },
                        // }}
                        rows={4}
                        multiline
                      />
                      //</Tooltip>
                    )}
                    name="description"
                    control={control}
                    rules={{ required: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <div className={classes.buttonsStyle}>
                    <Button
                      onClick={() => {
                        reset();
                        handleClose();
                      }}
                      type="button"
                    >
                      Close
                    </Button>
                    <Button type="submit">Save</Button>
                  </div>
                </Grid>
              </Grid>
            </Box>
          </form>
        </Modal>
      </LocalizationProvider>
    </div>
  );
}
