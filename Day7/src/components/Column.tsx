import type{ Task } from "../models/Todo";
import { useDroppable } from "@dnd-kit/core";
import { TaskList } from "./Tasks";

type ColumnProp = {
    id: string;
    title: string;
    color: string;
    task?:Task[]
    onEdit?: (task: Task) => void;
}

export function ColumnComponent({ id, title, color, task, onEdit }: ColumnProp) {

    const priorityColor: Record<Task["priority"], string> = {
        low: "bg-green-700",
        medium: "bg-yellow-400",
        high: "bg-red-500"
    };

    const { setNodeRef } = useDroppable({ id });

    return (
        <div
            ref={setNodeRef}
            className="flex flex-col bg-transparent m-2 sm:m-3 md:m-4 w-full sm:w-80 md:w-96 lg:flex-1 border border-gray-200 rounded-lg shadow-sm overflow-hidden"
        >
            <div className={`${color} ${color === "bg-black" ? "text-white" : "text-black"} w-full p-4 text-center font-semibold`}>
                <p className="truncate">{title}</p>
            </div>

            <div className="flex flex-col gap-3 p-3 bg-white max-h-[60vh] overflow-auto">
                {task?.map((t) => (
                    <TaskList key={t.id} id={t.id} task={t} color={priorityColor[t.priority]} onClick={(task) => onEdit?.(task)} />
                ))}
            </div>
        </div>
    );
}