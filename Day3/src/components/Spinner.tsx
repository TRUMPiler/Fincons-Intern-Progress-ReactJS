import myImage from '../assets/Material wave loading.gif'
function Spinner()
{
    return(
    <div className="flex bg-white justify-center items-center min-h-screen">
        <img src={myImage} alt="Hello" />
    </div>
    );
}
export default Spinner;