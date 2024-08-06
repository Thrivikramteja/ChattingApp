import { createContext, useState } from "react";

const RoomContext = createContext();

const RoomProvider = ({ children }) => {
  const [roomData, setRoomData] = useState({
    roomName: "",
    roomId: "",
    username: "",
  });

  return (
    <RoomContext.Provider value={{ roomData, setRoomData }}>
      {children}
    </RoomContext.Provider>
  );
};

export { RoomProvider, RoomContext };
