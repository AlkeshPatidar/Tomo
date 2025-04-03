import React, { useEffect, useState } from "react";
import { ActivityIndicator, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import { initializeTheme } from "../../redux/actions/themeActions";
import { apiGet, getItem } from "../../utils/Apis";
import { setUser } from "../../redux/reducer/user";
import { useDispatch } from "react-redux";
import urls from "../../config/urls";


const Splash = ({ navigation }) => {

    useEffect(() => {
        initializeTheme()
        fetchData()
    }, [])


    const dispatch = useDispatch()

    const [loading, setLoading] = useState(false)
    const fetchData = async () => {
        const token = await getItem('token');
        setLoading(true)
        if (token) {
            const getUserDetails = await apiGet(urls.userProfile)
            console.log(getUserDetails?.data, '---------------');
            dispatch(setUser(JSON.stringify(getUserDetails?.data)));
            navigation.navigate('Tab');
            setLoading(false)
        } else {
            navigation.replace('Onboarding')
            setLoading(false)
        }


    }





    return (
        <ImageBackground source={IMG.Splash} style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <ActivityIndicator
                color={'white'}
                size='large'
                style={{
                    position: 'absolute',
                    bottom: 40,
                    alignSelf:'center'
                }}
            />
        </ImageBackground>
    )
}

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})