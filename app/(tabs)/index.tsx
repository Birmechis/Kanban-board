import BoardCard from '@/components/BoardCard';
import BoardMenuModal from '@/components/BoardMenuModal';
import CreateBoardModal from '@/components/CreateBoardModal';
import EditBoardModal from '@/components/EditBoardModal';
import { useBoardStore } from '@/store/useBoardStore';
import { Board } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  // Use selective subscriptions to ensure proper re-renders
  const allBoards = useBoardStore((state) => state.boards);
  const boardsVersion = useBoardStore((state) => state.boardsVersion);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);
  const addBoard = useBoardStore((state) => state.addBoard);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const getBoardTaskCount = useBoardStore((state) => state.getBoardTaskCount);
  
  console.log('Component render - boardsVersion:', boardsVersion, 'boards count:', Object.keys(allBoards).length);
  
  const boards = useMemo(() => {
    const boardsArray = Object.values(allBoards);
    console.log('===== useMemo recalculating =====');
    console.log('Boards count:', boardsArray.length);
    console.log('Boards version:', boardsVersion);
    console.log('Board IDs:', boardsArray.map(b => b.id));
    console.log('================================');
    
    if (!searchQuery) {
      return boardsArray.sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }
    
    return boardsArray
      .filter((board) => 
        board.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [allBoards, searchQuery, boardsVersion]);

  const handleCreateBoard = (title: string, icon: string, color: string) => {
    const newBoard: Board = {
      id: Date.now().toString(),
      title,
      icon,
      color,
      columnIds: [],
      taskCount: 0,
      updatedAt: new Date().toISOString(),
      description: '',
    };
    addBoard(newBoard);
  }

  const handleEditBoard = (board: Board) => {
    setSelectedBoard(board);
    setMenuModalVisible(false);
    setEditModalVisible(true);
  }

  const handleUpdateBoard = (boardId: string, title: string, icon: string, color: string) => {
    console.log('Updating board:', boardId, 'with title:', title);
    updateBoard(boardId, { title, icon, color });
    console.log('Board updated in store');
    setEditModalVisible(false); // Close modal after update
  }

  const handleDeleteBoard = (board: Board) => {
    console.log('handleDeleteBoard called for:', board.id, board.title);
    setMenuModalVisible(false);
    Alert.alert(
      'Delete Board',
      `Are you sure you want to delete "${board.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            console.log('Delete confirmed, calling deleteBoard');
            deleteBoard(board.id);
            console.log('deleteBoard completed');
          },
        },
      ]
    );
  };

  const handleMenuPress = (board: Board) => {
    setSelectedBoard(board);
    setMenuModalVisible(true);
  }

  return (
    <SafeAreaView style={styles.container}>
        {/*Header */}
        <View style={styles.header}>
            <Text style={styles.headerTitle}>My Boards</Text>
            <View style={styles.headerIcons}>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="notifications-outline" size={24} color="#000"/>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="person-circle-outline" size={28} color="#000"/>
                </TouchableOpacity>
            </View>
        </View>
        {/*Search Bar */}
        <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999"  style={styles.searchIcon}/>
            <TextInput
               style={styles.searchInput}
               placeholder='Search boards...'
               value={searchQuery}
               onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color="#999"/>
                </TouchableOpacity>
            )}
        </View>
        {/*Create new board button*/}
        <TouchableOpacity 
            style={styles.createButton}
            onPress={() => setCreateModalVisible(true)}
        >
            <Ionicons name='add' size={24} color="#fff"/>
            <Text style={styles.createButtonText}>Create New Board</Text>
        </TouchableOpacity>

        {/* Recent Boards Section*/}
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Boards</Text>

            {boards.length === 0 ? (
                <View style={styles.emptyState}>
                    <Ionicons name="folder-open-outline" size={64} color="#ccc" />
                    <Text style={styles.emptyStateText}>
                        {searchQuery ? 'Np boards found' : 'No boards yet'}
                    </Text>
                    <Text style={styles.emptyStateSubtext}>
                        {searchQuery
                          ? 'Try a different search term' 
                          : 'Create your first board to get started'
                        }
                    </Text>
                </View>
            ) : (
                <FlatList
                  data={boards}
                  keyExtractor={(item) => item.id}
                  renderItem={({item}) => (
                    <BoardCard
                      board={{
                        ...item,
                        taskCount: getBoardTaskCount(item.id)
                      }}
                      onMenuPress={handleMenuPress}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
            )}
        </View>

        {/*Modals*/}
        <CreateBoardModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
          onSave={handleCreateBoard}
        />

        <EditBoardModal
          visible={editModalVisible}
          board={selectedBoard}
          onClose={() => setEditModalVisible(false)}
          onSave={handleUpdateBoard}
        />

        <BoardMenuModal
          visible={menuModalVisible}
          board={selectedBoard}
          onClose={() => setMenuModalVisible(false)}
          onEdit={handleEditBoard}
          onDelete={handleDeleteBoard}
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9fafb'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000'
    },
    headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C3AED',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
})