import BoardCard from '@/components/BoardCard';
import { useBoardStore } from '@/store/useBoardStore';
import { Board } from '@/types/types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
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
  const [menuModalVisible, setMenuModalVisible] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState<Board | null>(null);

  const {
    addBoard,
    deleteBoard,
    searchQuery,
    setSearchQuery,
    getFilteredBoards,
    getBoardTaskCount,
  } = useBoardStore();
  
  const boards = getFilteredBoards();

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
        <TouchableOpacity style={styles.createButton}>
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
                      onMenuPress={(board) => {
                        console.log('Menu pressed:', board.id)
                      }}
                    />
                  )}
                  contentContainerStyle={styles.listContent}
                  showsVerticalScrollIndicator={false}
                />
            )}
        </View>
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