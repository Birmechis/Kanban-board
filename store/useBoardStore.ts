import { Column, Task } from "@/types/types";
import { saveData, loadData } from "../services/storage";
import { create } from "zustand";



type BoardState = {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  addTask: (task: Task) => void;
  moveTask: (taskId: string, newColumnId: string) => void;
};

export const useBoardStore = create<BoardState>((set) => ({
  columns: {},
  tasks: {},

  addTask: (task) =>
    set((state) => ({
      tasks: { ...state.tasks, [task.id]: task },
    })),

  moveTask: (taskId, newColumnId) =>
    set((state) => {
      const task = state.tasks[taskId];
      return {
        tasks: {
          ...state.tasks,
          [taskId]: { ...task, columnId: newColumnId },
        },
      };
    }),
}));

loadData().then((data) => {
    if(data) useBoardStore.setState(data)
});

import debounce from "lodash.debounce";

const persist = debounce((state: BoardState) => {
  saveData({ columns: state.columns, tasks: state.tasks });
}, 500);

useBoardStore.subscribe((state) => persist(state));