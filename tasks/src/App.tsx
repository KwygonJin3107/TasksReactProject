import TaskItemModal from "./components/modals/TaskItemModal";
import TaskList from "./components/TaskList";
import { TaskStatusEnum } from "./enums/TaskStatusEnum";

function App() {
  const containerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
  };

  return (
    <div style={containerStyle}>
      <TaskItemModal />
      <TaskList listType={TaskStatusEnum.TO_DO} />
      <TaskList listType={TaskStatusEnum.IN_PROGRESS} />
      <TaskList listType={TaskStatusEnum.DONE} />
      <TaskList listType={TaskStatusEnum.DELETED} />
    </div>
  );
}

export default App;
