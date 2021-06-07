import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../constants';
import firebase from '@react-native-firebase/app';
require('firebase/auth');

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('user1@gmail.com')
    const [password, setPassword] = useState('111111')

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) return navigation.navigate('Home')
        })
    })

    const onLogin = () => {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((res) => {
                navigation.navigate('Home')
            })
            .catch(error => {
                Alert.alert('Email hoặc mật khẩu không chính xác!')
            });
        navigation.navigate('Home')
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>Đăng nhập</Text>
            </View>
            <View>
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="person-outline" size={20} color="#f20042" />
                    <TextInput
                        placeholder='Email'
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputSection}>
                    <Icon style={styles.inputIcon} name="lock-closed-outline" size={20} color="#f20042" />
                    <TextInput
                        placeholder='Mật khâu'
                        secureTextEntry={true}
                        style={styles.input}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                <Text
                    style={{ textAlign: 'right', marginTop: 5, fontSize: 15 }}
                    onPress={() => {
                        navigation.navigate('ForgotPassword')
                    }}
                >
                    Forgot password?
                </Text>

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLogin()}
                >
                    <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.gradient}>
                        <Text style={styles.text}>
                            Đăng nhập</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <View style={{ ...FONTS.body4, marginTop: 30, alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 17, color: COLORS.primary }}
                        onPress={() => {
                            navigation.navigate('Signup')
                        }}
                    >
                        Sign up here
                    </Text>
                </View>
            </View>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingTop: 80
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderRadius: 40,
        marginTop: 20,
        height: 50,
        alignItems: 'center',
    },
    inputIcon: {
        padding: 10,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    input: {
        ...FONTS.body2,
        color: COLORS.primary,
    },
    button: {
        marginTop: 40,
        height: 50,
    },
    title: {
        ...FONTS.h1,
        textAlign: 'center',
        marginTop: 70
    },
    text: {
        ...FONTS.body2,
        color: 'white'
    }
})