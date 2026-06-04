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

export const useChat = () =>
  useChatStore((state) => ({
    activeChat: state.activeChat,
    isSidebarOpen: state.isSidebarOpen,
    showUserList: state.showUserList,
    setActiveChat: state.setActiveChat,
    clearActiveChat: state.clearActiveChat,
    openSidebar: state.openSidebar,
    closeSidebar: state.closeSidebar,
    toggleSidebar: state.toggleSidebar,
    setShowUserList: state.setShowUserList,
    toggleShowUserList: state.toggleShowUserList,
    resetChatUi: state.resetChatUi,
  }));
