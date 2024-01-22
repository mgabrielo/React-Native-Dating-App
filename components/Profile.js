import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useState } from 'react'
import { Entypo, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '../app/index.js';
import * as Animatable from 'react-native-animatable'

const Profile = ({ item, isEven, userId, setProfiles }) => {
    const colors = ["#F0F8FF", "#FFFFFF"]
    const [liked, setLiked] = useState(false)
    const [selected, setSelected] = useState(false)
    const handleLike = async (selectedUserId) => {
        try {
            setLiked(true)
            await axios.post(`${BASE_URL}/send-like`, { currentUserId: userId, selectedUserId: selectedUserId }).then((res) => {
                if (res.status == 200) {
                    setTimeout(() => {
                        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== selectedUserId))
                        setLiked(false)
                    }, 2000)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleLikeOther = async (selectedUserId) => {
        try {
            setSelected(true)
            await axios.post(`${BASE_URL}/send-like`, { currentUserId: userId, selectedUserId: selectedUserId }).then((res) => {
                if (res.status == 200) {
                    setTimeout(() => {
                        setProfiles((prevProfiles) => prevProfiles.filter((profile) => profile._id !== selectedUserId))
                        setSelected(true)
                    }, 2000)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    if (isEven) {
        return (
            <View style={{ backgroundColor: colors[0], padding: 12 }}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item?.name}</Text>
                            <Text style={{ width: 200, marginTop: 15, fontSize: 18, lineHeight: 24 }}>
                                {item?.description?.length < 160 ? item?.description : item?.description?.substr(0, 160)}
                            </Text>
                        </View>
                        {
                            item?.profileImages?.slice(0, 1).map((item, index) => (
                                <Image
                                    key={index}
                                    style={{ width: 280, height: 280, resizeMode: 'cover', borderRadius: 5 }}
                                    source={{ uri: item }}
                                />
                            ))
                        }
                    </View>
                </ScrollView>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <Entypo name="dots-three-vertical" size={25} color="black" />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <Pressable style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E0E0' }}>
                                <FontAwesome name="diamond" size={26} color="#DE3163" />
                            </Pressable>
                            {
                                liked ? (
                                    <Pressable
                                        style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}
                                    >
                                        <Animatable.View animation={"swing"} easing={"ease-in-circ"} iterationCount={1}>
                                            <AntDesign name="hearto" size={26} color="white" />
                                        </Animatable.View>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={() => handleLike(item?._id)}
                                        style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E0E0' }}>
                                        <AntDesign name="hearto" size={26} color="#FF033E" />
                                    </Pressable>
                                )
                            }

                        </View>
                    </View>
                </View>
            </View>
        )
    } else {
        return (
            <View style={{ backgroundColor: colors[1], padding: 12 }}>
                <ScrollView showsHorizontalScrollIndicator={false} horizontal>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                        {
                            item?.profileImages?.slice(0, 1).map((item, index) => (
                                <Image
                                    key={index}
                                    style={{ width: 280, height: 280, resizeMode: 'cover', borderRadius: 5 }}
                                    source={{ uri: item }}
                                />
                            ))
                        }
                        <View>
                            <Text style={{ fontSize: 17, fontWeight: 'bold' }}>{item?.name}</Text>
                            <Text style={{ width: 200, marginTop: 15, fontSize: 18, lineHeight: 24 }}>
                                {item?.description?.length < 160 ? item?.description : item?.description?.substr(0, 160)}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
                <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 }}>
                        <Entypo name="dots-three-vertical" size={25} color="black" />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                            <Pressable style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E0E0' }}>
                                <FontAwesome name="diamond" size={26} color="#0066B2" />
                            </Pressable>

                            {
                                selected ? (
                                    <Pressable
                                        style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}
                                    >
                                        <Animatable.View animation={"swing"} easing={"ease-in-circ"} iterationCount={1}>
                                            <AntDesign name="hearto" size={26} color="#6699CC" />
                                        </Animatable.View>
                                    </Pressable>
                                ) : (
                                    <Pressable
                                        onPress={() => handleLikeOther(item._id)}
                                        style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#6699CC' }}
                                    >
                                        <AntDesign name="hearto" size={26} color="#fff" />
                                    </Pressable>
                                )
                            }

                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

export default Profile

const styles = StyleSheet.create({})