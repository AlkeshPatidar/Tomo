import React, { useEffect } from "react";
import { ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import { initializeTheme } from "../../redux/actions/themeActions";


const Splash = ({ navigation }) => {

    useEffect(() => {
        initializeTheme()
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