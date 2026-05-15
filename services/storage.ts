import AsyncStorage from "@react-native-async-storage/async-storage";
import { Column, Task } from "../types/types";

type BoardState = {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
};

const STORAGE_KEY = "board";

export const saveData = async (data: BoardState): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const loadData = async (): Promise<BoardState | null> => {
  if (typeof window === "undefined") {
    return null;
  }
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return data ? (JSON.parse(data) as BoardState) : null;
};
