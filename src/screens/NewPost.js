import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Modal,
    Alert,
    ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, images, SIZES, icons } from '../constants';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import firebase from '@react-native-firebase/app';

const NewPost = ({ navigation }) => {
    const [uidLogin, setUidLogin] = useState('')
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [cost, setCost] = useState('')
    const [catagory, setCatagory] = useState('')
    const [description, setDescription] = useState('')
    const [image, setImage] = useState(null)

    const [isChooseCata, setIsChooseCata] = useState(false)
    const [tmpCata, setTmpCata] = useState('')
    const [listCatagories, setListCatagories] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            //   if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
            //   }
        })();
    }, []);

    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (!user) return navigation.navigate('Login')
            let uidLogin = user['uid']
            setUidLogin(uidLogin)
        })
        getCatagories()
    }, [uidLogin])

    const getCatagories = () => {
        firebase.firestore()
            .collection('catagories')
            .onSnapshot(snaps => {
                if (snaps.docs.length > 0) {
                    setCatagory(0)
                    setListCatagories(snaps.docs.map(doc => {
                        return doc.data()
                    }))
                }
            })
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const onCreateNewPlace = async () => {
        if (!uidLogin) return Alert.alert('Vui lòng đăng nhập để sử dụng chức năng này')
        if (!listCatagories) return Alert.alert('Chưa có danh sách danh mục sản phẩm')

        if (!image || !name || !address || catagory < 0 || catagory == '' || !description || !cost)
            return Alert.alert('Vui lòng nhập đầy đủ thông tin cần thiết!')
        setLoading(true)

        const response = await fetch(image);
        const blob = await response.blob();

        let ref = firebase.storage().ref().child("images/" + 'IMG_' + Date.now());
        return ref.put(blob).then(snapshot => {
            snapshot.ref.getDownloadURL().then(function (downloadURL) {
                let newPlace = {
                    id: Date.now().toString(),
                    name: name,
                    image: downloadURL,
                    address: address,
                    lat: '',
                    long: '',
                    cost: cost,
                    catagory: listCatagories[catagory],
                    description: description,
                    countLike: 0,
                    rate: 5,
                    auth: uidLogin,
                    status: 'waiting'
                }

                firebase.firestore()
                    .collection('places')
                    .doc(newPlace[id])
                    .set(newPlace)
                    .then(res => {
                        navigation.navigate('Home')
                    })
                    .catch(err => {
                        setLoading(false)
                        Alert.alert(err)
                    })
                saveImageInfo(downloadURL)
            }).catch(err => {
                setLoading(false)
                Alert.alert(err)
            });
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
                setLoading(false)
            })
    }

    return (
        <SafeAreaView style={{ marginBottom: 50 }}>
            {/* Header */}
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
                        <Text style={{ ...FONTS.h3 }}>Thêm địa điểm</Text>
                    </View>
                </View>

                <View
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                ></View>
            </View>
            <KeyboardAwareScrollView>
                <View style={styles.container}>
                    {/* Image */}
                    <View style={{ height: 210, marginVertical: 20 }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            flex: 1
                        }}>
                            {
                                <Image
                                    source={image ? { uri: image } : images.image_blank}
                                    style={{
                                        width: "100%",
                                        height: 200,
                                        borderRadius: SIZES.radius
                                    }}
                                />
                            }
                            <TouchableOpacity
                                style={{ marginLeft: -30, marginTop: 13 }}
                                onPress={() => pickImage()}
                            >
                                <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={{ width: 30, height: 30, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                                    <Icon name="pencil-outline" size={18} color="#fff" />
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <Text style={styles.label}>Tên địa điểm</Text>
                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.input}
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        <Text style={styles.label}>Địa chỉ</Text>
                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.input}
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>

                        <Text style={styles.label}>Phí dịch vụ</Text>
                        <View style={styles.inputSection}>
                            <TextInput
                                style={styles.input}
                                value={cost}
                                onChangeText={setCost}
                                keyboardType="number-pad"
                            />
                        </View>

                        <Text style={styles.label}>Danh mục</Text>
                        <TouchableOpacity
                            onPress={() => setIsChooseCata(true)}
                        >
                            <View style={styles.inputSection}>
                                <Text style={styles.input}>
                                    {listCatagories && listCatagories[catagory] ? listCatagories[catagory]['name'] : ''}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {/* Modal picker catagory */}
                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isChooseCata}
                            onRequestClose={() => {
                                setIsChooseCata(!isChooseCata)
                            }}
                        >
                            <View style={styles.modalView}>
                                <View style={{ flexDirection: 'row', marginBottom: 20 }}>
                                    <TouchableOpacity
                                        style={styles.cancelButtonModal}
                                        onPress={() => {
                                            setTmpCata(catagory)
                                            setIsChooseCata(false)
                                        }}
                                    >
                                        <Text style={{ fontSize: 16 }}>Hủy</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.okButtonModal}
                                        onPress={() => {
                                            setCatagory(tmpCata)
                                            setIsChooseCata(false)
                                        }}
                                    >
                                        <Text style={{ fontSize: 16 }}>Ok</Text>
                                    </TouchableOpacity>
                                </View>
                                <Picker
                                    selectedValue={listCatagories && listCatagories[tmpCata] ? listCatagories[tmpCata]['id'] : ''}
                                    onValueChange={(itemValue, itemIndex) => setTmpCata(itemIndex)}
                                >
                                    {
                                        listCatagories &&
                                        listCatagories.map(cata =>
                                            <Picker.Item label={cata['name']} value={cata['id']} key={cata['id']} />
                                        )
                                    }
                                </Picker>
                            </View>
                        </Modal>

                        <Text style={styles.label}>Mô tả</Text>
                        <View style={[styles.textareaSection]}>
                            <TextInput
                                multiline={true}
                                numberOfLines={14}
                                style={styles.input}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>

                        {
                            !loading ?
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => onCreateNewPlace()}
                                >
                                    <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.gradient}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={styles.text}>
                                                Đăng bài
                                        </Text>
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>

                                :

                                <TouchableOpacity
                                    style={styles.button}
                                >
                                    <LinearGradient colors={[COLORS.primary, COLORS.primary]} style={styles.gradient}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <ActivityIndicator size='large' color='#fff' />
                                        </View>
                                    </LinearGradient>
                                </TouchableOpacity>
                        }
                    </View>
                </View>

            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

export default NewPost

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        marginBottom: 50,
        flex: 1
    },
    inputSection: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 5,
        height: 50,
        alignItems: 'center',
        width: '100%'
    },
    textareaSection: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginTop: 5,
        height: 100,
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
        ...FONTS.body3,
        width: '100%'
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
    },
    label: {
        ...FONTS.body3,
        marginTop: 20
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
    cancelButtonModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.darkgray,
        borderRadius: 10
    },
    okButtonModal: {
        position: 'absolute',
        top: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: COLORS.primary,
        borderRadius: 10
    }
})