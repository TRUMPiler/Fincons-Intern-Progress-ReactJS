import { Dialog } from "primereact/dialog";
import { useState, useEffect, type Dispatch, type SetStateAction, createContext, useContext, useRef } from "react";
import { UpdateTask, type Task, deleteTask } from "../models/Todo";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { getUsers } from "../models/user";
import { Toast } from "primereact/toast";
import { getTeamsOfUser } from "../models/Teams";

export type updateDialogProps = {
    updateVisible: boolean;
    setUpdateVisible: Dispatch<SetStateAction<boolean>>;
    header: string;
    updatetask: Task;
    setUpdateTask: Dispatch<SetStateAction<Task>>;
};
export const UpdateContext=createContext<updateDialogProps|undefined>(undefined);

export function UpdateTaskDialog() {
    const updatedContext=useContext(UpdateContext);
    const critical: string[] = ["low", "medium", "high"];
    const [title, setTitle] = useState<string>("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [assinee, setAssignee] = useState<number | undefined>(undefined);
    const toast=useRef<Toast|null>(null);
    useEffect(() => {
        if (updatedContext?.updateVisible && updatedContext?.updatetask) {
            setTitle(updatedContext?.updatetask.title ?? "");
            setPriority(updatedContext?.updatetask.priority ?? "low");
            setAssignee(updatedContext?.updatetask.assinee ?? undefined);
            console.log("GG");
        } else if (!updatedContext?.updateVisible) {
            setTitle("");
            setPriority("low");
            setAssignee(undefined);
        }
    }, [updatedContext?.updateVisible, updatedContext?.updatetask]);

    function handleTaskCreation() {
        
        const assignerId: number = updatedContext?.updatetask.assigner?updatedContext.updatetask.assigner:1;
        const currentUserId = Number(sessionStorage.getItem("id"));
        const userTeams = getTeamsOfUser(currentUserId);
        
        // Check if user is part of the team that created this task
        const isPartOfTeam = userTeams?.some(team => team.teamLead === assignerId);
        
        if (!isPartOfTeam) {
            toast.current?.show({ severity: 'error', summary: "Access Denied", detail: "You are not part of the team that created this task. 🚫" });
            updatedContext?.setUpdateVisible(false);
            return;
        }
        
        // If user doesn't have admin role, prevent changing assignee
        const isAdmin = sessionStorage.getItem("role") === "admin";
        const finalAssignee = isAdmin ? (assinee ?? updatedContext?.updatetask.assinee ?? 1) : (updatedContext?.updatetask.assinee ?? 1);
        
        const updated = UpdateTask({ 
            id: updatedContext?.updatetask.id?updatedContext.updatetask.id:1, 
            title: title, 
            assinee: finalAssignee, 
            assigner: assignerId, 
            status: updatedContext?.updatetask.status?updatedContext.updatetask.status:"To do", 
            deleted: false, 
            priority: priority 
        });
        
        if (updated == null) {
            toast.current?.show({ severity: 'error', summary: 'Task was not updated', detail: "Task updation failed due to internal issues. \n Please wait 🚫" });
            updatedContext?.setUpdateVisible(false);
        } else {
            toast.current?.show({ severity: 'success', summary: 'Task updation successfull', detail: "Task updation completed" });
            updatedContext?.setUpdateVisible(false);
            updatedContext?.setUpdateTask(updated);
        }
    }

    function handleDeleteTask() {
        const assignerId: number = updatedContext?.updatetask.assigner?updatedContext.updatetask.assigner:1;
        const currentUserId = Number(sessionStorage.getItem("id"));

        // Only task assigner can delete
        if (currentUserId !== assignerId) {
            toast.current?.show({ severity: 'error', summary: "Access Denied", detail: "Only the task assigner can delete this task. 🚫" });
            return;
        }

        const deleted = deleteTask(updatedContext?.updatetask.id ?? 0);
        if (deleted) {
            toast.current?.show({ severity: 'success', summary: 'Task Deleted', detail: "Task has been deleted successfully" });
            updatedContext?.setUpdateVisible(false);
            updatedContext?.setUpdateTask(deleted);
        } else {
            toast.current?.show({ severity: 'error', summary: 'Delete Failed', detail: "Could not delete task" });
        }
    }

    return (
        <div className="bg-white items-center justify-center  min-h-[60vg] w-full">
            <Toast ref={toast}/>
            <Dialog visible={updatedContext?.updateVisible} header={updatedContext?.header} onHide={() => updatedContext?.setUpdateVisible(false)} draggable={false} className="flex min-w-auto md:min-w-[70vh] overflow-auto dark:bg-black">
                <form className="flex flex-col p-4">
                    
                    <input type="hidden" value={String(updatedContext?.updatetask?.id)} />

                    <div className="mb-4 w-full">
                        <FloatLabel className="w-full">
                            <InputText
                                type="text"
                                className="w-full"
                                value={title}
                                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                                required
                            />
                            <label>Title</label>
                        </FloatLabel>
                    </div>

                    <div className="mb-4">
                        <label>Priority</label>
                        <Dropdown
                            value={priority}
                            onChange={(e: any) => setPriority(e.value)}
                            options={critical}
                            placeholder="Select priority"
                            className="w-full md:w-14rem"
                        />

                    </div>
                    <div className="mb-4">
                        <label>Assign Task To</label>
                        <Dropdown
                            value={assinee}
                            onChange={(e: any) => setAssignee(e.value)}
                            options={getUsers()?.map(user => ({ label: user.name, value: user.id }))}
                            placeholder="Select assignee"
                            className="w-full md:w-14rem"
                            required
                            disabled={sessionStorage.getItem("role") !== "admin"}
                        />
                    </div>
                    <div className="mb-4 flex gap-2">
                        <button className="flex-1 bg-blue-500 p-3 text-white" type="button" onClick={handleTaskCreation}>Update Task</button>
                        {updatedContext?.updatetask.assigner === Number(sessionStorage.getItem("id")) && (
                            <button className="flex-1 bg-red-500 p-3 text-white" type="button" onClick={handleDeleteTask}>Delete Task</button>
                        )}
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
