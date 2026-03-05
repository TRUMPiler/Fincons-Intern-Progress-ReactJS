import './App.css'
import { Route,Routes } from 'react-router';
import {Home} from './pages/Home';

import SidebarExample, { SideBarContext, type SideBarContextProps } from './components/SidebarExample';
import Login from './pages/Login';
import Register from './pages/Register';
import { Todo } from './pages/Todo';
import { TeamsPage } from './pages/Teams';
import { useEffect, useState } from 'react';
import { addUser, getUsers } from './models/user';
import { SidebarProvider, SidebarTrigger } from './components/ui/sidebar';
import { PanelLeftOpen } from 'lucide-react';
import { createTeam } from './models/Teams';

// import { DragDrop } from './pages/DragDrop';
function App() {
   const [open, SetOpen] = useState<boolean>(false);

    useEffect(()=>{
          if(sessionStorage.getItem("id")) return;
          if(getUsers()) return;
          const user=addUser({id:0,name:"naisal",email:"naisal036@gmail.com",password:"naisal036@gmail.com",role:"admin"});
          addUser({id:0,name:"Riya",email:"riya.jain@finconsgroup.com",password:"riyaISGreat@123",role:"admin"}); //id is zero because add user will assign the id, no need to worry
          addUser({id:0,name:"naishal",email:"naishal036@gmail.com",password:"naishalK$447@",role:"user"});
          createTeam("Youtiverse",1,[3]);
          console.log(user);
      },[])
      
      const value:SideBarContextProps={open,setOpen:SetOpen};
  return (
    <>
    <SideBarContext.Provider value={value}>
     <SidebarProvider open={value.open} onOpenChange={value.setOpen}>
      <div className='absolute top-10 left-5 flex justify-center items-center'>
       
      {!open && (
        <SidebarTrigger asChild>
          <button className="flex items-center justify-center w-full p-2 ">
            <PanelLeftOpen className="absolute w-6 h-6 dark:bg-black text-black dark:text-white" />
          </button>
        </SidebarTrigger>
      )}

        <SidebarExample/>
        </div>

            <Routes>         
              <Route path='/' element={<Home/>}/>
              <Route path="/login" element={<Login/>}/>
              <Route path="/Register" element={<Register/>}/>
              {/* <Route path="/dragDropExample" element={<DragDrop/>}/> */}
              <Route path='/todo' element={<Todo/>}/>
              <Route path='/teams' element={<TeamsPage/>}/>
            </Routes>
            </SidebarProvider>
            </SideBarContext.Provider>
    </>
  )
}

export default App
