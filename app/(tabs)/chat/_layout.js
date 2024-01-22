import { Stack } from 'expo-router'

export default function Layout() {
    return (
        <>
            <Stack  >
                <Stack.Screen name='index' options={{ headerShown: false }} />
                <Stack.Screen name='select' options={{ headerShown: false }} />
                <Stack.Screen name='chatroom' options={{ headerStyle: { height: 20 } }} />
            </Stack>
        </>
    )
}
