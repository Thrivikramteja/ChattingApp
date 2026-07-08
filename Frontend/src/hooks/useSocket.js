import { useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";
import useAuthStore from "../stores/authStore";
import useChatStore from "../stores/chatStore";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

let socketInstance = null;

function getSocket(token) {
  if (!socketInstance || socketInstance.disconnected) {
    socketInstance = io(SOCKET_URL, {
      auth: { token },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

export function useSocket() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const socketRef = useRef(null);
  const {
    addMessage,
    updateMessageStatus,
    setTypingUsers,
    setUserOnline,
    setUserOffline,
    incrementRoomUnread,
    activeRoomId,
  } = useChatStore();

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);
    socketRef.current = socket;

    socket.on("receive_message", (message) => {
      addMessage(message.roomId, message);
      if (message.roomId !== activeRoomId) {
        incrementRoomUnread(message.roomId);
      }
    });

    socket.on("message_status_update", ({ messageId, status }) => {
      const roomId = useChatStore.getState().activeRoomId;
      if (roomId) {
        updateMessageStatus(roomId, messageId, status);
      }
    });

    socket.on("typing_update", ({ roomId, typingUsers }) => {
      setTypingUsers(roomId, typingUsers);
    });

    socket.on("user_online", ({ userId, username }) => {
      setUserOnline(userId, username);
    });

    socket.on("user_offline", ({ userId }) => {
      setUserOffline(userId);
    });

    const heartbeat = setInterval(() => {
      socket.emit("heartbeat");
    }, 30000);

    return () => {
      clearInterval(heartbeat);
      socket.off("receive_message");
      socket.off("message_status_update");
      socket.off("typing_update");
      socket.off("user_online");
      socket.off("user_offline");
    };
  }, [
    token,
    activeRoomId,
    addMessage,
    updateMessageStatus,
    setTypingUsers,
    setUserOnline,
    setUserOffline,
    incrementRoomUnread,
  ]);

  const joinRoom = useCallback((roomId) => {
    socketRef.current?.emit("join_room", roomId);
  }, []);

  const leaveRoom = useCallback((roomId) => {
    socketRef.current?.emit("leave_room", roomId);
  }, []);

  const sendMessage = useCallback(
    (roomId, content) => {
      if (!user) return;
      socketRef.current?.emit("send_message", { roomId, content });
    },
    [user]
  );

  const startTyping = useCallback((roomId) => {
    socketRef.current?.emit("typing_start", { roomId });
  }, []);

  const stopTyping = useCallback((roomId) => {
    socketRef.current?.emit("typing_stop", { roomId });
  }, []);

  const markMessageRead = useCallback((roomId, messageId) => {
    socketRef.current?.emit("message_read", { roomId, messageId });
  }, []);

  return {
    socket: socketRef.current,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    markMessageRead,
    isConnected: !!socketRef.current?.connected,
  };
}

export default useSocket;
