import React, { useState, useEffect } from 'react';
import { FlatList, View, TouchableOpacity, Image, Text, StyleSheet, Alert } from 'react-native';
import firebase from '@react-native-firebase/app';
import { SIZES, COLORS, FONTS, icons } from '../../constants';
import { LinearGradient } from 'expo-linear-gradient';

const ManageMyPost = ({ navigation, mode = '' }) => {
    const [listPost, setListPost] = useState([])
    const [uidLogin, setUidLogin] = useState('')
    const [lastPost, setLastPost] = useState(null)

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        getAllListPost()
    }, [uidLogin])

    const getAllListPost = () => {
        if (!uidLogin) return

        if (!lastPost) {
            firebase.firestore()
                .collection('places')
                .where('status', '==', mode)
                .where('auth', '==', uidLogin)
                .limit(1)
                .onSnapshot(snaps => {
                    setLastPost(snaps.docs[snaps.docs.length - 1])
                    let tmpList = snaps.docs.map(doc => {
                        return {
                            idDoc: doc.id,
                            ...doc.data()
                        }
                    })
                    setListPost(tmpList)
                })
        } else {
            firebase.firestore()
                .collection('places')
                .where('status', '==', mode)
                .where('auth', '==', uidLogin)
                .startAfter(lastPost)
                .limit(1)
                .onSnapshot(snaps => {
                    if (snaps.docs.length > 0) {
                        setLastPost(snaps.docs[snaps.docs.length - 1])
                    }
                    let tmpList = snaps.docs.map(doc => {
                        return {
                            idDoc: doc.id,
                            ...doc.data()
                        }
                    })
                    setListPost([
                        ...listPost,
                        ...tmpList
                    ])
                })
        }
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={{ marginBottom: SIZES.padding * 2 }}
            onPress={() => navigation.navigate("PostsDetail", {
                postData: item
            })}
        >
            {/* Image */}
            <View
                style={{
                    marginBottom: SIZES.padding
                }}
            >
                <Image
                    source={item && item.image ? { uri: item.image } : icons.image}
                    resizeMode="cover"
                    style={{
                        width: "100%",
                        height: 200,
                        borderRadius: SIZES.radius
                    }}
                />

                <View
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        height: 50,
                        width: SIZES.width * 0.3,
                        backgroundColor: COLORS.white,
                        borderTopRightRadius: SIZES.radius,
                        borderBottomLeftRadius: SIZES.radius,
                        alignItems: 'center',
                        justifyContent: 'center',
                        ...styles.shadow
                    }}
                >
                    <Text style={{ ...FONTS.h4 }}>{item.cost + ' VNĐ'}</Text>
                </View>
            </View>

            {/* Restaurant Info */}
            <Text style={{ ...FONTS.body2 }}>{item.name}</Text>

            <View
                style={{
                    marginTop: SIZES.padding,
                    flexDirection: 'row',
                    alignItems: 'center'
                }}
            >

                {/* Categories */}
                <View
                    style={{
                        flexDirection: 'row',
                        marginLeft: 5
                    }}
                >
                    <View
                        style={{ flexDirection: 'row' }}
                    >
                        {/* <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text> */}
                        <Text style={{ ...FONTS.body3 }}>{item.catagory['name']}</Text>
                        <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text>
                    </View>

                </View>
                {/* Rating */}
                <Text style={{ ...FONTS.body3 }}>{item.rate}</Text>
                <Image
                    source={icons.star}
                    style={{
                        height: 20,
                        width: 20,
                        tintColor: COLORS.primary,
                        marginLeft: 5
                    }}
                />
            </View>
            {
                listPost.indexOf(item) == listPost.length - 1 &&
                <View>
                    <TouchableOpacity
                        style={{
                            width: '40%',
                            marginLeft: '30%',
                            marginBottom: 20,
                            marginTop: 50
                        }}
                        onPress={() => getAllListPost()}
                    >
                        <LinearGradient colors={[COLORS.primary, COLORS.primary]}
                            style={{
                                paddingVertical: 10,
                                backgroundColor: COLORS.white,
                                borderRadius: 20,
                                alignItems: 'center',
                            }}
                        >
                            <Text style={{ ...FONTS.body3, color: COLORS.white }}>Xem thêm</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            }
        </TouchableOpacity>
    )

    return (
        <FlatList
            data={listPost}
            keyExtractor={item => `${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={{
                paddingHorizontal: SIZES.padding * 2,
                paddingBottom: 30
            }}
        />
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})

export default ManageMyPost;