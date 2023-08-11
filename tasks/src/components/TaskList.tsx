import { useState } from 'react';
import moment from 'moment';
import { createUseStyles } from 'react-jss';
import {
  useDispatch,
  useSelector,
} from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import {
  blue,
  green,
  grey,
  red,
} from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { statuses } from '../constants/ProjectConstants';
import { TaskStatusEnum } from '../enums/TaskStatusEnum';
import {
  changeStatus,
  RootState,
} from '../store';
import QuestionDialog from './modals/QuestionDialog';
import TaskItemModal, { TaskItem } from './modals/TaskItemModal';

const useStyles = createUseStyles({
  menuStyle: {
    color: "black"
  },
});

type Props = {
  listType: TaskStatusEnum | undefined;
};

export interface TasksChangeStatus {
  id: string;
  isChecked: boolean;
}

export default function TaskList(props: Props) {
  const { listType } = props;
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currTaskItem, setCurrTaskItem] = useState<TaskItem>();
  const [checkedTasks, setCheckedTasks] = useState<string[]>([]);
  const [statusToSet, setStatusToSet] = useState<TaskStatusEnum>(
    TaskStatusEnum.DELETED
  );
  const classes = useStyles();

  const getColorByStatus = (status: TaskStatusEnum) => {
    switch (status) {
      case TaskStatusEnum.TO_DO:
        return {
          color: "white",
          backgroundColor: grey[700],
        };
      case TaskStatusEnum.IN_PROGRESS:
        return {
          color: "white",
          backgroundColor: blue[700],
        };
      case TaskStatusEnum.DONE:
        return {
          color: "white",
          backgroundColor: green[700],
        };
      case TaskStatusEnum.DELETED:
        return {
          color: "white",
          backgroundColor: red[700],
        };
      default:
        return {
          color: "white",
          backgroundColor: blue[700],
        };
    }
  };

  const handleCreateModalOpen = () => {
    setCurrTaskItem(undefined);
    setIsModalVisible(true);
  };

  const handleEditModalOpen = (task: TaskItem) => {
    setCurrTaskItem(task);
    setIsModalVisible(true);
  };

  const handleEditModalClose = () => {
    setIsModalVisible(false);
  };

  const handleChangeStatus = (task: TaskItem, status: TaskStatusEnum) => {
    if (status === TaskStatusEnum.DELETED) {
      setCurrTaskItem(task);
    }
    setStatusToSet(status);
    setDialogIsOpen(true);
    if (status !== TaskStatusEnum.DELETED) {
      setAnchorEl(null);
    }
  };

  const handleQuestionDialogOk = () => {
    if (
      currTaskItem !== undefined &&
      checkedTasks.findIndex((id) => id === currTaskItem?.id) < 0
    ) {
      dispatch(
        changeStatus({
          ids: new Array(currTaskItem.id),
          newStatus: statusToSet,
        })
      );
    } else {
      dispatch(
        changeStatus({
          ids: checkedTasks,
          newStatus: statusToSet,
        })
      );
      setCheckedTasks([]);
    }
    setDialogIsOpen(false);
  };

  const handleQuestionDialogClose = () => {
    setDialogIsOpen(false);
  };

  const tasks = useSelector((state: RootState) => {
    return state.tasks.tasks;
  });

  const filteredTasks = tasks.filter((task) => {
    return task.status === listType;
  });

  const renderedTasks = () => {
    if (filteredTasks.length === 0) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="100vh"
        >
          <div>Nothing here yet.</div>
        </Box>
      );
    }

    return (
      <>
        {filteredTasks.map((task) => {
          const parsedDate = new Date(Date.parse(task.date));

          const handleCheckedChange = (
            event: React.ChangeEvent<HTMLInputElement>
          ) => {
            if (event.target.checked) {
              setCheckedTasks((prevTasks) => [...prevTasks, task.id]);
            } else {
              setCheckedTasks((prevTasks) =>
                prevTasks.filter((id) => {
                  return id !== task.id;
                })
              );
            }
          };

          const menuItems = statuses.map((status) => (
            <MenuItem
              key={status.toString() + task.id}
              value={status}
              sx={getColorByStatus(status)}
              divider
              classes={
                {selected:  classes.menuStyle}
              }
              onClick={() => {
                handleChangeStatus(task, status);
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
                maxWidth: 700,
                flexGrow: 1,
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "#1A2027" : "#fff",
              }}
            >
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid item xs={1}>
                  <Checkbox size="small" onChange={handleCheckedChange} />
                </Grid>

                <Grid item xs={6} container direction="column" spacing={2}>
                  <Grid item container>
                    <Typography
                      gutterBottom
                      display="inline"
                      variant="body2"
                      noWrap
                    >
                      {task.title}
                    </Typography>
                  </Grid>

                  <Grid item container>
                    <Tooltip title={task.description}>
                        <Typography
                          sx={{
                            display: "-webkit-box",
                            overflow: "hidden",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 3,
                          }}               
                          variant="body2"
                          gutterBottom
                        >
                          {task.description}
                        </Typography>
                      </Tooltip>
                  </Grid>
                </Grid>
                <Grid item xs={2}>
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
                    sx={getColorByStatus(task.status)}
                    variant="contained"
                    onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                      setCurrTaskItem(task);
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
                      color="primary"
                      disabled={
                        checkedTasks.length > 1 ||
                        listType === TaskStatusEnum.DELETED
                      }
                      onClick={() => {
                        handleEditModalOpen(task);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Grid>

                  <Grid item>
                    <IconButton
                      size="small"
                      aria-label="delete"
                      sx={{ color: red[500] }}
                      disabled={listType === TaskStatusEnum.DELETED}
                      onClick={() =>
                        handleChangeStatus(task, TaskStatusEnum.DELETED)
                      }
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          );
        })}
      </>
    );
  };

  return (
    <div>
      {isModalVisible && (
        <TaskItemModal
          onClose={handleEditModalClose}
          initialValues={currTaskItem}
        />
      )}
      {dialogIsOpen && (
        <QuestionDialog
          onClose={handleQuestionDialogClose}
          onOk={handleQuestionDialogOk}
          question="Submit changes?"
        />
      )}
      <Grid container spacing={2}>
        <Grid item xs>
          {renderedTasks()}
        </Grid>
        <Grid item xs={1}>
          <Button onClick={handleCreateModalOpen}>Create new</Button>
        </Grid>
      </Grid>
    </div>
  );
}
