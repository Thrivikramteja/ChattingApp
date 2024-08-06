import Classes from "./login.module.css";
import CreateRoomModal from "./createRoomModal";
import { useNavigate } from "react-router-dom";
import { RoomContext } from "./RoomContext";
import { useContext, useState } from "react";
import socket from "./socket";

function CreateRoom() {
  const navigate = useNavigate();
  const [warning, setWarning] = useState(false);
  const { roomData, setRoomData } = useContext(RoomContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:8000/roomid", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roomData),
      });

      if (response.status === 400) {
        setWarning(true);
        return;
      }
      if (response.ok) {
        navigate("/room");
      }
    } catch (error) {
      console.error(error);
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
    <>
      <CreateRoomModal>
        <form className={Classes.form} onSubmit={handleSubmit}>
          {warning && (
            <p className={Classes.wrngCrd}>Room Id already exists!</p>
          )}
          <label htmlFor="username">Author Name</label>
          <input
            name="username"
            id="username"
            onChange={handleChange}
            required
          />
          <label htmlFor="roomName">Room Name</label>
          <input
            name="roomName"
            id="roomName"
            onChange={handleChange}
            required
          />
          <label htmlFor="roomId">Create a Room Id</label>
          <input name="roomId" id="roomId" onChange={handleChange} required />
          <button type="submit">Create Room</button>
        </form>
      </CreateRoomModal>
    </>
  );
}

export default CreateRoom;
