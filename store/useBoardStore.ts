import { Board, Column, Task } from "@/types/types";
import { create } from "zustand";
import { loadData, saveData } from "../services/storage";

type BoardState = {
  boards: Record<string, Board>;
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  selectedBoardId: string;
  searchQuery: string;
  boardsVersion: number; // Add version tracking

  //board actions
  addBoard: (board: Board) => void;
  updateBoard: (boardId: string, updates: Partial<Board>) => void
  deleteBoard: (boardId: string) => void
  setSelectedBoard: (boardId: string) => void;

  //task actions
  addTask: (task: Task) => void;
  moveTask: (taskId: string, newColumnId: string) => void;

  //search
  setSearchQuery: (query: string) =>void
  getFilteredBoards: () => Board[];

  //helpers
  getBoardTaskCount: (boardId: string) => number;
};

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: {},
  columns: {},
  tasks: {},
  selectedBoardId: "",
  searchQuery: "",
  boardsVersion: 0,

  addBoard: (board) =>
    set((state) => ({
      boards: { ...state.boards, [board.id]: board },
      boardsVersion: state.boardsVersion + 1,
    })),

  updateBoard: (boardId, updates) => {
    console.log('Store updateBoard called:', boardId, updates);
    set((State) => {
      const updatedBoards = {
        ...State.boards,
        [boardId]: {...State.boards[boardId], ...updates, updatedAt: new Date().toISOString() },
      };
      console.log('Updated boards:', Object.keys(updatedBoards));
      return { 
        boards: updatedBoards,
        boardsVersion: State.boardsVersion + 1,
      };
    });
  },
  
  deleteBoard: (boardId) => {
    console.log('Store deleteBoard called for boardId:', boardId);
    set((state) => {
      console.log('Current boards before delete:', Object.keys(state.boards));
      const {[boardId]: deletedBoard, ...remainingBoards } = state.boards;
      console.log('Deleted board:', deletedBoard);
      console.log('Remaining boards after delete:', Object.keys(remainingBoards));
      console.log('New boardsVersion:', state.boardsVersion + 1);
      return { 
        boards: remainingBoards,
        boardsVersion: state.boardsVersion + 1,
      };
    });
    console.log('Delete operation complete');
  },  

  setSelectedBoard: (boardId) =>
    set(() => ({
      selectedBoardId: boardId,
    })),

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

  setSearchQuery: (query) => 
    set(() => ({
      searchQuery: query,
    })),
  
  getFilteredBoards: () => {
    const state = get();
    const boardsArray = Object.values(state.boards);

    if (!state.searchQuery) {
      return boardsArray.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    
    return boardsArray 
      .filter((board) => 
        board.title.toLowerCase().includes(state.searchQuery.toLowerCase())
      )
      .sort((a, b) => 
         new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, 
    getBoardTaskCount: (boardId) => {
      const state = get();
      const board = state.boards[boardId];
      if(!board) return 0;

      let count = 0;
      board.columnIds.forEach((columnId) => {
        const column = state.columns[columnId];
        if (column) {
          count += column.taskIds.length
        }
      });
      return count;
    },  
    
  
}));

loadData().then((data) => {
  if (data) useBoardStore.setState(data);
});

import debounce from "lodash.debounce";

const persist = debounce((state: BoardState) => {
  saveData({
    boards: state.boards,
    columns: state.columns,
    tasks: state.tasks,
  });
}, 500);

useBoardStore.subscribe((state) => persist(state));
