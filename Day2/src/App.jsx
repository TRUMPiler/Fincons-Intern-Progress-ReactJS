import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Counter } from './components/Counter';
import UserProfileCard from './components/UserProfileCard';

function App() {
  const [count, setCount] = useState(0)
  const [visible,setVisible]=useState(false);
  const setVisibilty=()=>
  {
    if(visible==false) setVisible(true);
    else setVisible(false);
  }
  return (
    <>
      <div>
        <input type="checkbox" onChange={setVisibilty} value={visible}/>See Profile
          {(visible)?(<> <UserProfileCard name="Naisal Doshi" img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp0HX-dqigYiG3d-N6IxUe8dGr_s5Kp7n9yg&s" role="Intern"/></>):(<></>)}
             {/* <UserProfileCard name="Naisal Doshi" img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbgk0yfCOe55931lf6q0osfhGRU-fnH8Im1g&s"/> */}
      <Counter/>
      </div>
      
    </>
  )
}

export default App
