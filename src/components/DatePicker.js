import React, {useState} from 'react';
import {View, Text, TouchableOpacity, Platform, Modal, Pressable, StyleSheet} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS } from '../constants';
import moment from 'moment';
import { Menu } from 'react-native-paper';

const DatePicker = (props) => {
    const [show, setShow] = useState(false);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || props.model;
        setShow(Platform.OS === 'ios');
        props.setDate(currentDate)
    };

    const showMode = () => {
        setShow(true);
    };

    return (
        <View style={{
            marginVertical: 10,
            marginLeft: 7,
            marginTop: 20
        }}>

            {/* Modal date picker */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={show}
                onRequestClose={() => {
                    setShow(!show);
                }}
            >
                <View style={styles.modalView}>
                    <DateTimePicker
                        testID="dateTimePicker"
                        value={props.model}
                        mode={'date'}
                        is24Hour={true}
                        display="spinner"
                        onChange={onChange}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        textColor={COLORS.black}
                    />
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Pressable
                            style={[styles.button, styles.buttonClose, {width: '50%'}]}
                            onPress={() => setShow(!show)}
                            >
                            <Text style={styles.textStyle}>Cancel</Text>
                        </Pressable>
                        <TouchableOpacity
                            onPress={() => setShow(!show)}
                            style={{width: '50%'}}
                        >
                            <LinearGradient
                                style={[styles.button, styles.buttonOK]}
                                colors={[COLORS.primary, COLORS.primary, COLORS.primary]}
                            >
                                <Text style={styles.textStyle}>OK</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            
            {/* label */}
            <Text style={{
                fontSize: 18,
                marginBottom: 10
            }}> {props.label}</Text>
            
            {/* Date value */}
            <View style={styles.textSession}>
                <TouchableOpacity 
                    onPress={showMode}
                    disabled={props.disabled ? props.disabled : false}
                    disabled={props.disabled}
                >
                    <LinearGradient
                        style={{width: 30, height: 30,borderRadius: 5, alignItems: 'center', justifyContent: 'center'}}
                        colors={[COLORS.primary, COLORS.primary, COLORS.primary]}
                    >
                        <Icon style={{}} name="calendar-outline" size={18} color="#fff"/>
                    </LinearGradient>
                </TouchableOpacity>
                <Text style={{
                    fontSize: 16,
                    paddingLeft: 20
                }}>{props.model != '' ? moment(props.model).format('YYYY/MM/DD') : 'YYYY/MM/DD'}</Text>
                
            </View>
        </View>
    );
};

export default DatePicker

const styles = StyleSheet.create({
    modalView: {
        backgroundColor: COLORS.white,
        color: COLORS.black,
        borderRadius: 20,
        padding: 35,
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
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonClose: {
        backgroundColor: COLORS.darkgray,
    },
    buttonOK: {
        backgroundColor: COLORS.primary,
    },
    textStyle: {
        color: COLORS.white,
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
    textSession: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingLeft: 10,
        backgroundColor: COLORS.white,
        borderRadius: 40
    }
});