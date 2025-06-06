import { create } from "zustand";

export type TabType =
  | "Latest"
  | "For You"
  | "Following"
  | "Trending"
  | "Most Liked"
  | "My Blogs";

export const tabs: TabType[] = [
  "Latest",
  "For You",
  "Following",
  "Trending",
  "Most Liked",
  "My Blogs",
];

type TabState = {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
};

export const useTabStore = create<TabState>()((set) => ({
  activeTab: "Latest",
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
