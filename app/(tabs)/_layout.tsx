import { Tabs } from "expo-router";


export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen name="index" options={{title: "Boards"}}/>
            <Tabs.Screen name="search" options={{title: "Search"}}/>
            <Tabs.Screen name="profile" options={{title: "Profile"}}/>
        </Tabs>
    )
}
