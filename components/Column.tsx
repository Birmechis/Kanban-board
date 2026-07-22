import { useBoardStore } from '@/store/useBoardStore';
import { Task } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';

type ColumnProps = {
  columnId: string;
  title: string;
  color: string;
  boardId: string;
  onAddTask: () => void;
};

type TaskCardProps = {
  task: Task;
  drag?: () => void;
};

const TaskCard = ({ task, drag }: TaskCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.taskCard}
      onLongPress={drag}
      activeOpacity={0.8}
    >
      <View style={styles.taskHeader}>
        <Text style={styles.taskTitle}>{task.title}</Text>
      </View>
      
      {task.description && (
        <Text style={styles.taskDescription} numberOfLines={2}>
          {task.description}
        </Text>
      )}
      
      {task.tag && (
        <View style={[styles.tag, { backgroundColor: getTagColor(task.tag) }]}>
          <Text style={styles.tagText}>{task.tag}</Text>
        </View>
      )}
      
      <View style={styles.taskFooter}>
        <View style={styles.taskDate}>
          <Ionicons name="calendar-outline" size={14} color="#6B7280" />
          <Text style={styles.taskDateText}>
            {task.dueDate || 'No date'}
          </Text>
        </View>
        
        {task.assignee && (
          <View style={styles.taskAvatar}>
            <Ionicons name="person" size={12} color="#666" />
          </View>
        )}
      </View>
      
      {task.completed && (
        <View style={styles.completedBadge}>
          <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        </View>
      )}
    </TouchableOpacity>
  );
};

const getTagColor = (tag: string): string => {
  const colors: Record<string, string> = {
    Design: '#E9D5FF',
    Development: '#DBEAFE',
    Bug: '#FEE2E2',
    Task: '#E5E7EB',
  };
  return colors[tag] || '#E5E7EB';
};

export default function Column({ columnId, title, color, boardId, onAddTask }: ColumnProps) {
  const tasks = useBoardStore((state) => state.tasks);
  const moveTask = useBoardStore((state) => state.moveTask);

  const columnTasks = Object.values(tasks).filter((task) => task.columnId === columnId);

  const handleDragEnd = ({ data }: { data: Task[] }) => {
    // Update task order in the store if needed
    data.forEach((task, index) => {
      // You can add position tracking here if needed
    });
  };

  // For web, use ScrollView
  if (Platform.OS === 'web') {
    return (
      <View style={styles.column}>
        <View style={styles.columnHeader}>
          <View style={styles.columnTitleContainer}>
            <View style={[styles.colorDot, { backgroundColor: color }]} />
            <Text style={styles.columnTitle}>{title}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{columnTasks.length}</Text>
            </View>
          </View>
        </View>

        <ScrollView 
          style={styles.taskList}
          showsVerticalScrollIndicator={false}
        >
          {columnTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </ScrollView>

        <TouchableOpacity style={styles.addTaskButton} onPress={onAddTask}>
          <Ionicons name="add" size={20} color="#7C3AED" />
          <Text style={styles.addTaskText}>Add Task</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // For native platforms, use DraggableFlatList
  return (
    <View style={styles.column}>
      <View style={styles.columnHeader}>
        <View style={styles.columnTitleContainer}>
          <View style={[styles.colorDot, { backgroundColor: color }]} />
          <Text style={styles.columnTitle}>{title}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{columnTasks.length}</Text>
          </View>
        </View>
      </View>

      <DraggableFlatList
        data={columnTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item, drag }) => (
          <TaskCard task={item} drag={drag} />
        )}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.taskList}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.addTaskButton} onPress={onAddTask}>
        <Ionicons name="add" size={20} color="#7C3AED" />
        <Text style={styles.addTaskText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: 300,
    marginRight: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    maxHeight: '100%',
  },
  columnHeader: {
    marginBottom: 16,
  },
  columnTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  columnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  countBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  taskList: {
    paddingBottom: 8,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  taskHeader: {
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    lineHeight: 20,
  },
  taskDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  tag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  taskDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  addTaskButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    backgroundColor: '#fff',
  },
  addTaskText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
  },
});
