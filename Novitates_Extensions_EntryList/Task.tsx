import { Button, Checkbox, Input } from "@pega/cosmos-react-core";
import type { Task } from "./index";
import { StyledStatus } from "./styles";
import { useRef } from "react";

interface TaskProps {
  task: Task;
  deleteTask: (id: string) => void;
  onSelect: (id: string) => void;
  onEdit: (id: string, newLabel: string) => void;
  onToggleEdit: (id: string) => void;
}

const TaskElement = ({
  task,
  deleteTask,
  onSelect,
  onEdit,
  onToggleEdit,
}: TaskProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const getStatusVariant = () => {
    if (task.status === "Failed") return "urgent";
    if (task.IsCompleted) return "success";
    return "warning";
  };

  const getStatusText = () => {
    if (task.status === "Failed") return "Failed";
    if (task.IsCompleted) return "Completed";
    return "New";
  };

  const handleEditSave = () => {
    const newLabel = inputRef.current?.value.trim();
    if (newLabel && newLabel !== task.Label) {
      onEdit(task.Id, newLabel);
    } else {
      onToggleEdit(task.Id); // Cancel edit if no changes
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSave();
    } else if (e.key === "Escape") {
      onToggleEdit(task.Id);
    }
  };

  return (
    <tr>
      <td className="checkbox-column">
        <Checkbox
          checked={task.isSelected}
          onChange={() => onSelect(task.Id)}
        />
      </td>
      <td>
        {task.isEditing ? (
          <Input
            ref={inputRef}
            defaultValue={task.Label}
            onKeyDown={handleKeyDown}
            autoFocus
          />
        ) : (
          task.Label
        )}
      </td>
      <td className="status-column">
        <StyledStatus variant={getStatusVariant()}>
          {getStatusText()}
        </StyledStatus>
      </td>
      <td className="message-column">{task.message || "-"}</td>
      <td className="action-column">
        {task.isEditing ? (
          <Button variant="simple" onClick={handleEditSave}>
            Save
          </Button>
        ) : (
          <Button variant="simple" onClick={() => onToggleEdit(task.Id)}>
            Edit
          </Button>
        )}
      </td>
      <td className="action-column">
        <Button variant="simple" onClick={() => deleteTask(task.Id)}>
          Delete
        </Button>
      </td>
    </tr>
  );
};

export default TaskElement;
