import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView, StyleSheet, View, TouchableOpacity, TextInput, Dimensions, Alert, Image, Text } from 'react-native';
import { COLORS, FONTS, SIZES, icons, images } from '../constants';
import firebase from '@react-native-firebase/app';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Icon from 'react-native-vector-icons/Ionicons';

import Header from '../components/PostsDetail/Header';
import Postinfo from '../components/PostsDetail/PostInfo';

const windowHeight = Dimensions.get('window').height;

const PostsDetail = ({ navigation, route }) => {
    const [uidLogin, setUidLogin] = useState('')
    const [uidLoginData, setUIdLoginData] = useState(null)
    const [authData, setAuthData] = useState(null)
    const [postData, setPostData] = useState(route.params.postData)
    const [isLike, setIsLike] = useState(false)
    const [cmtValue, setCmtValue] = useState('')
    const [allCmt, setAllCmt] = useState([])

    const cmtRef = useRef();

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        checkIsLike()
    }, [uidLogin])

    useEffect(() => {
        if (!uidLogin) return
        firebase.firestore()
            .collection('users')
            .doc(uidLogin)
            .onSnapshot(doc => {
                if (doc && doc.data())
                    setUIdLoginData(doc.data())
            })
    }, [uidLogin])

    useEffect(() => {
        setPostData(route.params.postData)
    }, [route.params.postData])

    useEffect(() => {
        if (!postData) return
        // get auth data
        if (postData['auth']) {
            firebase.firestore()
                .collection('users')
                .where('id', '==', postData['auth'])
                .onSnapshot(snaps => {
                    if (snaps.docs.length > 0) {
                        snaps.docs.forEach(doc => {
                            if (doc.id == postData['auth'])
                                setAuthData(doc.data())
                        })
                    }
                })
        }
        getComment()
    }, [postData])

    const checkIsLike = () => {
        //check is liked
        if (!postData || postData['countLike'] == 0 || !uidLogin) return
        firebase.firestore()
            .collection('likes')
            .where('uid', '==', uidLogin)
            .where('listPost', 'array-contains-any', [postData['id']])
            .onSnapshot(snaps => {
                if (snaps.docs.length > 0)
                    setIsLike(true)
            })
    }

    const onComment = () => {
        if (!postData) return Alert.alert('Không tìm thấy dữ liệu bài viết!')
        if (!uidLogin) return Alert.alert('Vui lòng đăng nhập để thực hiện chức năng này!')
        if (!uidLoginData) return Alert.alert('Vui lòng đăng nhập để thực hiện chức năng này!')

        let now = Date.now()
        let newCmt = {
            id: now.toString(),
            isActive: false,
            uid: uidLogin,
            postId: postData['id'],
            content: cmtValue,
            uidName: uidLoginData['name'],
            uidAvatar: uidLoginData['avatar']
        }

        firebase.firestore()
            .collection('comments')
            .doc(now.toString())
            .set(newCmt)
            .then(() => {
                setCmtValue('')
                setAllCmt([
                    ...allCmt,
                    newCmt
                ])
            })
    }

    const getComment = () => {
        if (!postData) return;
        firebase.firestore()
            .collection('comments')
            .where('postId', '==', postData['id'])
            .onSnapshot(snaps => {
                let allCmt = snaps.docs.map(doc => {
                    return doc.data()
                })
                setAllCmt(allCmt)
            })
    }

    const openCmtInput = () => {
        cmtRef.current.focus()
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header
                navigation={navigation}
                postDataName={postData ? postData['name'] : 'POST NAME'}
                isMyPost={postData && uidLogin ? (postData['auth'] == uidLogin) : false}
                postId={postData ? postData['id'] : ''}
                postIdDoc={postData ? postData['idDoc'] : ''}
            />

            <KeyboardAwareScrollView style={styles.content}>
                <View style={{ height: windowHeight * 0.86 }}>
                    <View style={{ paddingHorizontal: 10, }}>
                        <Postinfo
                            postData={postData}
                            authData={authData}
                            isLike={isLike}
                            uidLogin={uidLogin}
                            setIsLike={setIsLike}
                            listCmt={allCmt}
                            onOpenCmt={openCmtInput}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <View style={styles.cmtInput}>
                            <Icon style={styles.inputIcon} name="chatbox-outline" size={20} color={COLORS.primary} />
                            <TextInput
                                style={{ ...FONTS.body3, width: '100%', paddingLeft: 10 }}
                                placeholder="Bình luận"
                                value={cmtValue}
                                onChangeText={setCmtValue}
                                ref={cmtRef}
                            />
                            <TouchableOpacity
                                style={{ right: 20, position: 'absolute' }}
                                onPress={() => onComment()}
                            >
                                <Icon style={{}} name="send-outline" size={25} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default PostsDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray2
    },
    content: {
        paddingTop: 20,
        backgroundColor: COLORS.white,
        borderTopRightRadius: 30,
        borderTopLeftRadius: 30,
        marginTop: 10,
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingBottom: 20,
        backgroundColor: COLORS.gray,
        // marginTop: 5,
        height: 60,
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        width: '100%'
    },
    cmtInput: {
        backgroundColor: COLORS.white,
        width: '110%',
        marginLeft: '-5%',
        paddingHorizontal: '5%',
        paddingVertical: 10,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 20
    },
})