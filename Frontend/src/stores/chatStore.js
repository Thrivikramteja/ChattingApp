import { create } from "zustand";

const useChatStore = create((set, get) => ({
  rooms: [],
  activeRoomId: null,
  messages: {},
  typingUsers: {},
  onlineUsers: {},
  isLoadingRooms: false,
  isLoadingMessages: false,

  setRooms: (rooms) => set({ rooms }),

  setActiveRoom: (roomId) => set({ activeRoomId: roomId }),

  addRoom: (room) =>
    set((state) => ({
      rooms: [room, ...state.rooms.filter((r) => r.roomId !== room.roomId)],
    })),

  setMessages: (roomId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [roomId]: messages },
    })),

  prependMessages: (roomId, olderMessages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...olderMessages, ...(state.messages[roomId] || [])],
      },
    })),

  addMessage: (roomId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: [...(state.messages[roomId] || []), message],
      },
    })),

  updateMessageStatus: (roomId, messageId, status) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [roomId]: (state.messages[roomId] || []).map((m) =>
          m._id === messageId ? { ...m, status } : m
        ),
      },
    })),

  setTypingUsers: (roomId, users) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [roomId]: users },
    })),

  setOnlineUsers: (users) => set({ onlineUsers: users }),

  setUserOnline: (userId, username) =>
    set((state) => ({
      onlineUsers: { ...state.onlineUsers, [userId]: username },
    })),

  setUserOffline: (userId) =>
    set((state) => {
      const onlineUsers = { ...state.onlineUsers };
      delete onlineUsers[userId];
      return { onlineUsers };
    }),

  updateRoomUnread: (roomId, count) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.roomId === roomId ? { ...r, unreadCount: count } : r
      ),
    })),

  incrementRoomUnread: (roomId) =>
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.roomId === roomId
          ? { ...r, unreadCount: (r.unreadCount || 0) + 1 }
          : r
      ),
    })),

  setLoadingRooms: (isLoadingRooms) => set({ isLoadingRooms }),
  setLoadingMessages: (isLoadingMessages) => set({ isLoadingMessages }),

  getActiveRoom: () => {
    const { rooms, activeRoomId } = get();
    return rooms.find((r) => r.roomId === activeRoomId);
  },
}));

export default useChatStore;
