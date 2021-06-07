import React, { useState } from 'react';
import { View, TouchableOpacity, Image, Text} from 'react-native';
import { icons, SIZES, COLORS, FONTS } from '../../constants';

const initialCurrentLocation = {
    streetName: "Kuching",
    gps: {
        latitude: 1.5496614931250685,
        longitude: 110.36381866919922
    }
}

const Header = ({navigation}) => {
    const [currentLocation, setCurrentLocation] = useState(initialCurrentLocation)

    return (
        <View style={{ flexDirection: 'row', height: 50 }}>
            <TouchableOpacity
                style={{
                    width: 50,
                    paddingLeft: SIZES.padding * 2,
                    justifyContent: 'center'
                }}
            >
                <Image
                    source={icons.nearby}
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
                    <Text style={{ ...FONTS.h3 }}>{currentLocation.streetName}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={{
                    width: 50,
                    paddingRight: SIZES.padding * 2,
                    justifyContent: 'center'
                }}
                onPress={() => navigation.navigate('NewPost')}
            >
                <Image
                    source={icons.plus}
                    resizeMode="contain"
                    style={{
                        width: 30,
                        height: 30
                    }}
                />
            </TouchableOpacity>
        </View>
    )
}

export default Header