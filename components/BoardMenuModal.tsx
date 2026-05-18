import { Board } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import {
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type BoardMenuModalProps = {
  visible: boolean;
  board: Board | null;
  onClose: () => void;
  onEdit: (board: Board) => void;
  onDelete: (board: Board) => void;
};

export default function BoardMenuModal({
    visible,
    board,
    onClose,
    onEdit,
    onDelete,
}: BoardMenuModalProps) {
 if (!board) return null;

 return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.menu}>
            <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                    onEdit(board);
                    onClose();
                }}
            >
                <Ionicons name='create-outline' size={22} color='#000'/>
                <Text style={styles.menuText}>Edit Board</Text>
            </TouchableOpacity>

            <View style={styles.divider}/>

            <TouchableOpacity
               style={styles.menuItem}
               onPress={() => {
                onDelete(board);
                onClose();
               }}
            >
                <Ionicons name='trash-outline' size={22} close='#ef4444'/>
                <Text style={[styles.menuText, styles.deleteText]}>Delete Board</Text>
            </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
 )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    maxWidth: 300,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#000',
  },
  deleteText: {
    color: '#EF4444',
  },
  divider: {
    height: 1,
    backgroundColor: '#f0f0f0',
  },
});