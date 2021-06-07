import React, { useState, useEffect } from 'react';
import { View, TextInput, SafeAreaView, Text, TouchableOpacity, Image, StyleSheet, Modal, Alert } from 'react-native';
import { COLORS, icons, SIZES, FONTS, images } from '../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Posts from '../components/Home/Posts';
import EditProfile from '../components/Profile/EditProfile';
import firebase from '@react-native-firebase/app';
import Icon from 'react-native-vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';

const Profile = ({ navigation }) => {
    const [uidLogin, setUidLogin] = useState('')
    const [userData, setUserData] = useState(null)
    const [listimages, setListImages] = useState([])

    const [mode, setMode] = useState(['Post'])
    const [editProfileImg, setEditProfileImg] = useState(false)
    const [listPost, setListPost] = useState([])
    const [lastPost, setLastPost] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        getData()
    }, [uidLogin])

    const changeMode = (newMode) => {
        setMode(newMode)
    }

    const getData = () => {
        if (!uidLogin) return
        firebase.firestore()
            .collection('users')
            .doc(uidLogin)
            .onSnapshot(doc => {
                setUserData(doc.data())
            })
        firebase.firestore()
            .collection('images')
            .where('userId', '==', uidLogin)
            .onSnapshot(snap => {
                if (snap.docs.length > 0) {
                    setListImages(snap.docs[0].data()['images'])
                }
            })
    }

    const setAvatarFromLocal = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            uploadImage(result.uri, 'IMG_' + Date.now(), updateAvatar, saveImageInfo)
                .then(() => {
                    setEditProfileImg(false)
                    getData()
                })
                .catch(err => {
                    Alert.alert(err)
                })
        }
    };

    const setBgImageFromLocal = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            uploadImage(result.uri, 'IMG_' + Date.now(), updateBgImage, saveImageInfo)
                .then(() => {
                    setEditProfileImg(false)
                    getData()
                })
                .catch(err => {
                    Alert.alert(err)
                })
        }
    };

    const updateAvatar = (uri) => {
        if (!uidLogin) return
        firebase.firestore()
            .collection('users')
            .doc(uidLogin)
            .update({
                avatar: uri
            })
    }

    const updateBgImage = (uri) => {
        if (!uidLogin) return
        firebase.firestore()
            .collection('users')
            .doc(uidLogin)
            .update({
                bgImage: uri
            })
    }

    const saveImageInfo = (uri) => {
        if (!uidLogin) return;
        firebase.firestore()
            .collection('images')
            .where('userId', '==', uidLogin)
            .onSnapshot(snap => {
                if (snap.docs.length > 0) {
                    if (snap.docs[0].data()['images'].indexOf(uri) < 0) {
                        firebase.firestore().collection('images').doc(snap.docs[0].id)
                            .update({
                                images: [uri, ...snap.docs[0].data()['images']]
                            })
                    }
                } else {
                    firebase.firestore().collection('images')
                        .add({
                            userId: uidLogin,
                            images: [uri]
                        })
                }
            })
    }

    const uploadImage = async (uri, imageName, handelURL, handelURL2) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        let ref = firebase.storage().ref().child("images/" + imageName);
        return ref.put(blob).then(snapshot => {
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
                handelURL(downloadURL)
                handelURL2(downloadURL)
            });
        })
    }

    const logout = () => {
        firebase.auth().signOut().then(() => {
            navigation.navigate('Login')
        })
    }

    return (
        <SafeAreaView style={{ backgroundColor: COLORS.lightGray4, flex: 1, }}>
            <View style={{ flexDirection: 'row', height: 50 }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{
                            width: '70%',
                            height: "100%",
                            backgroundColor: COLORS.lightGray3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>Trang cá nhân</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                    onPress={() => logout()}
                >
                    <Image
                        source={icons.logout}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                {/* ảnh bìa */}
                <Image
                    source={userData && userData['bgImage'] ? { uri: userData['bgImage'] } : images.image_blank}
                    style={styles.bgImage}
                />

                {/* avatar  */}
                <Image
                    source={userData && userData['avatar'] ? { uri: userData['avatar'] } : images.avatar_1}
                    style={styles.avatar}
                />

                {/* name */}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={styles.name}>{userData ? userData['name'] : ''}</Text>

                    {/* Edit Avatar and BgImage */}
                    <TouchableOpacity
                        style={{ marginLeft: 10 }}
                        onPress={() => setEditProfileImg(true)}
                    >
                        <LinearGradient
                            colors={[COLORS.primary, COLORS.primary]}
                            style={{ width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                            <Icon style={{}} name="pencil-outline" size={14} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* mô tả */}
                <Text style={styles.description}>
                    {userData ? userData['description'] : ''}
                </Text>

                {/* Location Address */}
                <View
                    style={{
                        marginTop: SIZES.padding,
                        flexDirection: 'row'
                    }}
                >
                    <Image
                        source={icons.location}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10
                        }}
                    />
                    <Text style={{ ...FONTS.body4 }}>{userData ? userData['address'] : ''}</Text>
                </View>

                {/* Menu */}
                <View
                    style={styles.menu}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={[styles.menuItem, mode == 'Post' ? styles.menuItemActive : '']}
                            onPress={() => changeMode('Post')}
                        >
                            <Image
                                source={icons.instagram}
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 5
                                }} />
                            <Text>Post</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, mode == 'Image' ? styles.menuItemActive : '']}
                            onPress={() => changeMode('Image')}
                        >
                            <Image
                                source={icons.image}
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 5
                                }} />
                            <Text>Image</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.menuItem, mode == 'User' ? styles.menuItemActive : '']}
                            onPress={() => changeMode('User')}
                        >
                            <Image
                                source={icons.user}
                                resizeMode="contain"
                                style={{
                                    width: 25,
                                    height: 25,
                                    marginRight: 5
                                }} />
                            <Text>User</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>

            <View style={{ marginTop: 10, backgroundColor: COLORS.lightGray4, flex: 1 }}>
                {/* POST */}
                {
                    mode == 'Post' &&
                    <Posts
                        navigation={navigation}
                        listPost={listPost}
                        setListPost={setListPost}
                        isMyPost={true}
                        getAll={false}
                        lastPost={lastPost}
                        setLastPost={setLastPost}
                    />
                }

                {/* Image */}
                <KeyboardAwareScrollView>
                    {
                        mode == 'Image' &&
                        listimages.map((image, index, arr) => {
                            if (index % 3 === 0) {
                                let tmpImage = arr.slice(index, index + 3)
                                return (
                                    <View
                                        style={{ display: 'flex', flexDirection: 'row', width: '100%', marginLeft: '2%', marginTop: 15 }}
                                        key={index}
                                    >
                                        {tmpImage.map(img =>
                                            <Image
                                                key={img}
                                                source={{ uri: img }}
                                                style={{
                                                    width: "30%",
                                                    height: 100,
                                                    marginHorizontal: '1%',
                                                    borderRadius: 20
                                                }}
                                            />
                                        )}
                                    </View>
                                )
                            }
                        })
                    }
                </KeyboardAwareScrollView>
            </View>

            {/* Modal Profile info */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={mode == 'User'}
                onRequestClose={() => {
                    setModal(!modal)
                }}
            >
                <View style={styles.modalView}>
                    <View style={{ backgroundColor: COLORS.white, }}>

                        <View
                            style={styles.menu}
                        >
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={[styles.menuItem, mode == 'Post' ? styles.menuItemActive : '']}
                                    onPress={() => changeMode('Post')}
                                >
                                    <Image
                                        source={icons.instagram}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: 5
                                        }} />
                                    <Text>Post</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, mode == 'Image' ? styles.menuItemActive : '']}
                                    onPress={() => changeMode('Image')}
                                >
                                    <Image
                                        source={icons.image}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: 5
                                        }} />
                                    <Text>Image</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.menuItem, mode == 'User' ? styles.menuItemActive : '']}
                                    onPress={() => changeMode('User')}
                                >
                                    <Image
                                        source={icons.user}
                                        resizeMode="contain"
                                        style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: 5
                                        }}
                                    />
                                    <Text>User</Text>
                                </TouchableOpacity>
                            </View>

                        </View>

                        <EditProfile
                            userData={userData}
                            getData={getData}
                        />

                    </View>
                </View>
            </Modal>

            {/* Modal edit avatar and bgimage */}
            {
                editProfileImg &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={editProfileImg}
                    onRequestClose={() => {
                        setEditProfileImg(!editProfileImg)
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={{ backgroundColor: COLORS.white, }}>
                            <TouchableOpacity style={[styles.menu, styles.border]} onPress={() => setAvatarFromLocal()}>
                                <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Chỉnh sửa ảnh đại diện</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menu, styles.border]} onPress={() => setBgImageFromLocal()}>
                                <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Chỉnh sửa ảnh bìa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.menu]} onPress={() => setEditProfileImg(false)}>
                                <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Hủy</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }
        </SafeAreaView>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        paddingHorizontal: 20,
        backgroundColor: COLORS.lightGray4
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 70,
        marginTop: -35,
        marginLeft: 25
    },
    bgImage: {
        width: "100%",
        height: 120,
        borderRadius: 10
    },
    name: {
        ...FONTS.h3,
        marginTop: 10,
    },
    description: {
        ...FONTS.body4,
        marginTop: 10,
        color: '#767676'
    },
    menu: {
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    menuItemActive: {
        borderBottomColor: COLORS.primary,
        borderBottomWidth: 2,
        paddingBottom: 10
    },
    modalView: {
        backgroundColor: COLORS.lightGray,
        paddingHorizontal: 10,
        paddingVertical: 15,
        color: COLORS.black,
        borderRadius: 20,
        shadowColor: COLORS.secondary,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        bottom: 0,
        position: 'absolute',
        width: '100%',
    },
    border: {
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 1
    },
})