import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { FONTS, SIZES, icons, COLORS } from '../../constants';
import firebase from '@react-native-firebase/app';

const Catagory = ({ setSelectedCategory, selectedCategory }) => {
    const [uidLogin, setUidLogin] = useState('')
    const [listCatagories, setListCatagories] = useState([])

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        getListcata()
    }, [uidLogin])

    const getListcata = () => {
        firebase.firestore()
            .collection('catagories')
            .onSnapshot(snaps => {
                let tmpList = snaps.docs.map(doc => {
                    return doc.data()
                })
                setListCatagories([
                    {
                        id: 'all',
                        name: 'Tất cả',
                        image: icons.world
                    },
                    ...tmpList
                ])
            })
    }

    const onSelectCategory = (value) => {
        setSelectedCategory(value)
    }

    const renderItem = ({ item }) => {
        return (
            <TouchableOpacity
                style={{
                    padding: SIZES.padding,
                    paddingBottom: SIZES.padding * 2,
                    backgroundColor: (selectedCategory == item.id) ? COLORS.primary : COLORS.white,
                    borderRadius: SIZES.radius,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: SIZES.padding,
                    ...styles.shadow,
                    width: 75
                }}
                onPress={() => onSelectCategory(item.id)}
            >
                <View
                    style={{
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.lightGray
                    }}
                >
                    <Image
                        source={item.id == 'all' ? item.image : { uri: item.image }}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </View>

                <Text
                    style={{
                        marginTop: SIZES.padding,
                        textAlign: 'center',
                        color: (selectedCategory?.id == item.id) ? COLORS.white : COLORS.black,
                        ...FONTS.body5
                    }}
                >
                    {item.name}
                </Text>
            </TouchableOpacity>
        )
    }

    return (
        <View style={{ padding: SIZES.padding * 2 }}>
            <Text style={{ ...FONTS.h1 }}>Main</Text>
            <Text style={{ ...FONTS.h1 }}>Categories</Text>

            <FlatList
                data={listCatagories}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
            />
        </View>
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


export default Catagory;