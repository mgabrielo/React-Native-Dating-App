import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import "core-js/stable/atob"
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'
import { BASE_URL } from '../index.js'
import { useRouter } from 'expo-router'

const select = () => {
    const router = useRouter()
    const [option, setOption] = useState('')
    const [userId, setUserId] = useState('')
    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('auth_token')
            const decodedToken = jwtDecode(token)
            setUserId(decodedToken?.userId)
        }
        fetchUser()
    }, [])

    const updateUserGender = async () => {
        try {
            await axios.put(`${BASE_URL}/users/${userId}/gender`, { gender: option }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    router.replace("/(tabs)/bio")
                }
            }).catch((err) => {
                console.log(err)
            })
        } catch (error) {

        }
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white', padding: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 15 }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: 'black' }}>Select Gender :</Text>
            </View>
            <Pressable
                onPress={() => setOption("male")}
                style={{
                    backgroundColor: '#f0f0f0',
                    padding: 12,
                    borderColor: option == "male" ? "#000" : "transparent",
                    borderWidth: option == "male" ? 1 : 0,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 20
                }}
            >
                <Text style={{ fontSize: 17, fontWeight: '700' }}>
                    I am a Man
                </Text>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../assets/man.png')}
                />
            </Pressable>
            <Pressable
                onPress={() => setOption("female")}
                style={{
                    backgroundColor: '#f0f0f0',
                    padding: 12,
                    borderColor: option == "female" ? "#000" : "transparent",
                    borderWidth: option == "female" ? 1 : 0,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 20
                }}
            >
                <Text style={{ fontSize: 17, fontWeight: '700' }}>
                    I am a Woman
                </Text>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../assets/woman.png')}
                />
            </Pressable>
            <Pressable
                onPress={() => setOption("non-binary")}
                style={{
                    backgroundColor: '#f0f0f0',
                    padding: 12,
                    borderColor: option == "nonbinary" ? "#000" : "transparent",
                    borderWidth: option == "nonbinary" ? 1 : 0,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexDirection: 'row',
                    marginTop: 20
                }}
            >
                <Text style={{ fontSize: 17, fontWeight: '700' }}>
                    I am a Non-Binary
                </Text>
                <Image
                    style={{ width: 50, height: 50 }}
                    source={require('../../assets/non-binary.png')}
                />
            </Pressable>
            {
                option && (
                    <Pressable onPress={updateUserGender} style={{ marginTop: 25, backgroundColor: 'black', borderRadius: 4, padding: 10 }}>
                        <Text style={{ textAlign: 'center', color: 'white', fontWeight: '600' }}>Done</Text>
                    </Pressable>
                )
            }
        </View>
    )
}

export default select

const styles = StyleSheet.create({})