// import React, { useEffect, useState } from "react";
// import { ActivityIndicator, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
// import CustomText from "../../components/TextComponent";
// import IMG from "../../assets/Images";
// import { initializeTheme } from "../../redux/actions/themeActions";
// import { apiGet, apiPut, getItem } from "../../utils/Apis";
// import { setUser } from "../../redux/reducer/user";
// import { useDispatch } from "react-redux";
// import urls from "../../config/urls";


// const Splash = ({ navigation }) => {

//     useEffect(() => {
//         initializeTheme()
//         fetchData()
//         updateLocation()
//     }, [])




//     const dispatch = useDispatch()

//     const [loading, setLoading] = useState(false)
//     const fetchData = async () => {
//         const token = await getItem('token');
//         setLoading(true)
//         if (token) {
//             const getUserDetails = await apiGet(urls.userProfile)
//             // console.log(getUserDetails?.data, '---------------');
//             dispatch(setUser(JSON.stringify(getUserDetails?.data)));
//             navigation.navigate('Tab');
//             setLoading(false)
//         } else {
//             navigation.replace('Onboarding')
//             setLoading(false)
//         }
//     }

//     const updateLocation = async () => {
//         const token = await getItem('token');
//         const data = {
//             "Location": {
//                 "type": "Point",
//                 "coordinates": [
//                     75.8577,
//                     22.7196
//                 ]
//             }
//         }
//         if (token) {
//             const update = await apiPut(urls.updateLocation, data)
//             console.log(update);
            

//         }


//     }





//     return (
//         <ImageBackground source={IMG.Splash} style={styles.container}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle="light-content"
//             />
//             <ActivityIndicator
//                 color={'white'}
//                 size='large'
//                 style={{
//                     position: 'absolute',
//                     bottom: 40,
//                     alignSelf: 'center'
//                 }}
//             />
//         </ImageBackground>
//     )
// }

// export default Splash;

// const styles = StyleSheet.create({
//     container: {
//         flex: 1
//     }
// })


import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, ImageBackground, StatusBar, StyleSheet, View } from "react-native";
import CustomText from "../../components/TextComponent";
import IMG from "../../assets/Images";
import { initializeTheme } from "../../redux/actions/themeActions";
import { apiGet, apiPut, getItem } from "../../utils/Apis";
import { setUser } from "../../redux/reducer/user";
import { useDispatch } from "react-redux";
import urls from "../../config/urls";
import { ToastMsg } from "../../utils/helperFunctions";
import ReactNativeBiometrics from 'react-native-biometrics';

const Splash = ({ navigation }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const rnBiometrics = new ReactNativeBiometrics();

    useEffect(() => {
        initializeTheme();
        fetchData();
        updateLocation();
    }, []);

    const verifyBiometricBeforeLogin = async () => {
        try {
            const biometricEnabled = await getItem('user_biometric_enabled');
            console.log('Biometric enabled:', biometricEnabled);
            
            if (biometricEnabled !== 'true') {
                console.log('Biometric not enabled, skipping verification');
                return true;
            }

            const { available, biometryType } = await rnBiometrics.isSensorAvailable();
            console.log('Biometric sensor available:', available, 'Type:', biometryType);
            
            if (!available) {
                console.log('Biometric sensor not available');
                return true;
            }

            console.log('Showing biometric prompt...');
            const { success, error } = await rnBiometrics.simplePrompt({
                promptMessage: 'Place your finger on the sensor to access your account',
                cancelButtonText: 'Cancel',
            });

            console.log('Biometric result:', { success, error });

            if (success) {
                console.log('Biometric authentication successful');
                return true;
            } else {
                console.log('Biometric authentication failed:', error);
                ToastMsg(error || 'Biometric authentication failed');
                navigation.replace('Onboarding');
                return false;
            }
        } catch (error) {
            console.log('Biometric verification error:', error);
            return true; // Allow login if biometric fails due to error
        }
    };

    const navigateToUserDashboard = async (userData) => {
        // Add a small delay to ensure UI is ready
        setTimeout(async () => {
            const biometricVerified = await verifyBiometricBeforeLogin();

            if (!biometricVerified) {
                return;
            }

            dispatch(setUser(JSON.stringify(userData)));
            ToastMsg('Successfully logged in');
            navigation.navigate('Tab');
        }, 1000); // 1 second delay
    };

    const fetchData = async () => {
        const token = await getItem('token');
        setLoading(true);
        
        try {
            if (token) {
                const getUserDetails = await apiGet(urls.userProfile);
                // console.log(getUserDetails?.data, '---------------');
                
                if (getUserDetails?.statusCode === 200 || getUserDetails?.data) {
                    await navigateToUserDashboard(getUserDetails?.data);
                } else {
                    navigation.replace('Onboarding');
                }
                setLoading(false);
            } else {
                navigation.replace('Onboarding');
                setLoading(false);
            }
        } catch (error) {
            console.log('Fetch data error:', error);
            navigation.replace('Onboarding');
            setLoading(false);
        }
    };

    const updateLocation = async () => {
        const token = await getItem('token');
        const data = {
            "Location": {
                "type": "Point",
                "coordinates": [
                    75.8577,
                    22.7196
                ]
            }
        };
        
        if (token) {
            try {
                const update = await apiPut(urls.updateLocation, data);
                console.log(update);
            } catch (error) {
                console.log('Update location error:', error);
            }
        }
    };

    return (
        <ImageBackground source={IMG.Splash} style={styles.container}>
            <StatusBar
                translucent={true}
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <Image
            source={IMG.FinalLogo}
            style={{
                width: '60%',
                height: '30%',
                // resizeMode: 'contain',
                borderRadius: 20,
                // position: 'absolute',
                // top: 0,
                // left: 0,
                alignSelf: 'center',
            }}
            />
            <ActivityIndicator
                color={'white'}
                size='large'
                style={{
                    position: 'absolute',
                    bottom: 40,
                    alignSelf: 'center'
                }}
            />
        </ImageBackground>
    );
};

export default Splash;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:'center'
    }
});