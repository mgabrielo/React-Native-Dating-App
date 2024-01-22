import { Tabs } from 'expo-router'
import { Feather } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name='profile'
                options={{
                    title: "Profiles",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? (
                            <Feather name="eye" size={24} color="black" />
                        ) : (
                            <Feather name="eye" size={24} color="gray" />
                        )
                    )
                }}
            />
            <Tabs.Screen
                name='chat'
                options={{
                    title: "Chat",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? (
                            <Ionicons name="chatbubbles-outline" size={24} color="black" />
                        ) : (
                            <Ionicons name="chatbubbles-outline" size={24} color="gray" />
                        )
                    )
                }}
            />
            <Tabs.Screen
                name='bio'
                options={{
                    title: "Account",
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        focused ? (
                            <FontAwesome5 name="user" size={24} color="black" />
                        ) : (
                            <FontAwesome5 name="user" size={24} color="gray" />
                        )
                    )
                }}
            />
        </Tabs>
    )
}