import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type CreateBoardModalProps = {
    visible: boolean;
    onClose: () => void;
    onSave: (title: string, icon: string, color: string) => void
}

export default function CreateBoardModal({ visible, onClose, onSave}: CreateBoardModalProps) {
    const[title, setTitle] = useState('')
    const[selectedIcon, setSelectedIcon] = useState('📋')
    const [selectedColor, setSelectedColor] = useState('#7C3AED');

    const handelSave = () => {
        if(title.trim()) {
            onSave(title.trim(), selectedIcon, selectedColor);
            setTitle('');
            setSelectedIcon('📋');
            setSelectedColor('#7C3AED');
            onClose();
        }
    }

    const handleCancel = () => {
     setTitle('');
     setSelectedIcon('📋');
     setSelectedColor('#7C3AED');
     onClose();
    };

    return (
        <Modal
          visible={visible}
          transparent
          animationType='slide'
          onRequestClose={onClose}
        >
          <Pressable style={styles.overlay} onPress={handleCancel}>
             <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
                 <View style={styles.header}>
                    <Text style={styles.headerTitle}>Create New Board</Text>
                    <TouchableOpacity onPress={handleCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                        <Ionicons name='close' size={24} color="#666"/>
                    </TouchableOpacity>
                 </View>

                 <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <Text style={styles.label}>Board Name</Text>
                    <TextInput
                      style={styles.input}
                      placeholder='Enter board name'
                      value={title}
                      onChangeText={setTitle}
                      autoFocus
                    />
                    
                 </ScrollView>

                 <View style={styles.footer}>
                    <TouchableOpacity
                      style={[styles.button, styles.cancelButton]}
                      onPress={handleCancel}
                    >
                      <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                       style={[styles.button, styles.saveButton, !title.trim() && styles.saveButtonDisabled]}
                       onPress={handelSave}
                       disabled={!title.trim()}
                    >
                      <Text style={styles.saveButtonText}>Create Board</Text>
                    </TouchableOpacity>
                 </View>
             </Pressable>
          </Pressable>   
        </Modal>
    )
}


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  content: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 12,
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  iconOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#F3E8FF',
  },
  iconText: {
    fontSize: 28,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  colorOption: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#000',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  saveButton: {
    backgroundColor: '#7C3AED',
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
