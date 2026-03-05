export type Task={
    id:number;
    title:string;
    status:"BackLog"|"To do"|"In-Progress"|"Done";
    deleted:boolean;
    priority:"low"|"medium"|"high";
    assigner:number;
    assinee:number;
}


export const createTask = (newTask: Task): Task | null => {
    const getTasks = localStorage.getItem("tasks");
    const allTask: Task[] = getTasks ? JSON.parse(getTasks) : [];

    const titleExists = allTask.some(task => task.title === newTask.title);
    if (titleExists) {
        return null;
    }

    const maxId = allTask.length > 0
        ? Math.max(...allTask.map(t => t.id))
        : 0;

    const taskWithId: Task = {
        ...newTask,
        id: maxId + 1
    };

    allTask.push(taskWithId);

    localStorage.setItem("tasks", JSON.stringify(allTask));

    return taskWithId;
};

export const UpdateTask = (updatedTask: Task): Task | null => {
  const getTasks = localStorage.getItem("tasks");
  const allTask: Task[] = getTasks ? JSON.parse(getTasks) : [];
  if(sessionStorage.getItem("role")!="admin"&&!allTask.some(task=>task.assinee===updatedTask.assinee))
    return null;

  const updatedList = allTask.map(task =>
    task.id === updatedTask.id ? updatedTask : task
  );

  localStorage.setItem("tasks", JSON.stringify(updatedList));

  return updatedTask;
};

export const GetAllTasks=():Task[]|null=>{
    if(localStorage.getItem("items")?.length===0) return null;
    const getTasks=localStorage.getItem("tasks");
    const allTask:Task[]=getTasks?JSON.parse(getTasks):[];
     
    
    localStorage.setItem("tasks", JSON.stringify(allTask));
    return allTask;
}

export const deleteTask = (taskId: number): Task | null => {
    const getTasks = localStorage.getItem("tasks");
    const allTasks: Task[] = getTasks ? JSON.parse(getTasks) : [];

    const taskToDelete = allTasks.find(task => task.id === taskId);
    if (!taskToDelete) return null;

    const updatedTasks = allTasks.map(task =>
        task.id === taskId ? { ...task, deleted: true } : task
    );

    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    return taskToDelete;
};