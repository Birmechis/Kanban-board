import { ScrollView } from "react-native";
import Column from "../../components/Column"

export default function Board() {
    return (
        <ScrollView horizontal>
           <Column columnId="todo" />
           <Column columnId="progress" />
           <Column columnId="done" />
        </ScrollView>
    )
}