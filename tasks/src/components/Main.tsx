import { useState } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { TaskStatusEnum } from '../enums/TaskStatusEnum';
import TaskList from './TaskList';

function Main() {
  const [tabValue, setTabValue] = useState(TaskStatusEnum.TO_DO);

  const handleChange = (
    event: React.SyntheticEvent,
    newValue: TaskStatusEnum
  ) => {
    setTabValue(newValue);
  };

  return (
    <Box px={20}>
      <Grid item xs container direction="column" spacing={2}>
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

          {tabValue === TaskStatusEnum.TO_DO && (
            <TaskList listType={tabValue} />
          )}
          {tabValue === TaskStatusEnum.IN_PROGRESS && (
            <TaskList listType={tabValue} />
          )}
          {tabValue === TaskStatusEnum.DONE && <TaskList listType={tabValue} />}
          {tabValue === TaskStatusEnum.DELETED && (
            <TaskList listType={tabValue} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default Main;
