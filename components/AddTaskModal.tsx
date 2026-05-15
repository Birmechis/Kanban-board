import { useBoardStore } from "@/store/useBoardStore";
import { useState } from "react";
import { TextInput, View, Button } from "react-native";



export default function AddTaskModal({ columnId }: { columnId: string }) {
    const [text, setText] =useState("")
    const addTask = useBoardStore((s) => s.addTask)

    return (
        <View>
            <TextInput value={text} onChangeText={setText}/>
            <Button title="Add Task" onPress={() => {
                addTask({ id: Date.now().toString(), title: text, columnId })
            }}/>
        </View>
    )
}