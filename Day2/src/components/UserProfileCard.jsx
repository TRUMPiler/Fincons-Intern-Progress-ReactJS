const UserProfileCard=({name,img,role})=>
{
    return(<>
        <h1>User Profile</h1>
        <p>Name:{name}</p>
        <img src={img}/>
        <p>role:{role}</p>
    </>);
}
export default UserProfileCard;