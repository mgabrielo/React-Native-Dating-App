import { Button, FlatList, Image, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Entypo, AntDesign } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import axios from 'axios';
import { BASE_URL } from '../../index.js';
import "core-js/stable/atob"
import { jwtDecode } from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
    const [user, setUser] = useState({})
    const [option, setOption] = useState("AD")
    const [desc, setDesc] = useState('')
    const [activeSlide, setActiveSlide] = useState(1)
    const [userId, setUserId] = useState('')
    const [selectedTurnOns, setSelectedTurnOns] = useState([])
    const [lookingOptions, setLookingOptions] = useState([])
    const [imageUrl, setImageurl] = useState("")
    const [images, setImages] = useState([])
    useEffect(() => {
        const fetchUser = async () => {
            const token = await AsyncStorage.getItem('auth_token')
            AsyncStorage.getItem('user').then((user) => {
                if (user) {
                    const userObj = JSON.parse(user)
                    setUser(userObj)
                }
            })
            const decodedToken = jwtDecode(token)
            setUserId(decodedToken?.userId)
        }
        fetchUser()
    }, [])

    useEffect(() => {
        if (userId) {
            fetchUserDescription()
        }
    }, [userId])
    const profileImages = [
        {
            image: "https://cdn.pixabay.com/photo/2017/02/08/17/24/fantasy-2049567_1280.jpg",

        }, {
            image: "https://cdn.pixabay.com/photo/2015/12/01/20/28/road-1072823_1280.jpg",
        },
        {
            image: "https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg",
        }
    ]

    const turnons = [
        {
            id: '0',
            name: 'Music',
            description: 'Play Music'
        },
        {
            id: '1',
            name: 'Games',
            description: 'Play Games'
        },
        {
            id: '2',
            name: 'Boys',
            description: 'Play Boys'
        },
        {
            id: '3',
            name: 'Hard',
            description: 'Play Hard to Get'
        },
    ]
    const data = [
        {
            id: '0',
            name: 'Long Man',
            description: 'Play Long Man'
        },
        {
            id: '1',
            name: 'Short Man',
            description: 'Play Short Man'
        },
        {
            id: '2',
            name: 'Fat Man',
            description: 'Play Fat Man'
        },
        {
            id: '3',
            name: 'Hard Man',
            description: 'Play Hard Man'
        },
    ]

    const renderImageCarousel = ({ item }) => (

        <View>
            <Image
                style={{ width: '100%', height: 200, resizeMode: 'cover', }}
                source={{ uri: `${item}` }}
            />
            <Text>{activeSlide + 1}/{images.length}</Text>
        </View>
    )
    const updateUserDesc = async () => {
        try {
            await axios.put(`${BASE_URL}/users/${userId}/description`, { description: desc }).then((res) => {
                if (res.status == 200 && res.data) {
                    console.log(res.data)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const fetchUserDescription = async () => {
        try {
            await axios.get(`${BASE_URL}/users/${userId}`, { description: desc }).then((res) => {
                if (res.status == 200 && res.data) {
                    setDesc(res.data?.user?.description)
                    setSelectedTurnOns(res.data?.user?.turnOns)
                    setImages(res.data?.user?.profileImages)
                    setLookingOptions(res.data?.user?.lookingFor)

                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleTurnOns = (turnon) => {
        if (selectedTurnOns.includes(turnon)) {
            removeTurnOn(turnon)
        } else {
            addTurnOn(turnon)
        }
    }
    const addTurnOn = async (turnon) => {
        try {
            await axios.put(`${BASE_URL}/users/${userId}/turn-ons/add`, { turnOn: turnon }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    setSelectedTurnOns([...selectedTurnOns, turnon])
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const removeTurnOn = async (turnon) => {
        try {
            await axios.put(`${BASE_URL}/users/${userId}/turn-ons/remove`, { turnOn: turnon }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    setSelectedTurnOns(selectedTurnOns.filter((item) => item !== turnon))
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleOption = (lookingFor) => {
        if (lookingOptions.includes(lookingFor)) {
            removeLookingFor(lookingFor)
        } else {
            addLookingFor(lookingFor)
        }
    }

    const addLookingFor = async (lookingFor) => {
        try {
            await axios.put(`${BASE_URL}/users/${userId}/looking-for/add`, { lookingFor: lookingFor }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    setLookingOptions([...lookingOptions, lookingFor])
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddImage = async () => {
        try {
            await axios.post(`${BASE_URL}/users/${userId}/profile-images`, { imageUrl: imageUrl }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                }
            })
            setImageurl("")
        } catch (error) {
            console.log(error)
        }
    }

    const removeLookingFor = async (lookingFor) => {
        try {
            await axios.put(`${BASE_URL}/users/${userId}/looking-for/remove`, { lookingFor: lookingFor }).then((res) => {
                if (res.status == 200) {
                    console.log(res.data)
                    setLookingOptions(lookingOptions.filter((item) => item !== lookingFor))
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    const getRandomImage = () => {
        const randomIndex = Math.floor(Math.random() * images.length)
        return images[randomIndex]
    }
    const randomImage = getRandomImage()

    return (
        <ScrollView>
            <View>
                <Image
                    style={{ width: '100%', height: 200, resizeMode: 'cover', }}
                    source={{ uri: randomImage }}
                />
                <View >
                    <View>
                        <Pressable style={{
                            padding: 10,
                            backgroundColor: '#DDA0DD',
                            width: 300,
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            justifyContent: 'center',
                            alignItems: 'center',
                            borderRadius: 10,
                            top: -60,
                            left: "50%",
                            transform: [{ translateX: -200 }],
                        }}
                        >
                            <Image
                                style={{
                                    width: 60,
                                    height: 60,
                                    borderRadius: 30,
                                    resizeMode: 'cover'
                                }}
                                source={require("../../../assets/man.png")}
                            />
                            <Text style={{ fontSize: 16, marginTop: 6, fontWeight: '800' }}>{user?.name}</Text>
                            <Text style={{ fontSize: 15, marginTop: 4 }}>{user?.gender}</Text>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={{ marginTop: 1, flexDirection: 'row', marginHorizontal: 20, alignItems: 'center', gap: 25, justifyContent: 'center' }}>
                <Pressable onPress={() => setOption("AD")}>
                    <Text style={{ fontSize: 16, color: option == "AD" ? 'black' : 'gray', fontWeight: '600' }}>AD</Text>
                </Pressable>
                <Pressable onPress={() => setOption("Photos")}>
                    <Text style={{ fontSize: 16, color: option == "Photos" ? 'black' : 'gray', fontWeight: '600' }}>Photos</Text>
                </Pressable>
                <Pressable onPress={() => setOption("Turn-Ons")}>
                    <Text style={{ fontSize: 16, color: option == "Turn-Ons" ? 'black' : 'gray', fontWeight: '600' }}>Turn Ons</Text>
                </Pressable>
                <Pressable onPress={() => setOption("Looking For")}>
                    <Text style={{ fontSize: 16, color: option == "Looking For" ? 'black' : 'gray', fontWeight: '600' }}>Looking For</Text>
                </Pressable>
            </View>

            <View style={{ marginHorizontal: 15, marginVertical: 15 }}>
                {
                    option == "AD" && (
                        <View style={{ borderColor: '#202020', borderWidth: 1, borderRadius: 10, height: 250, padding: 10 }}>
                            <TextInput
                                value={desc}
                                style={{ fontSize: option ? 18 : 17 }}
                                onChangeText={(text) => setDesc(text)}
                                multiline
                                placeholder='Write your Ads for people to like you' />
                            <Pressable
                                onPress={updateUserDesc}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    borderRadius: 5,
                                    gap: 15,
                                    marginTop: 'auto',
                                    backgroundColor: 'black',
                                    justifyContent: 'center',
                                    padding: 10
                                }}
                            >
                                <Text style={{ color: 'white', textAlign: 'center', fontSize: 15, fontWeight: '600' }}>
                                    Publish Feed
                                </Text>
                                <Entypo name="mask" size={24} color="white" />
                            </Pressable>
                        </View>
                    )
                }
            </View>
            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
                {
                    option == "Photos" && images.length > 0 && (
                        <View>
                            <Carousel
                                loop
                                data={images}
                                renderItem={renderImageCarousel}
                                sliderWidth={350}
                                itemWidth={300}
                                onSnapToItem={(index) => setActiveSlide(index)}
                            />
                            <View style={{ marginTop: 25 }}>
                                <Text>Add a picture yourself</Text>
                                <View style={{ flexDirection: 'row', backgroundColor: '#DCDCDC', alignItems: 'center', gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginTop: 5 }}>
                                    <Entypo name="image" size={24} color="black" />
                                    <TextInput
                                        value={imageUrl}
                                        onChangeText={(text) => setImageurl(text)}
                                        style={{ color: 'gray', marginVertical: 8, width: 300 }}
                                        placeholder='Enter Image URL'
                                    />
                                </View>
                            </View>
                            <View style={{ marginTop: 7 }} />
                            <Button title='Add Image' onPress={handleAddImage} />
                        </View>
                    )
                }
            </View>

            {
                option === 'Turn-Ons' && (
                    <View style={{ marginHorizontal: 14, borderRadius: 8 }}>
                        {
                            turnons.length > 0 && turnons.map((turnon, index) => (
                                <Pressable
                                    onPress={() => handleTurnOns(turnon?.name)}
                                    key={index}
                                    style={{
                                        backgroundColor: '#fffdd0',
                                        padding: 10,
                                        marginVertical: 10
                                    }}
                                >
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 16, flex: 1 }}>{turnon.name}</Text>
                                        {
                                            selectedTurnOns.includes(turnon?.name) && (
                                                <AntDesign name="checkcircle" size={24} color="black" />
                                            )
                                        }
                                    </View>
                                    <Text style={{ marginTop: 4, textAlign: 'center', color: 'gray', fontSize: 16 }}>
                                        {turnon.description}
                                    </Text>
                                </Pressable>
                            ))
                        }
                    </View>
                )
            }

            {
                option == "Looking For" && data.length > 0 && (
                    <View style={{ marginHorizontal: 15 }}>
                        <>
                            <View>
                                <FlatList
                                    data={data}
                                    numColumns={2}
                                    scrollEnabled={false}
                                    columnWrapperStyle={{ justifyContent: 'space-between' }}
                                    renderItem={({ item }) => (
                                        <Pressable
                                            onPress={() => handleOption(item?.name)}
                                            style={{
                                                backgroundColor: lookingOptions.includes(item.name) ? '#fd5c63' : 'white',
                                                padding: 16,
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 150,
                                                margin: 10,
                                                borderRadius: 7,
                                                borderColor: '#fd5c63',
                                                borderWidth: lookingOptions.includes(item.name) ? 0 : 1
                                            }}
                                        >
                                            <Text style={{
                                                color: lookingOptions.includes(item.name) ? "white" : 'black',
                                                fontWeight: 'bold',
                                                fontSize: 16
                                            }}>{item?.name}</Text>
                                            <Text
                                                style={{
                                                    textAlign: 'center',
                                                    marginTop: 5,
                                                    fontSize: 14,
                                                    width: 140,
                                                    color: lookingOptions.includes(item.name) ? "white" : 'gray'
                                                }}
                                            >{item?.description}</Text>
                                        </Pressable>
                                    )}
                                />
                            </View>
                        </>
                    </View>
                )
            }
        </ScrollView>
    )
}

export default index

const styles = StyleSheet.create({})