
export function FirstComponent()
{
    const date = new Date();
    interface user{
        Name:string,
        Role:string,
        CurrentDate:string;
    }
    const newUser:user[]=[{Name:"Naisal",Role:"Admin",CurrentDate:date.toLocaleDateString()}];
    return(<div>
        {newUser.map((t)=>(
            <>
            <p>Name:{t.Name}</p><br/>
            <p>Role:{t.Role}</p><br/>
            <p>CurrentDate:{t.CurrentDate}</p>
            </>
        )   
            
        )}
    </div>)
}