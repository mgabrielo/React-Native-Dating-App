import { StyleSheet, Text, View, Pressable, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { BASE_URL } from '../app/index.js'
import axios from 'axios'
import { useState } from 'react'

const UserChat = ({ item, userId }) => {
    const router = useRouter()

    const [messages, setMessages] = useState([])
    const getLastMessage = () => {
        const n = messages.length
        return messages[n - 1]
    }
    const lastMessage = getLastMessage()
    useEffect(() => {
        fetchMessages()
    }, [])
    const fetchMessages = async () => {
        try {
            const senderId = userId
            const receiverId = item?._id

            await axios.get(`${BASE_URL}/messages`, {
                params: {
                    senderId: senderId,
                    receiverId: receiverId
                }
            }).then((res) => {
                if (res.status == 200 && res.data) {
                    setMessages(res.data?.messages)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <Pressable
            onPress={() => router.push({
                pathname: '/chat/chatroom',
                params: {
                    image: item?.profileImages[0],
                    name: item?.name,
                    receiverId: item?._id,
                    senderId: userId
                }
            })}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
                marginVertical: 12
            }}
        >
            <View>
                <Image
                    style={{
                        width: 60,
                        height: 60,
                        borderRadius: 35
                    }}
                    resizeMode='contain'
                    source={{ uri: item?.profileImages[0] }}
                />
            </View>

            <View>
                <Text style={{ fontSize: 18, fontWeight: '700', textTransform: 'capitalize' }}>{item?.name}</Text>
                <Text style={{ color: 'gray', fontSize: 16 }}>
                    {
                        lastMessage !== undefined ? lastMessage?.message : `Start chat with ${item?.name}`
                    }
                </Text>
            </View>
        </Pressable>
    )
}

export default UserChat

const styles = StyleSheet.create({})