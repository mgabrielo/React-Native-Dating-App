import { Pressable, StyleSheet, Text, View } from 'react-native'
import { Ionicons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { BASE_URL } from '../../index.js';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import UserChat from '../../../components/UserChat.js';

const index = () => {
    const router = useRouter()
    const [userId, setUserId] = useState('')
    const [profiles, setProfiles] = useState([])
    const [matches, setMatches] = useState([])
    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('auth_token')
            const decodedToken = jwtDecode(token)
            setUserId(decodedToken?.userId)
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (userId) {
            fetchReceivedLikesDetails()
        }
    }, [userId])

    useEffect(() => {
        if (userId) {
            fetchUserMatches()
        }
    }, [userId])

    const fetchReceivedLikesDetails = async () => {
        try {
            await axios.get(`${BASE_URL}/received-likes/${userId}/details`).then((res) => {
                if (res.status == 200 && res.data) {
                    console.log(res.data)
                    setProfiles(res.data?.receivedLikesDetails)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const fetchUserMatches = async () => {
        try {
            await axios.get(`${BASE_URL}/users/${userId}/matches`).then((res) => {
                if (res.status == 200 && res.data) {
                    setMatches(res.data?.matches)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    console.log('chat-profiles-', profiles)

    useFocusEffect(
        useCallback(() => {
            if (userId) {
                fetchUserMatches()
            }
        }, [])
    )
    console.log('chat-matches', matches)
    return (
        <View style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 20, fontWeight: 'bold', }}>Chats</Text>
                <Ionicons name="chatbox-ellipses-outline" size={24} color="black" />
            </View>
            <Pressable
                onPress={() => router.push({
                    pathname: '/chat/select',
                    params: {
                        profiles: JSON.stringify(profiles),
                        userId: userId
                    }
                })}
                style={{ marginVertical: 12, flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name="heart" size={24} color="black" />
                </View>
                <Text style={{ flex: 1 }}>You have got ({profiles.length}) Likes</Text>
                <MaterialIcons name="keyboard-arrow-right" size={28} color="black" />
            </Pressable>
            <View>
                {matches && matches.length > 0 && matches.map((item, index) => (
                    <UserChat key={index} userId={userId} item={item} />
                ))}
            </View>
        </View>
    )
}

export default index

const styles = StyleSheet.create({})