import type { FC } from "react";


export const Home: FC = () => {
    return (
        <div className="flex gap-2 flex-col dark:bg-none dark:bg-black bg-linear-to-r from-amber-300 to-amber-700 items-center justify-center w-full  min-h-screen ">
            <p className="text-xl lg:text-3xl text-white">Welcome to Fincons Scrum Board</p>
            <button className="p-3 px-6 bg-white text-amber-500 rounded-lg hover:scale-110 hover:text-black transition-all" onClick={()=>window.location.href='/todo'}>Lets Get Started</button>
        </div>
    );

}