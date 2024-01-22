import { Text, View, SafeAreaView, Image, KeyboardAvoidingView, TextInput, Pressable } from 'react-native'
import { MaterialCommunityIcons, MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { BASE_URL } from '../index.js';

const register = () => {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const handleRegister = async () => {
        const user = { name, email, password }
        await axios.post(`${BASE_URL}/register`, user).then((res) => {
            console.log(res.status)
            console.log('User Registered Successfully')
        }).catch((err) => {
            console.log('registration failed')
            console.log(err)
        })
        setName('')
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
                        Create Your Account
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
                        <FontAwesome name="user" size={24} color="white" style={{ marginLeft: 8 }} />
                        <TextInput
                            style={{ color: '#ff6666', marginVertical: 5, width: 300, fontSize: 17 }}
                            placeholder='Enter Username'
                            value={name}
                            onChangeText={(text) => setName(text)}
                            placeholderTextColor={'#ff6666'}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 10, paddingVertical: 5, backgroundColor: 'pink', borderRadius: 10 }}>
                        <MaterialCommunityIcons name="email" size={24} color="white" style={{ marginLeft: 8 }} />
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
                            secureTextEntry={true}
                            value={password}
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
                        onPress={handleRegister}
                        style={{ width: 200, backgroundColor: '#ffc0cb', borderRadius: 6, marginLeft: 'auto', marginRight: 'auto', padding: 10 }}
                    >
                        <Text style={{ textAlign: 'center', fontSize: 18, color: '#ff6666', fontWeight: 'bold' }}>Register</Text>
                    </Pressable>

                    <Pressable style={{ marginTop: 15 }} onPress={() => router.replace('/login')}>
                        <Text style={{ textAlign: 'center', color: '#808080', fontSize: 16 }}>Already Have An Account..? Log In</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default register
