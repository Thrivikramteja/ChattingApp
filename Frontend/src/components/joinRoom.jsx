import Classes from "./login.module.css";
import JoinRoomModal from "./joinRoomModal";
import { useNavigate } from "react-router-dom";
import { RoomContext } from "./RoomContext";
import { useState, useContext } from "react";
import socket from "./socket";

function JoinRoom() {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const { roomData, setRoomData } = useContext(RoomContext);

  const joinRoom = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/roomExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomData.roomId }),
      });

      if (response.status === 404) {
        setWarning(true);
        return;
      }
      if (response.ok) {
        navigate("/room");
      }
    } catch (error) {
      console.log(error);
    }
    if (roomData.username !== "" && roomData.roomId !== "") {
      socket.emit("join_room", roomData.roomId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return (
    <JoinRoomModal>
      <form className={Classes.form} onSubmit={joinRoom}>
        {warning && <p className={Classes.wrngCrd}>Room does not exist!</p>}
        <label htmlFor="username">Name</label>
        <input name="username" id="username" onChange={handleChange} required />
        <label htmlFor="roomId">Room Id</label>
        <input name="roomId" id="roomId" onChange={handleChange} required />
        <button type="submit">Join Room</button>
      </form>
    </JoinRoomModal>
  );
}

export default JoinRoom;
