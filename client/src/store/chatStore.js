import { create } from "zustand";

const useChatStore = create((set) => ({
  activeChat: null,
  isSidebarOpen: true,
  showUserList: false,

  setActiveChat: (chat) =>
    set({
      activeChat: chat,
      isSidebarOpen: false,
    }),
  clearActiveChat: () => set({ activeChat: null }),
  openSidebar: () => set({ isSidebarOpen: true }),
  closeSidebar: () => set({ isSidebarOpen: false }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setShowUserList: (showUserList) => set({ showUserList }),
  toggleShowUserList: () =>
    set((state) => ({ showUserList: !state.showUserList })),
  resetChatUi: () =>
    set({
      activeChat: null,
      isSidebarOpen: true,
      showUserList: false,
    }),
}));

export default useChatStore;

export const useChat = () => {
  const activeChat = useChatStore((state) => state.activeChat);
  const isSidebarOpen = useChatStore((state) => state.isSidebarOpen);
  const showUserList = useChatStore((state) => state.showUserList);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const clearActiveChat = useChatStore((state) => state.clearActiveChat);
  const openSidebar = useChatStore((state) => state.openSidebar);
  const closeSidebar = useChatStore((state) => state.closeSidebar);
  const toggleSidebar = useChatStore((state) => state.toggleSidebar);
  const setShowUserList = useChatStore((state) => state.setShowUserList);
  const toggleShowUserList = useChatStore((state) => state.toggleShowUserList);
  const resetChatUi = useChatStore((state) => state.resetChatUi);

  return {
    activeChat,
    isSidebarOpen,
    showUserList,
    setActiveChat,
    clearActiveChat,
    openSidebar,
    closeSidebar,
    toggleSidebar,
    setShowUserList,
    toggleShowUserList,
    resetChatUi,
  };
};

