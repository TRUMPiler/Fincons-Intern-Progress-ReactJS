import { useNavigate } from "react-router";

export const Home=()=>{
    const navigate=useNavigate();
    return(
    <div className="flex bg-linear-to-r from-blue-300 to-blue-950 min-h-screen border-t-2 border-s-white">
        <div className="flex flex-col gap-2 justify-center items-center w-full">
            <h1 className="text-white text-3xl w-fit m-7 sm:m-2rem sm:w-auto hover:scale-105 transition-all cursor-pointer">Welcome to Fincons Shoping App</h1>
            <br/>
            <button className="border border-gray-600 bg-black m-7 p-3 sm:m-2rem sm:w-auto rounded-2xl text-white md:w-auto hover:scale-105 transition-all cursor-pointer" onClick={()=>navigate("/shop")}>Click here to visit shop</button>
        </div>
    </div>
    // <div className="flex bg-black">
    //     <p>Hello</p>

    // </div>
    );
}
 