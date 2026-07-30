import { useBoardStore } from "@/store/useBoardStore";
import { Task } from "@/types/types";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
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

type EditTaskModalProps = {
  visible: boolean;
  task: Task | null;
  onClose: () => void;
};

export default function EditTaskModal({ 
  visible, 
  task,
  onClose 
}: EditTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<Task['tag']>('Design');
  const [dueDate, setDueDate] = useState("May 27, 2024");
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [showColumnPicker, setShowColumnPicker] = useState(false);
  const [showLabelPicker, setShowLabelPicker] = useState(false);
  
  const updateTask = useBoardStore((s) => s.updateTask);
  const deleteTask = useBoardStore((s) => s.deleteTask);
  const columns = useBoardStore((s) => s.columns);
  const boards = useBoardStore((s) => s.boards);

  // Populate form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setSelectedColumn(task.columnId);
      setSelectedLabel(task.tag || 'Design');
      setDueDate(task.dueDate || "May 27, 2024");
      setPriority(task.priority || 'Medium');
    }
  }, [task]);

  const boardColumns = task ? Object.values(columns).filter(col => col.boardId === task.boardId) : [];

  const labels: Array<Task['tag']> = ['Design', 'Development', 'Bug', 'Task'];
  
  const labelColors: Record<string, string> = {
    Design: '#A855F7',
    Development: '#3B82F6',
    Bug: '#EF4444',
    Task: '#6B7280',
  };

  const handleSave = () => {
    if (task && title.trim()) {
      updateTask(task.id, {
        title: title.trim(),
        columnId: selectedColumn,
        description: description.trim() || undefined,
        tag: selectedLabel,
        dueDate,
        priority,
      });
      onClose();
    }
  };

  const handleDelete = () => {
    if (!task) return;
    
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            deleteTask(task.id);
            onClose();
          }
        },
      ]
    );
  };

  if (!task) return null;

  const selectedColumnData = boardColumns.find(col => col.id === selectedColumn);

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
          <Text style={styles.headerTitle}>Edit Task</Text>
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
                {boardColumns.map((column) => (
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

          {/* Save Task Button */}
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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

// (Same styles as AddTaskModal)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  closeButton: { width: 40 },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#111827' },
  saveText: { fontSize: 16, fontWeight: '600', color: '#7C3AED', width: 40, textAlign: 'right' },
  content: { flex: 1, paddingHorizontal: 20 },
  section: { marginTop: 24 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    color: '#111827',
    backgroundColor: '#F9FAFB',
  },
  textArea: { height: 80, textAlignVertical: 'top' },
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
  selectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  colorDot: { width: 10, height: 10, borderRadius: 5 },
  selectorText: { fontSize: 15, color: '#111827' },
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
  pickerText: { fontSize: 15, color: '#111827' },
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
  priorityContainer: { flexDirection: 'row', gap: 12 },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  priorityButtonActive: { backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' },
  priorityMedium: { backgroundColor: '#FEF3C7', borderColor: '#FDE047' },
  priorityText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  priorityTextActive: { color: '#111827' },
  saveButton: {
    marginTop: 32,
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  deleteButton: { marginTop: 16, marginBottom: 32, paddingVertical: 16, alignItems: 'center' },
  deleteButtonText: { fontSize: 16, fontWeight: '600', color: '#EF4444' },
});
