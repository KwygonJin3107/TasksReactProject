import {
  Controller,
  useForm,
} from 'react-hook-form';
import { createUseStyles } from 'react-jss';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup/dist/yup';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Modal from '@mui/material/Modal';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { nanoid } from '@reduxjs/toolkit';

import { statuses } from '../../constants/ProjectConstants';
import { TaskStatusEnum } from '../../enums/TaskStatusEnum';
import {
  addTask,
  editTask,
} from '../../store';
import { createValidationSchema } from '../../validations/TaskItemValidation';

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
  },
});

export interface TaskItem {
  id: string;
  title: string;
  date: string;
  status: TaskStatusEnum;
  description?: string;
}

interface TaskFormInputs {
  title: string;
  status: TaskStatusEnum;
  date: Date;
  description: string | undefined;
}

interface Props {
  initialValues?: TaskItem;
  onClose: () => void;
};

export default function TaskItemModal(props: Props) {
  const dispatch = useDispatch();
  const classes = useStyles();
  const { initialValues, onClose } = props;
  const { handleSubmit, formState, reset, control } = useForm<TaskFormInputs>({
    resolver: yupResolver(createValidationSchema),
    mode: "all",
    defaultValues: {
      title: initialValues?.title || "",
      status: initialValues?.status || TaskStatusEnum.TO_DO,
      date: initialValues ? new Date(initialValues.date) : new Date(),
      description: initialValues?.description || "",
    },
  });
  const isTaskDeleted = initialValues?.status === TaskStatusEnum.DELETED;
  const { errors } = formState;
  const menuItems = statuses.map((status) => (
    <MenuItem key={status} value={status}>
      {status.toString()}
    </MenuItem>
  ));

  const onSubmit = (data: TaskFormInputs) => {
    const newTask: TaskItem = {
      date: data.date.toJSON(),
      status: data.status,
      title: data.title,
      description: data.description,
      id: initialValues ? initialValues.id : nanoid()
    };

    if (initialValues) {
      dispatch(editTask(newTask));
    } else {
      dispatch(addTask(newTask));
    }

    reset();
    onClose();
  };


  return (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Modal
          open
          onClose={onClose}
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
                        disabled={isTaskDeleted}
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
                      <DatePicker
                        {...field}
                        disabled={isTaskDeleted}
                        label="Date"  
                        disablePast              
                      />
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
                        disabled={!initialValues}
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
                      <TextField
                        {...field}
                        fullWidth
                        label="Description"
                        disabled={isTaskDeleted}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                        rows={4}
                        multiline
                      />
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
                        onClose();
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
