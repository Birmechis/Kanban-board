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
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
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
    const board = state.boards[boardId];
    if (!board) return state;

    // Step 1: Get all column IDs for this board
    const columnIdsToDelete = board.columnIds;
    
    // Step 2: Get all task IDs from those columns
    const taskIdsToDelete: string[] = [];
    columnIdsToDelete.forEach((columnId) => {
      const column = state.columns[columnId];
      if (column) {
        taskIdsToDelete.push(...column.taskIds);
      }
    });

    // Step 3: Remove the board
    const {[boardId]: deletedBoard, ...remainingBoards } = state.boards;

    // Step 4: Remove all columns belonging to this board
    const remainingColumns = { ...state.columns };
    columnIdsToDelete.forEach((columnId) => {
      delete remainingColumns[columnId];
    });

    // Step 5: Remove all tasks belonging to those columns
    const remainingTasks = { ...state.tasks };
    taskIdsToDelete.forEach((taskId) => {
      delete remainingTasks[taskId];
    });

    console.log('Deleted:', {
      board: boardId,
      columns: columnIdsToDelete.length,
      tasks: taskIdsToDelete.length
    });

    return { 
      boards: remainingBoards,
      columns: remainingColumns,
      tasks: remainingTasks,
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
 
 updateTask: (taskId, updates) =>
  set((state) => {
    const task = state.tasks[taskId]
    if (!task)  return state

    return {
      tasks: {
        ...state.tasks,
        [taskId]: { ...task, ...updates }
      },
      boards: {
        ...state.boards,
        [task.boardId]: {
          ...state.boards[task.boardId],
          updatedAt: new Date().toISOString()
        }
      }
    }
  }),

  deleteTask: (taskId) => 
    set((state) => {
      const task = state.tasks[taskId]
      if(!task) return state;

      const { [taskId]: deletedTask, ...remainingTasks } = state.tasks

      const column = state.columns[task.columnId]
      const updatedColumn = {
        ...column,
        taskId: column.taskIds.filter(id => id !== taskId)
      }

      return {
        tasks: remainingTasks,
        columns: {
          ...state.columns,
          [task.columnId]: updatedColumn
        },
        boards: {
          ...state.boards,
          [task.boardId]: {
            ...state.boards[task.boardId],
            updatedAt:new Date().toISOString()
          }
        }
      }
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
