import { useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import moment from "moment";

import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { RootState, changeIsChecked, changeStatus } from "../store";
import { TaskStatusEnum } from "../enums/TaskStatusEnum";
import TaskItemModal, { TaskItem } from "./modals/TaskItemModal";
import QuestionDialog from "./modals/QuestionDialog";

const statuses = [
  TaskStatusEnum.TO_DO,
  TaskStatusEnum.IN_PROGRESS,
  TaskStatusEnum.DONE,
  TaskStatusEnum.DELETED,
];

type Props = {
  listType: TaskStatusEnum | undefined;
};

export interface TasksChangeStatus {
  id: string;
  isChecked: boolean;
}

export default function TaskList(props: Props) {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [checkedCounter, setCheckedCounter] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currTaskItem, setCurrTaskItem] = useState<TaskItem>();
  const [statusToSet, setStatusToSet] = useState<TaskStatusEnum>(TaskStatusEnum.DELETED);

  const handleEditModalOpen = useCallback((task: TaskItem) => {
    setCurrTaskItem(task);
    setIsModalVisible(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  const handleChangeStatusToDelete = useCallback(() => {
    setStatusToSet(TaskStatusEnum.DELETED);
    setDialogIsOpen(true);
  }, []);

  const handleQuestionDialogOk = () => {
    dispatch(changeStatus(statusToSet));
    setCheckedCounter(0);
    setDialogIsOpen(false);
  };

  const handleQuestionDialogClose = useCallback(() => {
    setDialogIsOpen(false);
  }, []);

  const tasks = useSelector((state: RootState) => {
    return state.tasks.tasks;
  });

  const { listType } = props;

  const filteredTasks = tasks.filter((task) => {
    return task.status === listType;
  });

  let renderedTasks;

  if (filteredTasks.length === 0) {
    renderedTasks = <div>Nothing here yet.</div>;
  } else {
    renderedTasks = filteredTasks.map((task) => {
      const handleCheckedChange = (
        event: React.ChangeEvent<HTMLInputElement>
      ) => {
        dispatch(changeIsChecked({ task, isChecked: event.target.checked }));
        setCheckedCounter(
          event.target.checked ? checkedCounter + 1 : checkedCounter - 1
        );
      };

      const parsedDate = new Date(Date.parse(task.date));

      const menuItems = statuses.map((status) => (
        <MenuItem
          key={status}
          value={status}
          disabled={!checkedCounter}
          onClick={() => {
            setStatusToSet(status);
            setDialogIsOpen(true);
            setAnchorEl(null);
          }}
        >
          {status.toString()}
        </MenuItem>
      ));

      return (
        <Paper
          key={task.id}
          sx={{
            p: 2,
            margin: 1,
            mb: 2,
            maxWidth: 500,
            flexGrow: 1,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1A2027" : "#fff",
          }}
        >
          <Grid container spacing={2}>
            <Grid item>
              <Checkbox size="small" onChange={handleCheckedChange} />
            </Grid>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1" component="div">
                  {task.title}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {task.description}
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1" gutterBottom>
                {moment(parsedDate).format("DD MMM, YYYY")}
              </Typography>
            </Grid>
            <Grid item xs={2}>
              <Button
                id="button-change-status"
                aria-controls={open ? "basic-menu" : undefined}
                disabled={!task.isChecked}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                  setAnchorEl(null);
                  setAnchorEl(event.currentTarget);
                }}
              >
                {task.status.toString()}
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={() => {
                  setAnchorEl(null);
                }}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                {menuItems}
              </Menu>
            </Grid>
            <Grid xs={1} item container direction="column" spacing={2}>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="edit"
                  disabled={checkedCounter !== 1 || !task.isChecked}
                  onClick={() => {handleEditModalOpen(task)}}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="delete"
                  disabled={!task.isChecked}
                  onClick={handleChangeStatusToDelete}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      );
    });
  }

  return (
    <div>
      {isModalVisible && <TaskItemModal onClose={handleEditModalClose} initialValues={currTaskItem}/>}
      {dialogIsOpen && <QuestionDialog onClose={handleQuestionDialogClose} onOk={handleQuestionDialogOk} question="Submit changes?"/>}
      {renderedTasks}
    </div>
  );
}
