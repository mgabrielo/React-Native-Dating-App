import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Redirect } from 'expo-router'
export const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
export const SOCKET_URL = process.env.EXPO_PUBLIC_API_SOCKET_URL

const index = () => {
    return (
        <Redirect href={'/(authenticate)/login'} />
    )
}

export default index

const styles = StyleSheet.create({})