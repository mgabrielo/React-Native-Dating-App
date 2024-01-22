import { useLocalSearchParams, useRouter } from 'expo-router'
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Entypo, FontAwesome, AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { BASE_URL } from '../../index.js';

const select = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    const profiles = JSON.parse(params?.profiles)
    const userId = params?.userId
    console.log('select-profile', profiles)

    const handleMatch = async (selectedUserId) => {
        try {
            await axios.post(`${BASE_URL}/create-match`, {
                currentUserId: userId,
                selectedUserId: selectedUserId
            }).then((res) => {
                if (res.status == 200) {
                    setTimeout(() => {
                        router.push('/chat')
                    }, 500)
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <ScrollView style={{ backgroundColor: 'white', flex: 1, padding: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: '#F0F0F0', padding: 10, borderRadius: 18 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>Near By ❤️‍🔥</Text>
                </View>
                <View style={{ backgroundColor: '#F0F0F0', padding: 10, borderRadius: 18 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>Looking For 💗</Text>
                </View>
                <View style={{ backgroundColor: '#F0F0F0', padding: 10, borderRadius: 18 }}>
                    <Text style={{ textAlign: 'center', fontSize: 16 }}>Turn-Ons 💘</Text>
                </View>
            </View>
            {
                profiles && profiles?.length > 0 ? (
                    <View style={{ marginTop: 10, borderWidth: 2, borderColor: '#FBCEB1', padding: 10, borderRadius: 15 }}>
                        {
                            profiles.map((item, index) => (
                                <View key={index} style={{ marginVertical: 15 }}>
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
                                                <Pressable
                                                    onPress={() => handleMatch(item?._id)}
                                                    style={{ width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E0E0E0' }}>
                                                    <AntDesign name="hearto" size={26} color="#FF033E" />
                                                </Pressable>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 15 }}>
                                        <Text>Turn-Ons 💘</Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                                            {item?.turnOns?.map((item, indx) => (
                                                <View
                                                    key={indx}
                                                    style={{
                                                        backgroundColor: "#DE3163",
                                                        padding: 10,
                                                        borderRadius: 25,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {item}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                    <View style={{ marginTop: 15 }}>
                                        <Text>Looking For 💗 </Text>
                                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10 }}>
                                            {item?.lookingFor?.map((item, idx) => (
                                                <View
                                                    key={idx}
                                                    style={{
                                                        backgroundColor: "#808080",
                                                        padding: 10,
                                                        borderRadius: 25,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            textAlign: 'center',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                        }}
                                                    >
                                                        {item}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </View>
                                </View>
                            ))
                        }
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginTop: 100 }}>
                        <Image
                            style={{
                                width: 100,
                                height: 100
                            }}
                            source={{ uri: 'https://cdn.pixabay.com/photo/2014/12/21/23/58/flamingos-576492_1280.png' }}
                        />
                        <View>
                            <Text style={{ fontSize: 18, color: '#FF69B4', fontWeight: '700', alignItems: 'center' }}>Oops... No Likes Yet</Text>
                            <Text style={{ marginTop: 10, fontSize: 16, fontWeight: '500' }}>Improve Your AD description to get more likes</Text>
                        </View>
                    </View>
                )
            }
        </ScrollView>
    )
}

export default select

const styles = StyleSheet.create({})