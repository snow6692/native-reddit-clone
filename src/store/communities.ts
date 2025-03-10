import { create } from "zustand";
import { Group } from "../lib/redditTypes";

type GroupState = {
  group: Group | null;
  setGroup: (community: Group | null) => void;
};

export const useSelectGroup = create<GroupState>((set) => ({
  group: null,
  setGroup: (group) => set({ group }),
}));
