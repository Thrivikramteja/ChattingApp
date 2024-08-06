import { useNavigate } from "react-router-dom";
import Classes from "./chats.module.css";


function Chats() {
  const navigate = useNavigate();

  const CreateHandler = () => {
    navigate("/chats/create-room");
  };

  const JoinHandler = () => {
    navigate("/chats/join-room");
  };

  return (
    <div className={Classes.body}>
      <button onClick={CreateHandler}>Create a Chat Room</button>
      <button id={Classes.join} onClick={JoinHandler}>
        Join a Chat Room
      </button>
    </div>
  );
}

export default Chats;
