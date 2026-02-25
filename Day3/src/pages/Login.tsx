import React, { useEffect, useState, type FormEvent,useRef } from "react";
import { GetData, type user, checkUser } from "../utils/AuthProvider";
import Spinner from "../components/Spinner";


const Login = () => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [email, setEmail] = useState<string>('');
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
    const passwordRegex=/^(?=.{3,})/;
    const [emailError, setEmailError] = useState<boolean>(false);
    const [passwordError, setPasswordError] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            try {
                const response = await GetData();
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, [])
    const checkEmail = (text: string) => {
        setEmail(text);
        if (!emailRegex.test(text)) {
            setEmailError(true);
            console.log("invalid");
        }
        else {
            setEmailError(false);
            console.log("valid");
        }
    }

    const [password, setPassword] = useState<string>('');
    const checkPassword = (text: string) => {
        setPassword(text);
        if (passwordRegex.test(text)) {
            
            setPasswordError(false);
            console.log("valid");
        }
        else {
            setPasswordError(true);
            console.log("invalid");
        }
    }
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return; 

    if (emailError || passwordError) {
        alert("Please fix Validation Issues first");
        return;
    }

    try {
        setIsSubmitting(true);

        const isValid = await checkUser(email, password);

        if (isValid) {
            alert("User Logged in");
            
        } else {
            alert("Credentials did not match");
            inputRef.current?.focus();
        }

    } catch (error) {
        console.error(error);
    } finally {
        setIsSubmitting(false);
        setEmail('');
        setPassword('');
    }
};

    return (
        <>
        {(isSubmitting)?(
            <Spinner/>
            ):(
        
            <div className="flex bg-gray flex-col justify-center items-center  max-w-full min-h-screen">

                <form className="flex bg-gray-200 flex-col gap-6 rounded p-9 w-200" onSubmit={handleSubmit}>
                    <p className="text-2xl text-center">Login Form</p>
                    <div className="">
                        <label className="font-medium">Email ID:</label>
                        <input type="email" placeholder="Enter Email" id="email" className="border-2 p-2 w-full" value={email} ref={inputRef} onChange={(e) => { checkEmail(e.target.value) }} required />
                        {(emailError) ? (<p className="text-red-500">Error Email Format is Not matched</p>) : (<></>)}
                    </div>
                    <div className="">
                        <label className="font-medium">Password:</label>
                        <input type="password" placeholder="Enter Password" id="password" className="border-2 p-2 w-full" value={password} onChange={(e) => { checkPassword(e.target.value) }} required />
                        {(passwordError) ? (<p className="text-red-500">Error Password Format is Not matched</p>) : (<></>)}
                    </div>
                    <div className="flex gap-2">

                        <button className="bg-blue-700 p-3 text-white shadow-white rounded">Login</button>
                    </div>
                </form>
            </div>
       
        )}
         </>
    );
}
export default Login;