import { useState } from "react";

export function Counter() {
    const [count, setCount] = useState(0);
    // add()
    // {
    //     setCount(count=count+1);
    // }
    return (
        <>
            
            <div>
                <h1>Counter App</h1>
                <p>{count}</p>
                <button onClick={() => setCount(0)}>Reset</button>
                <button onClick={() => {
                    
                    setCount(count+1)
                }}>add/+</button>
                <button onClick={() => {
                    if (count == 0) return;
                    setCount(count - 1)
                }}>subtract/-</button>
            </div>
        </>

    );
}