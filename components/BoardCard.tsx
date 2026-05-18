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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    fontSize: 24,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  taskCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  updated: {
    fontSize: 12,
    color: '#999',
  },
  menuButton: {
    padding: 4,
  },
});