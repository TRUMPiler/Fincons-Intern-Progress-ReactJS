export const GetData = async () => {
    return await fetch("https://api.escuelajs.co/api/v1/users");
}

export interface user {
    id: number,
    email: string,
    password: string,
    name: string,
    role: string,
    avatar: string

};
export const checkUser= async (email: string, password: string) => {
    const response = await GetData();
    const data: Array<user> = await response.json();
    const isValidUser = data.some(user => 
        user.email === email && user.password === password
    );
    if (isValidUser) {
        console.log(`User ${email} found and authenticated`);
    }
    return isValidUser;
}

