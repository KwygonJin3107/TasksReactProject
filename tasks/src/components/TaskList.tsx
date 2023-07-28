import React from "react";
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
  isChecked: boolean
}

export default function TaskList(props: Props) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

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
      const parsedDate = new Date(Date.parse(task.date));

      const menuItems = statuses.map((status) => (
        <MenuItem
          key={status}
          value={status}
          onClick={() => {
            dispatch(changeStatus(status));
            setAnchorEl(null);
          }}
        >
          {status.toString()}
        </MenuItem>
      ));

      return (
        <Paper
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
          <Grid key={task.id} container spacing={2}>
            <Grid item>
              <Checkbox size="small" onChange={(event) => {
                dispatch(changeIsChecked({task, isChecked: event.target.checked}));
              }}/>
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
                  onClick={() => {
                    console.log("edit: " + task.title);
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>
              </Grid>
              <Grid item>
                <IconButton
                  size="small"
                  aria-label="delete"
                  onClick={() => {
                    console.log("delete: " + task.title);
                  }}
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

  return <div>{renderedTasks}</div>;
}
