export type User={
    id:number;
    name:string;
    email:string;
    password:string;
    role:string;
}
export const updateUser=({id,name,email}:any):boolean=>
{
    if(!getUserById(Number(id)))
    {
        console.log(id,name,email);
        console.log(typeof(id));
        console.log("User Not Found");
        return false;
    }
    const users = getUsers();
    if(users) {
        const updatedUsers = users.map(user=>user.id===id?{...user,email,name}:user);
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    }
    return true;
}
export const addUser = (newUser: User): boolean => {
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];

    const emailExists = users.some(user => user.email === newUser.email);
    if (emailExists) {
        return false;
    }

    const maxId = users.length > 0
        ? Math.max(...users.map(u => u.id))
        : 0;

    const userWithId: User = {
        ...newUser,
        id: maxId + 1
    };

    users.push(userWithId);

    localStorage.setItem("users", JSON.stringify(users));

    return true;
};
export const getUserByEmail = (email: string): User | null => {
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    const foundUser = users.find(user => user.email === email);
    return foundUser || null;
};
export const getUserById = (id: number): User | null => {
    console.log(id);
    const storedUsers = localStorage.getItem("users");
    const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
    const foundUser = users.find(user => user.id === id);
    return foundUser || null;
};

export const getUsers=():User[]|null=>{
    const storedUsers = localStorage.getItem("users");
    console.log(storedUsers);
    if(!storedUsers || storedUsers.length === 0)
    {
        return null;
    }
    return JSON.parse(storedUsers);
}