import {
  Sidebar,

  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarContent,
  SidebarFooter,
} from "./ui/sidebar"

import {
  BookDashed,

  PanelLeftClose,
  FileText,
  Users,
  Settings,
} from "lucide-react"

import { createContext, useContext, useRef, useState, type Dispatch, type SetStateAction } from "react"
import { Link } from "react-router"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog } from "primereact/dialog";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { updateUser } from "../models/user";

export type SideBarContextProps = {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>;
}
export const SideBarContext = createContext<SideBarContextProps | null>(null);
export default function SidebarExample() {
  const toast = useRef<Toast | null>(null);
  const SideBarcontext = useContext(SideBarContext);
  const [profileEditVisible, setProfileEditVisible] = useState<boolean>();
  const [name, setName] = useState<string | undefined | null>(sessionStorage.getItem("name"));
  const [email, setEmail] = useState<string | undefined | null>(sessionStorage.getItem("email"));
  const handleUpdate = () => {
    if (!sessionStorage.getItem("id")) {
      toast.current?.show({ severity: "error", summary: "No Credentials stored on server", detail: "Your Details have been deleted please login in again" });
      setProfileEditVisible(false);
      setEmail("");
      setName("");
      console.log("Gekki");
      return;
    }
    if (email === "" || name === "") {
      console.log("Gekko");
      toast.current?.show({ severity: "error", summary: "Empty Details", detail: "Please fill all the required details" });
      return;
    }
    const update = updateUser({ id: sessionStorage.getItem("id"), name: sessionStorage.getItem("name"), email: sessionStorage.getItem("email") });
    if (update == true) {
      toast.current?.show({ severity: "success", summary: "Profile Updated", detail: "You're Profile has been updated" })
      setProfileEditVisible(false);
      setEmail(email);
      sessionStorage.setItem("name", name || "");
      sessionStorage.setItem("email", email || "");
      setName(name);
      return;
    }
    else {
      console.log("ss");
    }
  }
  return (

    <Sidebar variant="sidebar" collapsible="offcanvas">
      <Toast ref={toast} />
      <div className="flex items-center text-center justify-between p-3 m-2">
        {SideBarcontext?.open && (
          <SidebarTrigger asChild>
            <button className=" bg-white dark:bg-black">
              <PanelLeftClose className="w-6 h-6 text-black dark:text-white" />
            </button>
          </SidebarTrigger>
        )}
        <h1 className="text-xl">Fincons Scrum Board</h1>
      </div>

      <SidebarHeader />

      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <Dialog header="Update Profile" visible={profileEditVisible} onHide={() => { setProfileEditVisible(false); }} className="flex flex-col min-w-[60vh]">
              <form className="flex flex-col w-full p-10 gap-7">

                <FloatLabel className="w-full">
                  <InputText className="w-full" value={name} onChange={(e) => { setName(e.target.value) }} />
                  <label>Name</label>
                </FloatLabel>
                <FloatLabel className="w-full">
                  <InputText className="w-full" value={email} onChange={(e) => { setEmail(e.target.value) }} />
                  <label>Email</label>
                </FloatLabel>
                <button type="button" onClick={() => handleUpdate()} className="bg-black text-white p-3">Update Profile</button>
              </form>
            </Dialog>
            <div className="flex flex-col items-start justify-start border-t p-2 gap-3">
              <nav className="w-full">
                <ul className="flex flex-col gap-2">
                  <li>
                    <Link to="/" onClick={() => SideBarcontext?.setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                      <BookDashed size={18} />
                      <span>Dashboard</span>
                    </Link>
                  </li>
                  <li>
                    <Link to="/todo" onClick={() => SideBarcontext?.setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                      <FileText size={18} />
                      <span>Jira Board</span>
                    </Link>
                  </li>
                  {sessionStorage.getItem("role") === "admin" && (
                    <li>
                      <Link to="/teams" onClick={() => SideBarcontext?.setOpen(false)} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                        <Users size={18} />
                        <span>Teams</span>
                      </Link>
                    </li>
                  )}
                  <li>
                    <Link to="#" onClick={() => { setProfileEditVisible(true); }} className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-slate-800">
                      <Settings size={18} />
                      <span>Update Profile</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter>
        {sessionStorage.getItem("id") ? (
          <div className="flex items-center justify-between gap-3 ">
            <Avatar size="lg" className="">
              <AvatarImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0HX-dqigYiG3d-N6IxUe8dGr_s5Kp7n9yg&s" />
              <AvatarFallback>NO</AvatarFallback>
            </Avatar>
            <label className="dark:text-white">{sessionStorage.getItem("name")?.toUpperCase()}</label>
            <button
              className="bg-black text-center p-2 text-white rounded-lg dark:border dark:border-white"
              onClick={() => {
                sessionStorage.clear()
                window.location.href = "/login"
              }}
            >
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-start gap-3">
            <button
              className="bg-black text-white px-4 py-2 rounded  dark:border dark:border-white"
              onClick={() => {
                window.location.href = "/login"
              }}
            >
              Sign In
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>

  )
}