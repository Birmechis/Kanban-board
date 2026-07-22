import { Board } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type EditBoardModalProps = {
    visible: boolean;
    board: Board | null;
    onClose: () => void;
    onSave: (boardId: string, title: string, icon: string, color: string) => void;
}

export default function EditBoardModal({ visible, board, onClose, onSave }: EditBoardModalProps) {
    const [title, setTitle] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('📋');
    const [selectedColor, setSelectedColor] = useState('#7C3AED');

    // Update form when board changes
    useEffect(() => {
        if (board) {
            setTitle(board.title);
            setSelectedIcon(board.icon);
            setSelectedColor(board.color);
        }
    }, [board]);

    const handleSave = () => {
        console.log('EditBoardModal handleSave called');
        console.log('Title:', title, 'Board:', board?.id);
        if (title.trim() && board) {
            console.log('Calling onSave with:', board.id, title.trim());
            onSave(board.id, title.trim(), selectedIcon, selectedColor);
            console.log('onSave completed');
        } else {
            console.log('Validation failed - title or board missing');
        }
    };

    const handleCancel = () => {
        console.log('EditBoardModal handleCancel called');
        onClose();
    };

    if (!board) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType='slide'
            onRequestClose={handleCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Edit Board</Text>
                        <TouchableOpacity onPress={handleCancel} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                            <Ionicons name='close' size={24} color="#666" />
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
                            onPress={handleSave}
                            disabled={!title.trim()}
                        >
                            <Text style={styles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
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
