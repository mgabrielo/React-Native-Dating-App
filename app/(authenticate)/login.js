import { StyleSheet, Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { BASE_URL } from '../index.js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const login = () => {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('auth_token')
            const decodedToken = jwtDecode(token)
            const user = await axios.get(`${BASE_URL}/users/${decodedToken?.userId}`).then((res) => {
                if (res.status == 200) {
                    return res.data?.user
                }
            })
            if (token) {
                const userObj = JSON.stringify(user)
                await AsyncStorage.setItem('user', userObj)
                router.replace('/(tabs)/chat')
            }
        }
        fetchUser()
    }, [])


    const handleLogin = async () => {
        const user = { email, password }
        await axios.post(`${BASE_URL}/login`, user).then((res) => {
            console.log(res.status)
            if (res.data) {
                console.log(res.data?.token)
                console.log('User Login Successful')
                AsyncStorage.setItem("auth_token", res.data?.token)
                router.push('/(authenticate)/select')
            }
        }).catch((err) => {
            console.log('login failed')
            console.log(err)
        })
        setEmail('')
        setPassword('')
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white', alignItems: 'center' }}>
            <View style={{ height: 200, backgroundColor: "pink", width: '100%' }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Image
                        source={require('../../assets/love-birds.png')}
                        style={{ width: 100, height: 100, resizeMode: 'cover' }}
                    />
                </View>
                <Text
                    style={{
                        marginTop: 20,
                        textAlign: "center",
                        fontSize: 20,
                        fontWeight: 'bold'
                    }}
                >
                    Match Date
                </Text>
            </View>
            <KeyboardAvoidingView>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 17, fontWeight: "bold", marginTop: 25, color: '#F9629F' }}>
                        Log In to Your Account
                    </Text>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Image
                        style={{ width: 50, height: 50, resizeMode: 'cover' }}
                        source={require('../../assets/hug.png')}
                    />
                </View>
                <View style={{ marginTop: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, backgroundColor: 'pink', borderRadius: 10 }}>
                        <MaterialIcons name="email" size={24} color="white" style={{ marginLeft: 8 }} />
                        <TextInput
                            style={{ color: '#ff6666', marginVertical: 5, width: 300, fontSize: 17 }}
                            placeholder='Enter Email'
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                            placeholderTextColor={'#ff6666'}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, paddingVertical: 5, backgroundColor: 'pink', marginTop: 10, borderRadius: 10 }}>
                        <MaterialIcons name="lock" size={24} color="white" style={{ marginLeft: 8 }} />
                        <TextInput
                            style={{ color: '#ff6666', marginVertical: 5, width: 300, fontSize: 17 }}
                            placeholder='Enter Password'
                            value={password}
                            secureTextEntry={true}
                            onChangeText={(text) => setPassword(text)}
                            placeholderTextColor={'#ff6666'}
                        />
                    </View>
                    <View style={{ marginTop: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ color: '#ff6666' }} >Keep Me Logged In</Text>
                        <Text style={{ color: '#ff6666' }}>Forgot Password</Text>
                    </View>
                    <View style={{ marginVertical: 20 }} />
                    <Pressable
                        onPress={handleLogin}
                        style={{ width: 200, backgroundColor: '#ffc0cb', borderRadius: 6, marginLeft: 'auto', marginRight: 'auto', padding: 10 }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 18, color: '#ff6666', fontWeight: 'bold' }}>Log In</Text>
                    </Pressable>

                    <Pressable style={{ marginTop: 15 }} onPress={() => router.replace('/register')}>
                        <Text style={{ textAlign: 'center', color: '#808080', fontSize: 16 }}>Don't Have An Account..?  Sign Up</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default login

const styles = StyleSheet.create({})