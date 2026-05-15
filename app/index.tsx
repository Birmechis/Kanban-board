import { router } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Index() {
  return (
    <View>
      <Text>Kanban Board</Text>
      <Button
        title="Open Board"
        onPress={() => router.push("./board/1")}
      ></Button>
    </View>
  );
}
