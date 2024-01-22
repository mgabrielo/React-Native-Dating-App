import { Image, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { useLayoutEffect } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { Entypo } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { useState } from 'react';
import { io } from "socket.io-client"
import { useEffect } from 'react';
import { BASE_URL, SOCKET_URL, } from '../../index.js';
import axios from 'axios';

const chatroom = () => {
    const navigation = useNavigation()
    const params = useLocalSearchParams()
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const socket = io(`${SOCKET_URL}`)
    socket.on("connect", () => {
        console.log('chat room connected to socket')
    })
    socket.on("receiveMessage", (newMessage) => {
        console.log('new-message', newMessage)
        setMessages((prevMessages) => [...prevMessages, newMessage])
    })
    const handleMessage = async (senderId, receiverId) => {
        socket.emit("sendMessage", { senderId, receiverId, message })
        setMessage('')

        setTimeout(() => {
            fetchMessages()
        }, 500)
    }
    const fetchMessages = async () => {
        try {
            const senderId = params?.senderId
            const receiverId = params?.receiverId

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
    useEffect(() => {
        fetchMessages()
    }, [])

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: "",
            headerLeft: () => {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Ionicons name="arrow-back-sharp" size={24} color="black" />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            <Image
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: 35,
                                    resizeMode: 'cover'
                                }}
                                source={{ uri: params?.image }}
                            />
                        </View>
                        <Text style={{ fontSize: 18, fontWeight: '700' }}>{params?.name}</Text>
                    </View>
                )
            },
            headerRight: () => {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <Entypo name="dots-three-vertical" size={24} color="black" />
                        <Feather name="video" size={24} color="black" />
                    </View>
                )
            }
        })
    }, [])

    const formatTime = (time) => {
        const options = { hour: 'numeric', minute: 'numeric' }
        return new Date(time).toLocaleString("en-US", options)
    }

    return (
        <KeyboardAvoidingView style={{ flex: 1, backgroundColor: 'white' }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* message section */}
                {messages && messages.length > 0 && messages.map((item, index) => (
                    <Pressable
                        key={index}
                        style={[
                            item?.senderId == params?.senderId ? {
                                alignSelf: 'flex-end',
                                backgroundColor: '#007bff',
                                padding: 8,
                                maxWidth: '60%',
                                borderRadius: 8,
                                margin: 10
                            } : {
                                alignSelf: 'flex-start',
                                backgroundColor: '#db7093',
                                padding: 8,
                                margin: 10,
                                borderRadius: 8,
                                maxWidth: '60%'
                            }
                        ]}
                    >
                        <Text style={{ color: '#fff', fontSize: 17, }}>{item?.message}</Text>
                        <Text style={{ color: '#dcdcdc', fontSize: 14, marginTop: 5 }}>{formatTime(item?.timestamp)}</Text>
                    </Pressable>
                ))}
            </ScrollView>
            <View style={{ flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', paddingVertical: 7, borderTopColor: '#dddddd', borderTopWidth: 2, marginBottom: 1 }}>
                <Entypo name="emoji-happy" size={20} color="black" style={{ marginRight: 5 }} />
                <TextInput
                    multiline
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    style={{
                        flex: 1,
                        height: 40,
                        borderWidth: 2,
                        borderColor: '#dddddd',
                        borderRadius: 20,
                        padding: 10,
                        fontSize: 17
                    }}
                    placeholder='Type Your Message'
                />
                <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center', marginHorizontal: 8 }}>
                    <Feather name="camera" size={24} color="black" />
                    <Ionicons name="mic-outline" size={24} color="black" />
                </View>
                <Pressable
                    onPress={() => handleMessage(params?.senderId, params.receiverId)}
                    style={{ backgroundColor: '#007bff', padding: 10, borderRadius: 50, alignItems: 'center', gap: 1 }}
                >
                    <Feather name="send" size={20} color="white" />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    )
}

export default chatroom

const styles = StyleSheet.create({})