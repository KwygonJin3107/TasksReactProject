import { useState, useCallback } from "react";
import TaskItemModal from "./components/modals/TaskItemModal";
import TaskList from "./components/TaskList";
import { TaskStatusEnum } from "./enums/TaskStatusEnum";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tabValue, setTabValue] = useState(TaskStatusEnum.TO_DO);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: TaskStatusEnum
  ) => {
    setTabValue(newValue);
  };

  const handleCreateModalOpen = useCallback(() => {
    setIsModalVisible(true);
  }, []);

  const handleCreateModalClose = useCallback(() => {
    setIsModalVisible(false);
  }, []);

  return (
    <Grid item xs container direction="column" spacing={2}>
      <Grid item>
        <Button onClick={handleCreateModalOpen}>Create</Button>
      </Grid>

      {isModalVisible && <TaskItemModal onClose={handleCreateModalClose} />}
      <Grid item container direction="column">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label={TaskStatusEnum.TO_DO.toString()}
              value={TaskStatusEnum.TO_DO}
            />
            <Tab
              label={TaskStatusEnum.IN_PROGRESS.toString()}
              value={TaskStatusEnum.IN_PROGRESS}
            />
            <Tab
              label={TaskStatusEnum.DONE.toString()}
              value={TaskStatusEnum.DONE}
            />
            <Tab
              label={TaskStatusEnum.DELETED.toString()}
              value={TaskStatusEnum.DELETED}
            />
          </Tabs>
        </Box>

        {tabValue === TaskStatusEnum.TO_DO && <TaskList listType={tabValue} />}
        {tabValue === TaskStatusEnum.IN_PROGRESS && (
          <TaskList listType={tabValue} />
        )}
        {tabValue === TaskStatusEnum.DONE && <TaskList listType={tabValue} />}
        {tabValue === TaskStatusEnum.DELETED && (
          <TaskList listType={tabValue} />
        )}
      </Grid>
    </Grid>
  );
}

export default App;
