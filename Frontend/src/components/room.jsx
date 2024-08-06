import Classes from "./room.module.css";
import { useEffect, useState, useContext, useRef } from "react";
import { RoomContext } from "./RoomContext";
import socket from "./socket";

function Room() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  const { roomData, setRoomData } = useContext(RoomContext);
  const messagesEndRef = useRef(null);

  const fetchRoomData = async () => {
    try {
      const response = await fetch("http://localhost:8000/roomExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ roomId: roomData.roomId }),
      });

      const data = await response.json();
      setRoomData((prevData) => ({
        ...prevData,
        roomName: data.roomName,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoomData();
  }, []);

  const sendMessage = async () => {
    if (message !== "") {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, "0");
      const minutes = now.getMinutes().toString().padStart(2, "0");

      const messageData = {
        room: roomData.roomId,
        roomName: roomData.roomName,
        message: message,
        author: roomData.username,
        time: hours + ":" + minutes,
      };

      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      scrollToBottom();
      setMessage("");
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messageList]);

  return (
    <>
      <div className={Classes.chatInterface}>
        <div className={Classes.header}>
          <p>Room: {roomData.roomName}</p>
        </div>

        <div className={Classes.body}>
          {messageList.map((messageContent, index) => (
            <div
              key={index}
              className={Classes.message}
              style={{
                alignSelf:
                  roomData.username === messageContent.author
                    ? "flex-end"
                    : "flex-start",
              }}
            >
              <div className={Classes.message_content}>
                <p
                  style={{
                    backgroundColor:
                      roomData.username === messageContent.author
                        ? "#e3d5bc"
                        : "#edcc92",
                  }}
                >
                  {messageContent.message}
                </p>
              </div>
              <div className={Classes.message_meta}>
                <p>{messageContent.time}</p>
                {roomData.username === messageContent.author ? (
                  <p>you</p>
                ) : (
                  <p>{messageContent.author}</p>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className={Classes.textbar}>
          <input
            type="text"
            placeholder="Type a Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(event) => {
              event.key === "Enter" && sendMessage();
            }}
          />
          <button onClick={sendMessage}>&#9658;</button>
        </div>
      </div>
    </>
  );
}

export default Room;
