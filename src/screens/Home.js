import React, {useState, useEffect} from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import {COLORS} from '../constants';

import Catagory from '../components/Home/Catagory';
import Header from '../components/Home/Header';
import Posts from '../components/Home/Posts';

const Home = (props) => {
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [listPost, setListPost] = useState([])
    const [lastPost, setLastPost] = useState(null)

    return (
        <SafeAreaView style={styles.container}>
            <Header navigation={props.navigation}/>
            <Catagory
                setSelectedCategory={setSelectedCategory}
                selectedCategory={selectedCategory}
            />
            <Posts 
                navigation={props.navigation}
                listPost={listPost}
                setListPost={setListPost}
                lastPost={lastPost}
                setLastPost={setLastPost}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4
    }
})

export default Home