import { Dialog } from "primereact/dialog";
import { useState, useEffect, type Dispatch, type SetStateAction, useRef } from "react";
import { createTask, type Task } from "../models/Todo";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { getUsers } from "../models/user";
import { Toast } from "primereact/toast";
import { getTeamsByLead } from "../models/Teams";

type DialogProps = {
    createVisible: boolean;
    setCreateVisible: Dispatch<SetStateAction<boolean>>;
    header: string;
    task: Task;
    setTask: Dispatch<SetStateAction<Task>>;
};

export function CreateTaskDialog({ createVisible, setCreateVisible, header, task, setTask }: DialogProps) 
{
    const toast=useRef<Toast|null>(null);
    const critical: string[] = ["low", "medium", "high"];
    const [title, setTitle] = useState<string>("");
    const [priority, setPriority] = useState<"low" | "medium" | "high">("low");
    const [assinee, setAssignee] = useState<number | undefined>(undefined);
    const [teamMembers, setTeamMembers] = useState<number[]>([]);
  
    useEffect(() => {
        if (createVisible && task) {
            setTitle(task.title ?? "");
            setPriority(task.priority ?? "low");
            setAssignee(task.assinee ?? undefined);
            
            
            const currentUserId = Number(sessionStorage.getItem("id"));
            const myTeams = getTeamsByLead(currentUserId);
            
            if (myTeams && myTeams.length > 0) {
              
                const allMembers = new Set<number>();
                myTeams.forEach(team => {
                    team.members.forEach(memberId => allMembers.add(memberId));
                });
                setTeamMembers(Array.from(allMembers));
            }
        } else if (!createVisible) {
            setTitle("");
            setPriority("low");
            setAssignee(undefined);
            setTeamMembers([]);
        }
    }, [createVisible, task]);

    function handleTaskCreation() {
        const assignerId: number = Number(sessionStorage.getItem("id") ?? 0);
        if(title==""||assinee==undefined)
        {
            // alert("Fill All the Data");
            toast.current?.show({severity:"error",summary:"Details not filled",detail:"Please fill the details completely 🙏"});
            return;
        }
        const created = createTask({ id: 0, title: title, assinee: assinee ? assinee : 1, assigner: assignerId, status: "To do", deleted: false, priority: priority });
        if (created == null) {
            // alert("Task Not Created");
            toast.current?.show({severity:"error",summary:"Task Creation Failure",detail:"Please Try Again later as there is from our side 🙏"});
            setCreateVisible(false);
        } else {
            // alert("Task Created");
            toast.current?.show({severity:"success",summary:"Task Creation Success",detail:"Now perform the task accordingly 😃"});
            setCreateVisible(false);
            setTask(created);
        }
    }

    return (
        <div className="bg-white items-center justify-center  min-h-[60vg] w-full">
            <Toast ref={toast}/>
            <Dialog visible={createVisible} header={header} onHide={() => setCreateVisible(false)} draggable={false} className="flex min-w-auto md:min-w-[70vh] overflow-auto dark:bg-black">
                <form className="flex flex-col p-4">
                    {/* Hidden id field */}
                    <input type="hidden" value={String(task?.id)} />

                    <div className="mb-4 w-full">
                        <FloatLabel className="w-full">
                            <InputText
                                type="text"
                                className="w-full"
                                value={title}
                                onChange={(e) => setTitle((e.target as HTMLInputElement).value)}
                                required={true}
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
                             required={true}
                        />

                    </div>
                    <div className="mb-4">
                        <label>Assign Task To</label>
                        <Dropdown
                            value={assinee}
                            onChange={(e: any) => setAssignee(e.value)}
                            options={getUsers()?.filter(user => teamMembers.includes(user.id)).map(user => ({ label: user.name, value: user.id }))}
                            placeholder="Select assignee"
                            className="w-full md:w-14rem"
                            required={true}
                        />
                    </div>
                    <div className="mb-4">
                        <button className="bg-blue-500 p-3 text-white" type="button" onClick={handleTaskCreation}>Create Task</button>
                    </div>
                </form>
            </Dialog>
        </div>
    );
}
