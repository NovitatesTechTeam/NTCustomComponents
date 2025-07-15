import { useRef, useState } from "react";
import {
  Banner,
  Button,
  Card,
  CardContent,
  CardHeader,
  createUID,
  Input,
  // Progress,
  Checkbox,
  withConfiguration,
} from "@pega/cosmos-react-core";
import { Container, StyledAddTask, StyledTable } from "./styles";
import TaskElement from "./Task";

// Interface for props
export type NovitatesExtensionsEntryListProps = {
  heading: string;
  dataPage: string;
  getPConnect: () => any;
};
// Task type definition
export interface Task {
  Id: string;
  Label: string;
  IsCompleted: boolean;
  isSelected?: boolean;
  status?: string;
  isEditing?: boolean;
  message?: string;
}

export const NovitatesExtensionsEntryList = (
  props: NovitatesExtensionsEntryListProps,
) => {
  const { heading, dataPage, getPConnect } = props;
  const [taskListData, setTaskListData] = useState<Task[]>([]);
  // const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const addTask = () => {
    const inputValue = inputRef.current?.value.trim();
    if (inputValue) {
      // Split by comma and trim each entry
      const entries = inputValue
        .split(",")
        .map((entry) => entry.trim())
        .filter((entry) => entry.length > 0);

      const newTasks = entries.map((entry) => ({
        Id: createUID(),
        Label: entry,
        IsCompleted: false,
        isSelected: false,
      }));

      setTaskListData((prevTasks) => [...prevTasks, ...newTasks]);

      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const deleteTask = (id: string) => {
    setTaskListData((prevData) => {
      return prevData.filter((task) => task.Id !== id);
    });
  };

  const toggleTaskSelection = (id: string) => {
    setTaskListData((prevData) => {
      return prevData.map((task) =>
        task.Id === id ? { ...task, isSelected: !task.isSelected } : task,
      );
    });
  };

  const toggleAllTasks = (checked: boolean) => {
    setTaskListData((prevData) => {
      return prevData.map((task) => ({
        ...task,
        isSelected: checked,
      }));
    });
  };

  const editTask = (id: string, newLabel: string) => {
    setTaskListData((prevData) => {
      return prevData.map((task) =>
        task.Id === id ? { ...task, Label: newLabel, isEditing: false } : task,
      );
    });
  };

  const toggleEditMode = (id: string) => {
    setTaskListData((prevData) => {
      return prevData.map((task) =>
        task.Id === id
          ? { ...task, isEditing: !task.isEditing }
          : { ...task, isEditing: false },
      );
    });
  };

  const syncSingleTask = async (task: Task) => {
    try {
      const context = getPConnect().getContextName();
      const parameters = { EntityName: task.Label };
      const options = {
        invalidateCache: true,
      };

      const response = await (
        window as any
      ).PCore.getDataPageUtils().getPageDataAsync(
        dataPage,
        context,
        parameters,
        options,
      );

      return { task, response };
    } catch (err) {
      console.error(`Error syncing task ${task.Label}:`, err);
      return {
        task,
        response: {
          pyStatusValue: "Failed",
          pyStatusMessage: `API Error: ${err instanceof Error ? err.message : "Unknown error"}`,
        },
      };
    }
  };

  const updateProgress = (completed: number, total: number) => {
    setSyncProgress(Math.round((completed / total) * 100));
  };

  const syncTasks = async () => {
    try {
      setIsSyncing(true);
      setSyncProgress(0);
      setError("");

      const selectedTasks = taskListData.filter((task) => task.isSelected);
      const totalTasks = selectedTasks.length;

      // Process tasks in parallel with progress tracking
      const results = await Promise.all(
        selectedTasks.map(async (task, index) => {
          const result = await syncSingleTask(task);
          updateProgress(index + 1, totalTasks);
          return result;
        }),
      );

      // Update local state based on results
      setTaskListData((prevData) => {
        // First, handle tasks that weren't selected
        const unselectedTasks = prevData.filter((task) => !task.isSelected);

        // Then, handle selected tasks based on their response
        const updatedTasks = results.reduce((acc, result) => {
          const status = result.response?.pyStatusValue;
          const message = result.response?.pyStatusMessage || "";

          // Only keep tasks that failed
          if (status === "Failed") {
            acc.push({
              ...result.task,
              isSelected: false,
              status,
              IsCompleted: false,
              message,
            });
          }
          // Successfully processed tasks are removed by not including them

          return acc;
        }, [] as Task[]);

        // Combine unselected tasks with failed tasks
        return [...unselectedTasks, ...updatedTasks];
      });
    } catch (err) {
      console.error("Error in sync process:", err);
      setError("Failed to complete sync process");
    } finally {
      setIsSyncing(false);
      setSyncProgress(0);
    }
  };

  const hasSelectedTasks = taskListData.some((task) => task.isSelected);
  const allTasksSelected =
    taskListData.length > 0 && taskListData.every((task) => task.isSelected);

  /* useEffect(() => {
    setIsLoading(true);
    try {
      const pConn = getPConnect();
      const CaseInstanceKey = pConn.getValue(
        (window as any).PCore.getConstants().CASE_INFO.CASE_INFO_ID,
      );
      const payload = {
        dataViewParameters: [{ pyID: CaseInstanceKey }],
      };
      (window as any).PCore.getDataApiUtils()
        .getData(dataPage, payload, pConn.getContextName())
        .then((response: any) => {
          if (response.data.data !== null) {
            setIsLoading(false);
            if (response.data.data) {
              setTaskListData(
                response.data.data.map((task: Task) => ({
                  ...task,
                  isSelected: false,
                })),
              );
            } else {
              setTaskListData([]);
            }
          }
        })
        .catch(() => {});
    } catch {
      setIsLoading(false);
      setError("Failed to fetch data.");
    }
  }, [dataPage, getPConnect]); */

  if (error) {
    return <Banner variant="urgent" messages={[error]} />;
  }
  /* if (isLoading) {
    return <Progress placement="local" message="Loading content..." />;
  } */
  return (
    <Card>
      <CardHeader>
        <h2>{heading}</h2>
      </CardHeader>
      <CardContent>
        <StyledAddTask>
          <Input
            label="Task name"
            labelHidden
            placeholder="Add task (comma-separated for multiple)"
            ref={inputRef}
            onKeyDown={onKeyDown}
          />
          <Button variant="primary" onClick={addTask}>
            Add
          </Button>
          <Button
            variant="primary"
            onClick={syncTasks}
            disabled={!hasSelectedTasks || isSyncing}
          >
            {isSyncing ? `Syncing (${syncProgress}%)` : "Sync"}
          </Button>
        </StyledAddTask>
        {error && <Banner variant="urgent" messages={[error]} />}
        <Container>
          <StyledTable>
            <thead>
              <tr>
                <th className="checkbox-column">
                  {taskListData.length > 0 && (
                    <Checkbox
                      checked={allTasksSelected}
                      onChange={(e) => toggleAllTasks(e.target.checked)}
                    />
                  )}
                </th>
                <th>Entity Name</th>
                <th className="status-column">Status</th>
                <th className="message-column">Message</th>
                <th className="action-column">Edit</th>
                <th className="action-column">Delete</th>
              </tr>
            </thead>
            <tbody>
              {taskListData.length > 0 ? (
                taskListData.map((task) => (
                  <TaskElement
                    key={task.Id}
                    task={task}
                    deleteTask={deleteTask}
                    onSelect={toggleTaskSelection}
                    onEdit={editTask}
                    onToggleEdit={toggleEditMode}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      textAlign: "center",
                      color: "#666",
                      padding: "2rem",
                    }}
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </StyledTable>
        </Container>
      </CardContent>
    </Card>
  );
};

export default withConfiguration(NovitatesExtensionsEntryList);
