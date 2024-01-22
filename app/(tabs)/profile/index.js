import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useEffect } from 'react'
import { BASE_URL } from '../../index.js'
import Profile from '../../../components/Profile.js'

const index = () => {
    const [userId, setUserId] = useState('')
    const [user, setUser] = useState({})
    const [profiles, setProfiles] = useState([])

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('auth_token')
            const decodedToken = jwtDecode(token)
            await axios.get(`${BASE_URL}/users/${decodedToken?.userId}`).then((res) => {
                if (res.status == 200) {
                    console.log(res.data.user)
                    setUserId(decodedToken?.userId)
                    setUser(res?.data?.user)
                }
            })
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (userId && user) {
            fetchProfiles()
        }
    }, [userId, user])

    const fetchProfiles = async () => {
        try {
            await axios.get(`${BASE_URL}/get-profiles`, {
                params: {
                    userId: userId,
                    gender: user?.gender,
                    turnOns: user?.turnOns,
                    lookingFor: user?.lookingFor
                }
            }).then((res) => {
                if (res.status == 200) {
                    setProfiles(res.data?.profiles)
                }
            }).catch((err) => {
                console.log('profile-err', err?.message)
            })
        } catch (error) {
            console.log(error)
        }
    }

    console.log('profiles', profiles)
    return (
        <View style={{ flex: 1, backgroundColor: '#DCDCDC' }}>
            <FlatList
                data={profiles}
                keyExtractor={(item) => item._id}
                renderItem={({ item, index }) => (
                    <Profile key={index} item={item} userId={userId} setProfiles={setProfiles} isEven={profiles.length % 2 == 0} />
                )}
            />
        </View>
    )
}

export default index

const styles = StyleSheet.create({})