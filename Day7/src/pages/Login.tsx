import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useEffect, useRef, useState } from "react";
import {getUserByEmail} from "../models/user";
import { Toast } from "primereact/toast";

const Login = () => {
    const [email,setEmail]=useState<string>('');
    const [password,setPassword]=useState<string>('');
    const [emailError, setEmailError] = useState<string| null>(null);
    const [passwordError, setPasswordError] = useState<string| null>(null);
    const toast = useRef<Toast|null>(null);
    //  const show = () => {
    //     toast.current?.show({ severity: 'info', summary: 'Info', detail: 'Message Content' });
    // };
    const validate = () => {
        let valid = true;
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // simple email regex
        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!trimmedEmail) {
            setEmailError('Email is required');
            valid = false;
        } else if (!emailRegex.test(trimmedEmail)) {
            setEmailError('Please enter a valid email');
            valid = false;
        } else {
            setEmailError(null);
        }

        if (!trimmedPassword) {
            setPasswordError('Password is required');
            valid = false;
        } else if (trimmedPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        } else {
            setPasswordError(null);
        }

        return valid;
    }

    // keep original login logic in a separate function to call after validation
    const doLogin = () => {
        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();
        const getUser=getUserByEmail(trimmedEmail);
        if(getUser!=null)
        {
            if(getUser.password===trimmedPassword)
            {
                sessionStorage.setItem("id",getUser.id.toString());
                sessionStorage.setItem("name",getUser.name);
                sessionStorage.setItem("email",getUser.email);
                sessionStorage.setItem("role",getUser.role);
                toast.current?.show({ severity: 'success', summary: 'Login Successfull', detail: 'Welcome '+getUser.name+" 😊" });
                setTimeout(()=>{window.location.href="/";},4000);
                
            }
            else
            {
                toast.current?.show({ severity: 'error', summary: 'Login attempt failed', detail: "Please Check you're login credentials🔍" });
            }
        }
        else
        {
            toast.current?.show({ severity: 'error', summary: 'Not Found', detail: "Please Register before you join 🚫" });
        }
    }
    useEffect(()=>{
        if(sessionStorage.getItem("id")) window.location.href='/';
    },[])
    return (


        <div className="flex dark:bg-black bg-white w-full justify-center items-center">
            <Toast ref={toast}/>
            <div className="flex flex-col items-start dark:bg-black dark:border dark:border-gray-300 bg-gray-200 rounded-xl w-full m-64">
                <p className="text-2xl p-7 dark:text-blue-300 text-black">User Login Form</p>

                <form className="flex flex-col items-center p-6 rounded w-full max-w-full" onSubmit={(e)=>{e.preventDefault(); if(validate()){doLogin();}}}>

                    <div className="mb-7 w-full">
                        <FloatLabel className="w-full dark:bg-black">
                            <InputText className="w-full dark:bg-black" value={email} onChange={(e)=>{
                                setEmail((e.target as HTMLInputElement).value);
                                
                                setEmailError(null);
                            }} type="email" aria-invalid={!!emailError} />
                            <label>Email</label>
                           
                        </FloatLabel>
                         {emailError && <small className="text-red-500 mt-1">{emailError}</small>}
                    </div>

                    <div className="mb-7 w-full">
                        <FloatLabel className="w-full">
                            <InputText className="w-full"  value={password} onChange={(e)=>{
                                setPassword((e.target as HTMLInputElement).value);
                                setPasswordError(null);
                            }} type="password" aria-invalid={!!passwordError} />
                            <label>Password</label>
                           
                        </FloatLabel>
                         {passwordError && <small className="text-red-500 mt-1">{passwordError}</small>}
                    </div>
                   
                </form>
               <div className="flex gap-2 mb-7 p-2">
                    <button type="submit" className="bg-black px-3 py-2 rounded text-white dark:bg-green-400 dark:text-black dark:border-white dark:border-2" onClick={()=>{if(validate()) doLogin();}}>Login</button>
                    <button className="bg-black px-3 py-2 rounded text-white dark:bg-blue-400  dark:text-black dark:border-white dark:border-2" onClick={()=>{window.location.href="./Register"}}>Register</button>
                </div>
            </div>
        </div>

    );
}

export default Login;