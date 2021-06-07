import React, { useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import DatePicker from '../DatePicker';
import { COLORS, icons, FONTS } from '../../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import firebase from '@react-native-firebase/app';

const Profile = ({ navigation, userData, getData }) => {
    const [uidLogin, setUidLogin] = useState('')

    const [birthday, setBirthday] = useState(new Date(Date.now()))
    const [email, setEmail] = useState('')
    const [tel, setTel] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [description, setDescription] = useState('')

    const [isEdit, setIsEdit] = useState(false)

    useEffect(() => {
        if (!userData) return;
        setUidLogin(userData['id'])
        setName(userData['name'])
        setBirthday(userData['birthday'] ? new Date(userData['birthday']['seconds'] * 1000) : new Date(Date.now()))
        setEmail(userData['email'])
        setAddress(userData['address'])
        setDescription(userData['description'])
    }, [userData])

    const updateProfile = () => {
        if (!uidLogin) return Alert.alert('Không tìm thấy thông tin người dùng!')

        let dataSend = {
            tel: tel,
            address: address,
            description: description
        }
        if (birthday) dataSend['birthday'] = new Date(birthday)
        if (dataSend) {
            firebase.firestore()
                .collection('users')
                .doc(uidLogin)
                .update(dataSend)
                .then(async () => {
                    await getData()
                    setIsEdit(false)
                })
        }
    }

    return (
        <LinearGradient
            style={styles.container}
            colors={[COLORS.lightGray, COLORS.lightGray]}
        >
            <Text style={{
                fontSize: 35,
                textAlign: 'center',
                paddingTop: 22,
            }}>{name}</Text>

            <KeyboardAwareScrollView>
                <View style={styles.nomalField}>
                    <Text style={styles.title}> Email:</Text>
                    <View style={styles.backgroundInput}>
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={COLORS.darkgray}
                            style={styles.input}
                            value={email}
                            onChangeText={setEmail}
                            editable={false}
                        />
                    </View>
                </View>

                <View>
                    <DatePicker
                        model={birthday}
                        setDate={setBirthday}
                        label='Ngày sinh:'
                        disabled={!isEdit}
                    />
                </View>

                <View style={styles.nomalField}>
                    <Text style={styles.title}> Số điện thoại:</Text>
                    <View style={styles.backgroundInput}>
                        <TextInput
                            placeholder='Số điện thoại'
                            placeholderTextColor={COLORS.darkgray}
                            style={styles.input}
                            value={tel}
                            onChangeText={setTel}
                            editable={isEdit}
                        />
                    </View>
                </View>

                <View style={styles.nomalField}>
                    <Text style={styles.title}> Địa chỉ:</Text>
                    <View style={styles.backgroundInput}>
                        <TextInput
                            placeholder='Địa chỉ'
                            placeholderTextColor={COLORS.darkgray}
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            editable={isEdit}
                        />
                    </View>
                </View>

                <View style={[styles.nomalField, { height: 80 }]}>
                    <View style={[styles.backgroundInput, { height: 60 }]}>
                        <TextInput
                            placeholder='Mô tả'
                            multiline={true}
                            numberOfLines={4}
                            placeholderTextColor={COLORS.darkgray}
                            style={[styles.input]}
                            value={description}
                            onChangeText={setDescription}
                            editable={isEdit}
                        />
                    </View>
                </View>

                {
                    !isEdit &&
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => {
                            setIsEdit(true)
                        }}
                    >
                        <LinearGradient colors={[COLORS.primary, COLORS.primary, COLORS.primary]} style={styles.gradient}>
                            <Text style={styles.text}>
                                Chỉnh sửa</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }

                <View style={{ flexDirection: 'row' }}>
                    {
                        isEdit &&
                        <TouchableOpacity
                            style={[styles.button1, { marginLeft: '10%' }]}
                            onPress={() => updateProfile()}
                        >
                            <LinearGradient colors={[COLORS.primary, COLORS.primary, COLORS.primary]} style={styles.gradient}>
                                <Text style={styles.text}>
                                    Lưu</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    }

                    {
                        isEdit &&
                        <TouchableOpacity
                            style={[styles.button1, { marginLeft: '10%' }]}
                            onPress={() => {
                                setIsEdit(false)
                            }}
                        >
                            <LinearGradient colors={[COLORS.darkgray, COLORS.darkgray]} style={styles.gradient}>
                                <Text style={styles.text}>
                                    Hủy</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    }
                </View>
            </KeyboardAwareScrollView>

        </LinearGradient>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        paddingBottom: 20
    },
    gradient: {
        height: '100%',
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        paddingHorizontal: 20,
        paddingTop: 30
    },
    nomalField: {
        marginVertical: 10,
        marginTop: 20,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: COLORS.white,
        borderRadius: 40
    },
    title: {
        fontSize: 18,
    },
    backgroundInput: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
        backgroundColor: COLORS.white,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    button: {
        width: '70%',
        marginLeft: '15%',
        marginTop: 40,
        height: 50,
    },
    button1: {
        width: '35%',
        marginTop: 40,
        height: 50,
    },
    text: {
        color: COLORS.white,
        fontSize: 20,
    },
    input: {
        fontSize: 16,
        color: COLORS.darkgray,
        width: '100%'
    }
})