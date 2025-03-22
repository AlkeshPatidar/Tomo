import React, { useEffect } from "react";
import { ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";


const Splash = ({ navigation }) => {

    useEffect(() => {
        setTimeout(() => {
          navigation.navigate('Onboarding')
        }, 3000)
      }, [])

    return (
        <ImageBackground source={IMG.Splash} style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
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