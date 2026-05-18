import { Board } from "@/types/types";
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type BoardCardProps = {
    board: Board;
    onMenuPress: (board: Board) => void;
};


export default function BoardCard({ board, onMenuPress}: BoardCardProps) {
   const router = useRouter();
   
   return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/board/${board.id}`)}
      activeOpacity={0.7}
    >
        <View style={styles.content}>
            <View style={[styles.iconContainer, { backgroundColor: board.color}]}>
                <Text style={styles.icon}>{board.icon}</Text>
            </View>

            <View style={styles.info}>
                <Text style={styles.title}>{board.title}</Text>
                <Text style={styles.taskCount}>{board.taskCount}</Text>
                <Text style={styles.updated}>{board.updatedAt}</Text>
            </View>

            <Pressable
              style={styles.menuButton}
              onPress={(e) => {
                e?.stopPropagation?.();
                 onMenuPress(board)}}
              hitSlop={8}
            >
              <Ionicons name="ellipsis-vertical" size={20} color="#666"/>
            </Pressable>
        </View>
    </TouchableOpacity>
   )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
  },
  content: {

  },
  iconContainer: {

  },
  icon: {

  },
  info:{

  },
  title:{

  },
  taskCount: {

  },
  updated: {

  },
  menuButton: {

  },
})