import React from 'react'
import { createStackNavigator } from "@react-navigation/stack";

import BottomTabNavigator from './bottomTabNavigator';
import Login from '../screens/Login';
import Signup from '../screens/Signup';
import PostsDetail from '../screens/PostsDetail';
import NewPost from '../screens/NewPost';
import EditPost from '../screens/EditPost';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
            initialRouteName={'Login'}
        >
            <Stack.Screen name="Home" component={BottomTabNavigator} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Signup" component={Signup} />
            <Stack.Screen name="PostsDetail" component={PostsDetail} />
            <Stack.Screen name="NewPost" component={NewPost} />
            <Stack.Screen name="EditPost" component={EditPost} />
        </Stack.Navigator>
    )
}

export default StackNavigator;