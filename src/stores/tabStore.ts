import { create } from "zustand";

export type TabType =
  | "For You"
  | "Following"
  | "Trending"
  | "Latest"
  | "Most Liked"
  | "My Blogs";

type TabState = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  getActiveResolver: () => string;
};

const resolverMap: Record<TabType, string> = {
  "For You": "GET_FOR_YOU_BLOGS", 
  "Following": "followingBlogs",
  "Trending": "blogs",
  "Latest": "GET_BLOGS",
  "Most Liked": "blogs",
  "My Blogs": "blogsByGenres",
};

export const useTabStore = create<TabState>()((set, get) => ({
  activeTab: "For You",
  setActiveTab: (tab) => set({ activeTab: tab }),
  getActiveResolver: () => {
    const tab = get().activeTab;
    return resolverMap[tab];
  },
}));
