import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';

import { useSelector } from 'react-redux';
// import { BackIcon } from '../assets/SVGs';
// import SpaceBetweenRow from '../components/wrapper/spacebetween';
// import CustomText from '../components/TextComponent';
// import { FONTS_FAMILY } from '../assets/Fonts';
import SpaceBetweenRow from '../../components/wrapper/spacebetween';
import { BackIcon, PrimaryBackArrow, PrimaryBackWhite } from '../../assets/SVGs';
import { FONTS_FAMILY } from '../../assets/Fonts';
import CustomText from '../../components/TextComponent';

const TermsAndConditions = ({ navigation }) => {
  const { isDarkMode } = useSelector(state => state.theme);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
    },
    headerContainer: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingTop: 50,
      paddingBottom: 15,
    },
    contentContainer: {
      padding: 16,
      backgroundColor: isDarkMode ? '#121212' : 'white',
      margin: 8,
      borderRadius: 8,
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginLeft: 10,
    },
    title: {
      fontSize: 24,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginTop: 20,
      marginBottom: 10,
    },
    paragraph: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#e4e6eb' : '#050505',
      lineHeight: 24,
      marginBottom: 16,
    },
    bullet: {
      flexDirection: 'row',
      marginBottom: 8,
      paddingLeft: 16,
    },
    bulletDot: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? '#e4e6eb' : '#050505',
      marginRight: 8,
    },
    bulletText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#e4e6eb' : '#050505',
      lineHeight: 24,
      flex: 1,
    },
    highlightText: {
      fontFamily: FONTS_FAMILY.SourceSans3_SemiBold,
      color: isDarkMode ? '#1877f2' : '#1877f2',
    },
    divider: {
      height: 1,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      marginVertical: 20,
    },
    lastUpdated: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 10,
    },
  });

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              {isDarkMode ? <PrimaryBackWhite /> : <PrimaryBackArrow />}
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>Terms & Conditions</CustomText>
          </View>
        </SpaceBetweenRow>
      </View>
    );
  };

  const renderBulletPoint = (text) => {
    return (
      <View style={styles.bullet}>
        <CustomText style={styles.bulletDot}>•</CustomText>
        <CustomText style={styles.bulletText}>{text}</CustomText>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar
        translucent={true}
        backgroundColor="transparent"
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      
      {renderHeader()}
      
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          <CustomText style={styles.title}>Terms & Conditions</CustomText>
          
          <CustomText style={styles.paragraph}>
            This Terms & Conditions describes how your personal information is collected, used, and shared when you use our mobile application ("App").
          </CustomText>

          <CustomText style={styles.sectionTitle}>Information We Collect</CustomText>
          <CustomText style={styles.paragraph}>
            When you use our App, we collect several types of information from and about you, including:
          </CustomText>
          
          {renderBulletPoint("Personal information you provide directly, such as your name, email address, phone number, and profile picture when you register for an account.")}
          {renderBulletPoint("Information about your interactions with the App, including marketplace listings you view or create, messages you send, and transactions you complete.")}
          {renderBulletPoint("Device information, including your mobile device's model, operating system, unique device identifiers, IP address, mobile network information, and mobile device settings.")}
          {renderBulletPoint("Location information when you allow the App to access your device's location services.")}
          
          <CustomText style={styles.sectionTitle}>How We Use Your Information</CustomText>
          <CustomText style={styles.paragraph}>
            We use the information we collect to:
          </CustomText>
          
          {renderBulletPoint("Provide, maintain, and improve the App's functionality and user experience.")}
          {renderBulletPoint("Process and facilitate transactions between users in our marketplace.")}
          {renderBulletPoint("Connect you with other users through messaging and recommendations.")}
          {renderBulletPoint("Personalize your experience and deliver content and product suggestions that may interest you.")}
          {renderBulletPoint("Monitor and analyze usage patterns and trends to enhance our service.")}
          {renderBulletPoint("Detect, investigate, and prevent fraudulent transactions and other illegal activities.")}
          {renderBulletPoint("Communicate with you about updates, security alerts, and support messages.")}
          
          <CustomText style={styles.sectionTitle}>Sharing Your Information</CustomText>
          <CustomText style={styles.paragraph}>
            We may share your information in the following circumstances:
          </CustomText>
          
          {renderBulletPoint("With other users when you create marketplace listings or communicate with them through our messaging feature.")}
          {renderBulletPoint("With service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.")}
          {renderBulletPoint("To comply with applicable laws, regulations, or legal processes.")}
          {renderBulletPoint("In connection with a merger, sale of company assets, financing, or acquisition of all or a portion of our business.")}
          {renderBulletPoint("With your consent or at your direction.")}
          
          <CustomText style={styles.sectionTitle}>Data Security</CustomText>
          <CustomText style={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect the security of your personal information. However, please note that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </CustomText>
          
          <CustomText style={styles.sectionTitle}>Your Choices</CustomText>
          <CustomText style={styles.paragraph}>
            You can access, update, or delete your account information at any time through the App's settings. You may also:
          </CustomText>
          
          {renderBulletPoint("Adjust your notification preferences within the App.")}
          {renderBulletPoint("Control location tracking by changing your device settings.")}
          {renderBulletPoint("Opt out of receiving promotional communications from us.")}
          
          <CustomText style={styles.paragraph}>
            If you wish to delete your account entirely, please contact our support team at <CustomText style={styles.highlightText}>support@marketplace.com</CustomText>
          </CustomText>
          
          <View style={styles.divider} />
          
          <CustomText style={styles.sectionTitle}>Children's Privacy</CustomText>
          <CustomText style={styles.paragraph}>
            Our App is not intended for children under 13 years of age, and we do not knowingly collect personal information from children under 13. If we learn we have collected or received personal information from a child under 13 without verification of parental consent, we will delete that information.
          </CustomText>
          
          <CustomText style={styles.sectionTitle}>Changes to This Privacy Policy</CustomText>
          <CustomText style={styles.paragraph}>
            We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated Privacy Policy within the App or by other appropriate means.
          </CustomText>
          
          <CustomText style={styles.sectionTitle}>Contact Us</CustomText>
          <CustomText style={styles.paragraph}>
            If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
          </CustomText>
          
          <CustomText style={styles.paragraph}>
            <CustomText style={styles.highlightText}>terms@tomo.com</CustomText>
          </CustomText>
          
          <CustomText style={styles.lastUpdated}>
            Last Updated: May 10, 2025
          </CustomText>
        </View>
      </ScrollView>
    </View>
  );
};

export default TermsAndConditions;