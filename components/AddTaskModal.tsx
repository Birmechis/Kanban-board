import { useBoardStore } from "@/store/useBoardStore";
import { Task } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

type AddTaskModalProps = {
  visible: boolean;
  columnId: string;
  boardId: string;
  onClose: () => void;
};

export default function AddTaskModal({ 
  visible, 
  columnId, 
  boardId, 
  onClose 
}: AddTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState(columnId);
  const [selectedLabel, setSelectedLabel] = useState<Task['tag']>('Design');
  const [dueDate, setDueDate] = useState("May 27, 2024");
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  
  const addTask = useBoardStore((s) => s.addTask);

  const columns = [
    { id: 'todo', title: 'To Do', icon: '●', color: '#3B82F6' },
    { id: 'progress', title: 'In Progress', icon: '●', color: '#F59E0B' },
    { id: 'done', title: 'Done', icon: '●', color: '#10B981' },
  ];

  const labels: Array<Task['tag']> = ['Design', 'Development', 'Bug', 'Task'];
  
  const labelColors: Record<string, string> = {
    Design: '#A855F7',
    Development: '#3B82F6',
    Bug: '#EF4444',
    Task: '#6B7280',
  };

  const handleSave = () => {
    if (title.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        columnId: selectedColumn,
        boardId,
        description: description.trim() || undefined,
        tag: selectedLabel,
        dueDate,
        priority,
        createdAt: new Date().toISOString(),
      };
      addTask(newTask);
      
      // Reset form
      setTitle("");
      setDescription("");
      setSelectedColumn(columnId);
      setSelectedLabel('Design');
      setDueDate("May 27, 2024");
      setPriority('Medium');
      onClose();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            // Reset and close
            setTitle("");
            setDescription("");
            onClose();
          }
        },
      ]
    );
  };

  const selectedColumnData = columns.find(col => col.id === selectedColumn);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Task</Text>
          <TouchableOpacity onPress={handleSave}>
            <Text style={styles.saveText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.section}>
            <Text style={styles.label}>Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="Design onboarding screen"
              placeholderTextColor="#9CA3AF"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Create a beautiful onboarding experience for new users."
              placeholderTextColor="#9CA3AF"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Column Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>Column</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowColumnPicker(!showColumnPicker)}
            >
              <View style={styles.selectorLeft}>
                <View style={[styles.colorDot, { backgroundColor: selectedColumnData?.color }]} />
                <Text style={styles.selectorText}>{selectedColumnData?.title}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            {showColumnPicker && (
              <View style={styles.pickerContainer}>
                {columns.map((column) => (
                  <TouchableOpacity
                    key={column.id}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedColumn(column.id);
                      setShowColumnPicker(false);
                    }}
                  >
                    <View style={[styles.colorDot, { backgroundColor: column.color }]} />
                    <Text style={styles.pickerText}>{column.title}</Text>
                    {selectedColumn === column.id && (
                      <Ionicons name="checkmark" size={20} color="#7C3AED" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Label Selector */}
          <View style={styles.section}>
            <Text style={styles.label}>Label</Text>
            <TouchableOpacity 
              style={styles.selector}
              onPress={() => setShowLabelPicker(!showLabelPicker)}
            >
              <View style={styles.selectorLeft}>
                <View style={[styles.colorDot, { backgroundColor: selectedLabel ? labelColors[selectedLabel] : '#6B7280' }]} />
                <Text style={styles.selectorText}>{selectedLabel || 'Select Label'}</Text>
              </View>
              <Ionicons name="chevron-down" size={20} color="#6B7280" />
            </TouchableOpacity>
            
            {showLabelPicker && (
              <View style={styles.pickerContainer}>
                {labels.map((label) => (
                  <TouchableOpacity
                    key={label}
                    style={styles.pickerItem}
                    onPress={() => {
                      setSelectedLabel(label);
                      setShowLabelPicker(false);
                    }}
                  >
                    <View style={[styles.colorDot, { backgroundColor: label ? labelColors[label] : '#6B7280' }]} />
                    <Text style={styles.pickerText}>{label}</Text>
                    {selectedLabel === label && (
                      <Ionicons name="checkmark" size={20} color="#7C3AED" style={{ marginLeft: 'auto' }} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Due Date */}
          <View style={styles.section}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.dateSelector}>
              <View style={styles.selectorLeft}>
                <Ionicons name="calendar-outline" size={20} color="#6B7280" />
                <Text style={styles.selectorText}>{dueDate}</Text>
              </View>
              <TouchableOpacity>
                <Ionicons name="close-circle" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Assignees */}
          <View style={styles.section}>
            <Text style={styles.label}>Assignees</Text>
            <View style={styles.assigneeContainer}>
              <View style={styles.avatarList}>
                {[1, 2, 3].map((i) => (
                  <View key={i} style={styles.avatar}>
                    <Ionicons name="person" size={16} color="#6B7280" />
                  </View>
                ))}
                <TouchableOpacity style={styles.addAvatar}>
                  <Ionicons name="add" size={18} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Priority */}
          <View style={styles.section}>
            <Text style={styles.label}>Priority</Text>
            <View style={styles.priorityContainer}>
              {(['Low', 'Medium', 'High'] as const).map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.priorityButtonActive,
                    level === 'Medium' && priority === 'Medium' && styles.priorityMedium,
                  ]}
                  onPress={() => setPriority(level)}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === level && styles.priorityTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Attachments */}
          <View style={styles.section}>
            <Text style={styles.label}>Attachments</Text>
            <TouchableOpacity style={styles.attachmentButton}>
              <Ionicons name="attach-outline" size={20} color="#6B7280" />
              <Text style={styles.attachmentText}>Add attachment</Text>
            </TouchableOpacity>
          </View>

          {/* Save Task Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Task</Text>
          </TouchableOpacity>

          {/* Delete Task Button */}
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Task</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: {
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#7C3AED',
    width: 40,
    textAlign: 'right',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#F9FAFB',
  },
  selectorLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  selectorText: {
    fontSize: 15,
    color: '#111827',
  },
  pickerContainer: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  pickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  pickerText: {
    fontSize: 15,
    color: '#111827',
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#F9FAFB',
  },
  assigneeContainer: {
    paddingVertical: 8,
  },
  avatarList: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
  },
  priorityContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityButtonActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  priorityMedium: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE047',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  priorityTextActive: {
    color: '#111827',
  },
  attachmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#F9FAFB',
  },
  attachmentText: {
    fontSize: 15,
    color: '#6B7280',
  },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    marginTop: 16,
    marginBottom: 32,
    paddingVertical: 16,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
});
