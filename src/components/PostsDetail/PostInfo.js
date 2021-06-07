import React from 'react';
import { Animated, View, Image, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SIZES, COLORS, FONTS, icons, images } from '../../constants';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app';

const PostInfo = ({ postData, authData, isLike, uidLogin, setIsLike, listCmt, onOpenCmt }) => {

    const onLike = () => {
        firebase.firestore()
            .collection('likes')
            .where('uid', '==', uidLogin)
            .get()
            .then(querySnapshot => {
                let isNew = true
                querySnapshot.forEach((doc) => {
                    if (doc.data()['uid'] == uidLogin) {
                        isNew = false
                        return toogleLikeAPost(doc.id)
                    }
                });
                if (isNew) {
                    return toogleLikeAPost()
                }
            })
    }

    const toogleLikeAPost = (docId) => {
        let refLike = firebase.firestore().collection('likes').doc(docId)
        let refPost = firebase.firestore().collection('places').doc(postData['idDoc'])

        firebase.firestore().runTransaction(async transaction => {
            const likeDoc = await transaction.get(refLike)
            const postDoc = await transaction.get(refPost)

            if (!postDoc.exists) return Alert.alert('Địa điểm không tồn tại!')

            if (!likeDoc.exists) {
                transaction.set(refLike, { uid: uidLogin, listPost: [postData['id']] });
                transaction.update(refPost, {
                    countLike: 1
                })
                setIsLike(true)
                return Promise.resolve();
            }

            let countLike = postDoc.data()['countLike']
            const caculateLike = isLike ? countLike - 1 : countLike + 1
            // console.log(caculateLike)
            transaction.update(refLike, {
                listPost: isLike ?
                    firebase.firestore.FieldValue.arrayRemove(postData['id']) :
                    firebase.firestore.FieldValue.arrayUnion(postData['id'])
            })
            transaction.update(refPost, {
                countLike: caculateLike < 0 ? 0 : caculateLike
            })
            setIsLike(!isLike)
            return Promise.resolve();
        })
            .catch(err => {
                Alert.alert(err)
            })
    }

    return (
        <View
            style={{
                paddingHorizontal: 20
            }}
        >

            <ScrollView
                showsVerticalScrollIndicator={false}
            >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={authData && authData['avatar'] ? { uri: authData['avatar'] } : images.avatar_1}
                        style={styles.avatar}
                    />
                    <Text style={{ ...FONTS.h2 }}>{authData ? authData['name'] : ''}</Text>
                </View>

                {/* Description */}
                <Text style={{ marginTop: 20, color: '#767676' }}>
                    {postData['description']}
                </Text>

                {/* Image */}
                <View
                    style={{
                        marginBottom: 3 * SIZES.padding,
                        paddingTop: 20
                    }}
                >
                    <Image
                        source={postData && postData.image ? { uri: postData.image } : icons.image}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* Name */}
                    <Text style={{ ...FONTS.h3 }}>{postData.name}</Text>
                    <TouchableOpacity style={{ marginLeft: 10 }}>
                        <Icon name="navigate" size={30} color={COLORS.primary} />
                    </TouchableOpacity>
                </View>

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
                    <Text style={{ ...FONTS.body4 }}>{postData['address']}</Text>
                </View>

                {/* Price */}
                <View style={styles.textBg}>
                    <Text style={styles.text}>
                        {postData['cost'] + ' VNĐ'}
                    </Text>
                </View>

                {/* menu bar */}
                <View style={styles.menuBar}>
                    <TouchableOpacity style={styles.menuButton} onPress={() => onLike()}>
                        <Icon style={{ marginRight: 5 }} name={isLike ? "heart" : 'heart-outline'} size={20} color={COLORS.primary} />
                        <Text>Thích</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton}>
                        <Icon style={{ marginRight: 5 }} name="star-outline" size={20} color={COLORS.primary} />
                        <Text>Đánh giá</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.menuButton} onPress={() => onOpenCmt()}>
                        <Icon style={{ marginRight: 5 }} name="chatbox-ellipses-outline" size={20} color={COLORS.primary} />
                        <Text>Bình luận</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ marginTop: 10, marginBottom: 50 }}>
                    {
                        listCmt.map(cmt =>
                            <View
                                key={cmt['id']}
                                style={{ marginBottom: 10 }}
                            >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Image
                                        source={cmt['uidAvatar'] ? { uri: cmt['uidAvatar'] } : images.avatar_1}
                                        style={styles.avatar}
                                    />
                                    <View style={{ backgroundColor: COLORS.darkgray, padding: 5, borderRadius: 10 }}>
                                        <Text style={{ ...FONTS.body3, color: 'black' }}>{cmt['uidName']}</Text>
                                        <Text>{cmt['content']}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                </View>
                <View style={{ paddingBottom: 50 }}></View>
            </ScrollView>
        </View>
    )
}

export default PostInfo

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
    },
    gradient: {
        flex: 1,
        borderRadius: 10,
        width: 'auto'
    },
    textBg: {
        alignSelf: 'flex-start',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        marginVertical: 20
    },
    text: {
        ...FONTS.body4,
        color: 'white',
    },
    menuBar: {
        flexDirection: 'row',
        borderBottomColor: COLORS.darkgray,
        borderBottomWidth: 1,
        borderTopColor: COLORS.darkgray,
        borderTopWidth: 1,
        paddingVertical: 10
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '33%',
        paddingHorizontal: 10,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginRight: 20
    },
})