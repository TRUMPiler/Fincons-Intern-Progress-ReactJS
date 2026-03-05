import { useDraggable } from "@dnd-kit/core";
import type { Task } from "../models/Todo";
import { useContext } from "react";
import { UpdateContext } from "./UpdateTask";
import { GripIcon } from "lucide-react";

type TaskProp = {
  task: Task;
  color: string;
  id: number | string;
  onClick?: (task: Task) => void;
};
export const TaskList = ({ id, task, color }: TaskProp) => {
    const UpdateDialogContext=useContext(UpdateContext);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: String(id) });
  const style = transform
    ? { transform: `translate(${transform.x}px, ${transform.y}px)`, touchAction: "none" }
    : { touchAction: "none" };
  return (
    <div
      ref={setNodeRef}
         
      className={`flex items-end justify-between gap-3 text-white p-3 rounded-md shadow-sm cursor-pointer transition-colors duration-150  ${color}`}
      style={style}
        onClick={() => {
            console.log("Clicked");
        if (!UpdateDialogContext) return;
        UpdateDialogContext.setUpdateVisible(true);
        UpdateDialogContext.header = "Update Task";
        UpdateDialogContext.setUpdateTask(task);
        
      }}
    >
      <div className="text-sm font-semibold">#{task.id}</div>
      <div className="text-sm truncate">
        <span
        
          className="cursor-pointer"
          >
            
          {task.title}
        </span>
      
      </div>
        <GripIcon  {...listeners}
          {...attributes} className="hover:cursor-grab active:cursor-grabbing"/>
    </div>
  );
};

export const TaskCard = ({ task, color }: { task: Task; color: string }) => (
  <div className={`flex items-center gap-3 text-white p-3 rounded-md shadow-lg ${color}`}>
    <div className="text-sm font-semibold">#{task.id}</div>
    <div className="text-sm">{task.title}</div>
  </div>
);
