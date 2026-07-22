import AddTaskModal from '@/components/AddTaskModal';
import Column from '@/components/Column';
import { useBoardStore } from '@/store/useBoardStore';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BoardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [addTaskModalVisible, setAddTaskModalVisible] = useState(false);
  const [selectedColumnId, setSelectedColumnId] = useState<string>('');
  
  const board = useBoardStore((state) => state.boards[id || '']);
  const columns = useBoardStore((state) => state.columns);

  if (!board) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Board not found</Text>
      </SafeAreaView>
    );
  }
  
  const boardColumns = board.columnIds
    .map((columnId) => columns[columnId])
    .filter(Boolean);

  const handleAddTask = (columnId: string) => {
    setSelectedColumnId(columnId);
    setAddTaskModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{board.title}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Team Members */}
      <View style={styles.teamSection}>
        <View style={styles.teamMembers}>
          {[1, 2, 3, 4, 5].map((member) => (
            <View key={member} style={styles.avatar}>
              <Ionicons name="person" size={16} color="#666" />
            </View>
          ))}
          <View style={styles.avatarMore}>
            <Text style={styles.avatarMoreText}>+3</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="funnel-outline" size={16} color="#7C3AED" />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      {/* Columns */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.columnsContainer}
        contentContainerStyle={styles.columnsContent}
      >
        {boardColumns.map((column) => (
          <Column
            key={column.id}
            columnId={column.id}
            title={column.title}
            color={column.color}
            boardId={id || ''}
            onAddTask={() => handleAddTask(column.id)}
          />
        ))}
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={() => handleAddTask('todo')}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Add Task Modal */}
      <AddTaskModal
        visible={addTaskModalVisible}
        columnId={selectedColumnId}
        boardId={id || ''}
        onClose={() => setAddTaskModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  teamSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  teamMembers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarMore: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  avatarMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#666',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7C3AED',
  },
  columnsContainer: {
    flex: 1,
  },
  columnsContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
