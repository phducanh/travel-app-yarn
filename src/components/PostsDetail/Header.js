import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Modal, Alert } from 'react-native';
import { COLORS, FONTS, SIZES, icons } from '../../constants';
import firebase from '@react-native-firebase/app';

const Header = ({ navigation, postDataName, isMyPost, postId, postIdDoc }) => {
    const [menu, setMenu] = useState(false)

    const openMenu = () => {
        if (isMyPost && postId) {
            setMenu(true)
        }
    }

    const onFowardToEdit = () => {
        setMenu(false)
        navigation.navigate('EditPost', {
            postId: postId
        })
    }

    const onRemovePost = () => {
        if (!postIdDoc) Alert.alert('Không tìm thấy dữ liệu địa điểm!')
        firebase.firestore()
            .collection('places')
            .doc(postIdDoc)
            .update({
                status: 'removed'
            })
            .then(() => {
                navigation.navigate('Home')
            })
    }

    return (
        <View style={{ flexDirection: 'row' }}>
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

            {/* Name POST Section */}
            <View
                style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <View
                    style={{
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingHorizontal: SIZES.padding * 3,
                        borderRadius: SIZES.radius,
                        backgroundColor: COLORS.lightGray3
                    }}
                >
                    <Text style={{ ...FONTS.h3 }}>{postDataName}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 50,
                    paddingRight: SIZES.padding * 2,
                    justifyContent: 'center'
                }}
                onPress={() => openMenu()}
            >
                {isMyPost &&
                    <Image
                        source={icons.list}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                }
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={menu}
                onRequestClose={() => {
                    setIsChooseCata(!setMenu)
                }}
            >
                <View style={styles.modalView}>
                    <View style={{ backgroundColor: COLORS.white, }}>
                        <TouchableOpacity style={[styles.menu, styles.border]} onPress={() => onFowardToEdit()}>
                            <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Chỉnh sửa thông tin địa điểm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu, styles.border]} onPress={() => {
                            Alert.alert(
                                "Bạn có chắc muốn xóa địa điểm này?",
                                "Địa điểm này sẽ bị xóa nếu bạn xác nhận!",
                                [
                                    {
                                        text: "OK",
                                        onPress: () => onRemovePost(),
                                        style: "cancel"
                                    },
                                    {
                                        text: "Cancel",
                                        onPress: () => setMenu(false)
                                    },
                                ],
                                { cancelable: false }
                            )
                        }}>
                            <Text style={{ ...FONTS.body3, textAlign: 'center', color: 'red' }}>Xóa</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.menu]} onPress={() => setMenu(false)}>
                            <Text style={{ ...FONTS.body3, textAlign: 'center' }}>Hủy</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
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
    menu: {
        alignItems: 'center',
        paddingVertical: 10,
        width: '100%',
        borderBottomColor: '#F0F0F0',
        borderBottomWidth: 2,
    },
    border: {
        borderBottomColor: COLORS.lightGray,
        borderBottomWidth: 1
    },
})

export default Header