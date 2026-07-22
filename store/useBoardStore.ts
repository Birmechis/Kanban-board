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
  
  //column actions
  addColumn: (column: Column) => void;
  updateColumn: (columnId: string, updates: Partial<Column>) => void;
  deleteColumn: (columnId: string) => void;

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
  set((state) => {
    // Create default columns
    const todoId = `${board.id}-To do`;
    const doingId = `${board.id}-In Progress`;
    const doneId = `${board.id}-Done`;

    return {
      boards: {
        ...state.boards,
        [board.id]: {
          ...board,
          columnIds: [todoId, doingId, doneId],
        },
      },

      columns: {
        ...state.columns,

        [todoId]: {
          id: todoId,
          boardId: board.id,
          title: "To Do",
          taskIds: [],
          color: "#3b82f6"
        },

        [doingId]: {
          id: doingId,
          boardId: board.id,
          title: "In Progress",
          taskIds: [],
          color: '#F59E0B'
        },

        [doneId]: {
          id: doneId,
          boardId: board.id,
          title: "Done",
          taskIds: [],
          color: '#10B981'
        },
      },

      boardsVersion: state.boardsVersion + 1,
    };
  }),

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

// =========================
// Column Actions
// =========================

addColumn: (column) =>
  set((state) => ({
    columns: {
      ...state.columns,
      [column.id]: column,
    },

    boards: {
      ...state.boards,
      [column.boardId]: {
        ...state.boards[column.boardId],
        columnIds: [
          ...state.boards[column.boardId].columnIds,
          column.id,
        ],
        updatedAt: new Date().toISOString(),
      },
    },

    boardsVersion: state.boardsVersion + 1,
  })),

updateColumn: (columnId, updates) =>
  set((state) => ({
    columns: {
      ...state.columns,
      [columnId]: {
        ...state.columns[columnId],
        ...updates,
      },
    },
  })),

deleteColumn: (columnId) =>
  set((state) => {
    const column = state.columns[columnId];

    if (!column) return {};

    // Remove the column
    const { [columnId]: deletedColumn, ...remainingColumns } =
      state.columns;

    // Remove the column id from its board
    const board = state.boards[column.boardId];

    return {
      columns: remainingColumns,

      boards: {
        ...state.boards,
        [column.boardId]: {
          ...board,
          columnIds: board.columnIds.filter(
            (id) => id !== columnId
          ),
          updatedAt: new Date().toISOString(),
        },
      },

      boardsVersion: state.boardsVersion + 1,
    };
  }),

addTask: (task) =>
  set((state) => {
    const column = state.columns[task.columnId];
    if (!column) return state;
    
    return {
      tasks: { ...state.tasks, [task.id]: task },
      columns: {
        ...state.columns,
        [task.columnId]: {
          ...column,
          taskIds: [...column.taskIds, task.id]  // ADD THIS
        }
      },
      boards: {
        ...state.boards,
        [task.boardId]: {
          ...state.boards[task.boardId],
          updatedAt: new Date().toISOString()  // AND THIS
        }
      }
    };
  }),


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
