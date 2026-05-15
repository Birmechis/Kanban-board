import { useBoardStore } from "@/store/useBoardStore";
import { Platform, Text, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";

export default function Column({columnId}: any) {
    const { tasks } = useBoardStore()

    const columnTasks = Object.values(tasks).filter((t) => t.columnId === columnId)

    // For web, use a simple FlatList without drag functionality
    if (Platform.OS === 'web') {
        return (
            <View style={{ width: 250, margin: 10}}>
                <Text>{columnId}</Text>
                {columnTasks.map((item) => (
                    <Text key={item.id}>{item.title}</Text>
                ))}
            </View>
        )
    }

    // For native platforms, use DraggableFlatList
    return (
        <View style={{ width: 250, margin: 10}}>
            <Text>{columnId}</Text>
            
            <DraggableFlatList
                data={columnTasks}
                keyExtractor={(item) => item.id}
                renderItem={({ item, drag}) => (
                    <Text onLongPress={drag}>{item.title}</Text>
                )}
                onDragEnd={({ data }) => {}}
            />
        </View>
    )
}