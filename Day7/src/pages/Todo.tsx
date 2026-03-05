import { DndContext, DragOverlay, MouseSensor, PointerSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { ColumnComponent } from "../components/Column";
import { createTask, GetAllTasks, UpdateTask, type Task } from "../models/Todo";
import { useEffect, useRef, useState } from "react";
import { TaskCard } from "../components/Tasks";
import { CreateTaskDialog } from "../components/CreateTask";
import { UpdateContext, UpdateTaskDialog, type updateDialogProps } from "../components/UpdateTask";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import { getUsers } from "../models/user";
import { getTeamsOfUser } from "../models/Teams";


export function Todo() {
  const [createVisible, setCreateVisible] = useState<boolean>(false);
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const toast = useRef<Toast | null>(null)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 150,
        tolerance: 5,
      },
    })
  );
  const taskList: Task[] = [{ id: 1, title: "Meet Naisal", status: "To do", priority: "low", deleted: false, assigner: 1, assinee: 1 },
  { id: 2, title: "Attend Board Meeting", status: "In-Progress", priority: "medium", deleted: false, assigner: 1, assinee: 1 },
  { id: 3, title: "Attend Board Meeting 1", status: "Done", priority: "low", deleted: false, assigner: 1, assinee: 1 },
  { id: 4, title: "Attend Board Meeting 2", status: "Done", priority: "high", deleted: false, assigner: 1, assinee: 1 },
  { id: 5, title: "Attend Board Meeting 3", status: "BackLog", priority: "high", deleted: false, assigner: 1, assinee: 1 }
  ];
  const [tasks, setTasks] = useState<Task[] | undefined>([]);
  useEffect(() => {
    // localStorage.clear(); 
    const tasks = GetAllTasks();
    console.log(tasks)
    if (tasks === null || tasks.length == 0) {
      console.log("empty");
      taskList.map(tassk => console.log(createTask(tassk)));

    }
    else {
      console.log(tasks);
    }
    setTasks(GetAllTasks() ?? []);

  }, [])

  type COLUMNS = {
    id: string;
    title: string;
    color: string;
  }
  const Colums: COLUMNS[] = [{
    id: "To do",
    title: "TO-DO",
    color: "bg-blue-300"
  },
  {
    id: "BackLog",
    title: "Back Log",
    color: "bg-green-400"

  },
  {
    id: "In-Progress",
    title: "In Progress",
    color: "bg-yellow-500"
  },
  {
    id: "Done",
    title: "Completed",
    color: "bg-black"
  }]


  const [activeId, setActiveId] = useState<number | string | null>(null);
  const defaultTask: Task = { id: 0, title: "", status: "To do", priority: "low", deleted: false, assigner: 0, assinee: 0 };
  const [task, setTask] = useState<Task>(defaultTask);
  const [updateTask, setUpdateTask] = useState<Task>(defaultTask);
  const [editVisible, setEditVisible] = useState<boolean>(false);
  useEffect(() => {
    if (sessionStorage.getItem("id") === null || sessionStorage.getItem("id") === undefined) {
      // alert("Please Sign-in or Register before logging in");
      toast.current?.show({ severity: "error", summary: "Sign in required", detail: "You need to sign-in before accessing the page🚫" });
      setTimeout(() => {
        window.location.href = "/login";
      }, 3000)
      return;
    }
    console.log(sessionStorage.getItem("id"));
  }, []);
  const [userFilter, setUserFilter] = useState<number | null>(null);
  
  // Helper function to check if user is part of task creator's team
  const canUserAccessTask = (task: Task): boolean => {
    const currentUserId = Number(sessionStorage.getItem("id"));
    const userTeams = getTeamsOfUser(currentUserId);
    
    if (!userTeams || userTeams.length === 0) {
      return false;
    }

    // Check if user's team lead created the task
    return userTeams.some(team => team.teamLead === task.assigner);
  };

  useEffect(() => {
    setTasks(GetAllTasks() ?? []);
  }, [updateTask])
  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number | string);
  };
  useEffect(() => {
    setTasks(GetAllTasks() ?? []);
  }, [task])
  const handleTaskUpdate = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = Number(active.id);
    const newStatus = over.id as Task["status"];

    const updatedTasks = tasks?.map(taskss =>
    (
      taskss.id === taskId && canUserAccessTask(taskss) ? { ...taskss, status: newStatus } : taskss
    )
    ) ?? [];
    setTasks(updatedTasks);

    const updatedTask = updatedTasks.find(t => t.id === taskId);
    if (updatedTask) {
      UpdateTask(updatedTask);
    }
    setActiveId(null);
  };
  const DialogProps: updateDialogProps = { header: "Update Task", updatetask: updateTask, setUpdateTask: setUpdateTask, updateVisible: editVisible, setUpdateVisible: setEditVisible };
  return (
    <div className="dark:bg-none dark:bg-black  min-h-screen py-8 bg-linear-to-r  from-amber-300 to-amber-700  w-full h-full">
      <Toast ref={toast} />
      <UpdateContext.Provider value={DialogProps}>

        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-center dark:text-white text-gray-800">Tasks</h1>
          <CreateTaskDialog header="Create Task" createVisible={createVisible} setCreateVisible={setCreateVisible} task={task} setTask={setTask} />
          <UpdateTaskDialog />
          <div className="flex flex-col md:flex-row justify-center lg:justify-end items-center m-auto md:m-3 p-2 gap-1 md:gap-3">
            <div className="flex  items-center gap-2">
              <button onClick={() => setPriorityFilter('all')} className={`px-3 py-2 rounded dark:border dark:bg-black dark:border-white ${priorityFilter === 'all' ? 'bg-gray-700 text-white dark:text-black dark:bg-white' : 'bg-gray-200 text-blue-300'}`}>All</button>
              <button onClick={() => setPriorityFilter('low')} className={`px-3 py-2 rounded dark:border dark:bg-black dark:border-white ${priorityFilter === 'low' ? 'bg-green-700 text-white dark:bg-white dark:text-black' : 'bg-green-200 dark:text-green-300'}`}>Low</button>
              <button onClick={() => setPriorityFilter('medium')} className={`px-3 py-2 rounded dark:border dark:bg-black dark:border-white ${priorityFilter === 'medium' ? 'bg-yellow-500 text-white dark:bg-white dark:text-black' : 'bg-yellow-200 dark:text-yellow-500'}`}>Medium</button>
              <button onClick={() => setPriorityFilter('high')} className={`px-3 py-2 rounded dark:border dark:bg-black dark:border-white ${priorityFilter === 'high' ? 'bg-red-600 text-white dark:bg-white dark:text-black' : 'bg-red-200 dark:text-red-400'}`}>High</button>

            </div>
            <div className="flex gap-2">
              <Dropdown value={userFilter} showClear onChange={(e) => { setUserFilter(e.target.value) }} options={getUsers()?.map(user => ({ label: user.name, value: user.id }))} placeholder="Select User to filter" className="flex min-w-[10vh]" />
              <button className={`bg-green-500 p-3 text-white border dark:border dark:border-white border-black hover:scale-110 transition-all rounded-lg ` + sessionStorage.getItem} onClick={() => {
                if (sessionStorage.getItem("role") != "admin") {
                  // alert("Role not Sufficent to access this feature");
                  toast.current?.show({ severity: "error", summary: "Access Denied", detail: "You're role doesn't match the access levels" });
                  return;
                }
                setCreateVisible(true);
              }}>Create Task</button>
            </div>
          </div>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleTaskUpdate} sensors={sensors}>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 justify-center items-start">
              {Colums.map((Colum) => (
                <ColumnComponent
                  key={Colum.id}
                  id={Colum.id}
                  title={Colum.title}
                  color={Colum.color}
                  task={tasks?.filter(task =>
                    task.status === Colum.id &&
                    (priorityFilter === 'all' || task.priority === priorityFilter) &&
                    (userFilter === null || userFilter === undefined || task.assigner === userFilter || task.assinee === userFilter) &&
                    !task.deleted
                  )}
                  onEdit={(t) => { setTask(t); setEditVisible(true); }}
                />
              ))}
            </div>
            <DragOverlay>
              {activeId ? (
                (() => {
                  const idNum = Number(activeId);
                  const activeTask = tasks?.find(t => t.id === idNum);
                  if (!activeTask) return null;
                  const priorityColor: Record<Task['priority'], string> = {
                    low: 'bg-green-700',
                    medium: 'bg-yellow-400',
                    high: 'bg-red-500',
                  };
                  return <TaskCard task={activeTask} color={priorityColor[activeTask.priority]} />;
                })()
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </UpdateContext.Provider>
    </div>
  );
}