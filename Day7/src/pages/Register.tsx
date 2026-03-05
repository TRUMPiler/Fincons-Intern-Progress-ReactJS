import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { useRef, useState } from "react";
import { addUser } from "../models/user";
import { Toast } from "primereact/toast";

const Register = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const toast = useRef<Toast | null>(null);
    const [nameError, setNameError] = useState<string | null>(null);
    const [emailError, setEmailError] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const validate = () => {
        let valid = true;
        const tName = name.trim();
        const tEmail = email.trim();
        const tPassword = password.trim();
        const emailRegex = /^\S+@\S+\.\S+$/;

        if (!tName) {
            setNameError('Name is required');
            valid = false;
        } else {
            setNameError(null);
        }

        if (!tEmail) {
            setEmailError('Email is required');
            valid = false;
        } else if (!emailRegex.test(tEmail)) {
            setEmailError('Please enter a valid email');
            valid = false;
        } else {
            setEmailError(null);
        }

        if (!tPassword) {
            setPasswordError('Password is required');
            valid = false;
        } else if (tPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            valid = false;
        } else {
            setPasswordError(null);
        }

        return valid;
    }


    const handleRegister = () => {
        if (!validate()) {
            toast.current?.show({ severity: 'error', summary: 'Validation failed', detail: 'Please fix the highlighted errors' });
            return;
        }

        const user = addUser({ id: 0, name: name.trim(), password: password.trim(), email: email.trim(), role: "user" })
        if (user == true) {
            toast.current?.show({ severity: 'success', summary: 'Registration successful', detail: "Please Login Now To Continue 😉" });
            setTimeout(() => { window.location.href = "/login" }, 1500);
        }
        else {
            toast.current?.show({ severity: 'error', summary: 'Existing Credentials Found', detail: "You are already Registered. Please Login." });
            setTimeout(() => { window.location.href = "/login" }, 1200);
        }
    }
    return (
        <div className="flex dark:bg-black bg-white w-full justify-center items-center dar">
            <Toast ref={toast} />
            <div className="flex flex-col items-start dark:bg-black dark:border dark:border-gray-300 bg-gray-200 rounded-xl w-full m-64">
                <p className="text-2xl p-7 dark:text-yellow-500 text-black">User Registeration Form</p>

                <form className="flex flex-col items-center p-6 rounded w-full max-w-full" onSubmit={(e)=>{e.preventDefault(); handleRegister();}}>

                    <div className="mb-7 w-full">
                        <FloatLabel className="w-full">
                            <InputText className="w-full" value={name} type="text" onChange={(e) => {
                                setName((e.target as HTMLInputElement).value);
                                setNameError(null);
                            }} aria-invalid={!!nameError} />
                            <label>Name</label>
                      
                        </FloatLabel>
                              {nameError && <small className="text-red-500 mt-1">{nameError}</small>}
                    </div>

                    <div className="mb-7 w-full">
                        <FloatLabel className="w-full">
                            <InputText className="w-full" value={email} type="email" onChange={(e) => {
                                setEmail((e.target as HTMLInputElement).value);
                                setEmailError(null);
                            }} aria-invalid={!!emailError} />
                            <label>Email</label>
                           
                        </FloatLabel>
                         {emailError && <small className="text-red-500 mt-1">{emailError}</small>}
                    </div>
                    <div className="mb-7 w-full">
                        <FloatLabel className="w-full">
                            <InputText className="w-full" value={password} type="password" onChange={(e) => {
                                setPassword((e.target as HTMLInputElement).value);
                                setPasswordError(null);
                            }} aria-invalid={!!passwordError} />
                            <label>Password</label>
                           
                        </FloatLabel>
                         {passwordError && <small className="text-red-500 mt-1">{passwordError}</small>}
                    </div>

                </form>
                <div className="flex gap-2 mb-7 p-2 ml-5">
                    <button type="submit" className="bg-black px-3 py-2 rounded text-white dark:bg-blue-400  dark:text-black dark:border-white dark:border-2" onClick={handleRegister}>Register</button>
                    <button className="bg-black px-3 py-2 rounded text-white dark:bg-green-400 dark:text-black dark:border-white dark:border-2" onClick={() => { window.location.href = './Login' }}>Login</button>
                </div>
            </div>
        </div>

    );
}

export default Register;
