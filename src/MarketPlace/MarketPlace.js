// import React from 'react';
// import { View, TextInput, FlatList, Image, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';

// import { useSelector } from 'react-redux';
// import { BackIcon, BackOuterWhite, CameraButton, Mic, NotiFication, Search } from '../assets/SVGs';
// import SpaceBetweenRow from '../components/wrapper/spacebetween';
// import CustomText from '../components/TextComponent';
// import { FONTS_FAMILY } from '../assets/Fonts';

// const searchData = [
//     { id: '1', image: 'https://picsum.photos/id/237/200/300' },
//     { id: '2', image: 'https://picsum.photos/seed/picsum/200/300' },
//     { id: '3', image: 'https://picsum.photos/200/300?grayscale' },
//     { id: '4', image: 'https://picsum.photos/200/300/?blur=2' },
//     { id: '5', image: 'https://picsum.photos/id/870/200/300?grayscale&blur=2' },
//     { id: '6', image: 'https://picsum.photos/200/300?grayscale' },
//     { id: '7', image: 'https://picsum.photos/id/237/200/300' },
//     { id: '8', image: 'https://picsum.photos/seed/picsum/200/300' },
//     { id: '9', image: 'https://picsum.photos/200/300?grayscale' },
//     { id: '10', image: 'https://picsum.photos/seed/picsum/200/300' },
//     { id: '11', image: 'https://picsum.photos/200/300/?blur=2' },
//     { id: '12', image: 'https://picsum.photos/id/237/200/300' },
//     { id: '13', image: 'https://picsum.photos/seed/picsum/200/300' },
//     { id: '14', image: 'https://picsum.photos/200/300/?blur=2' },
//     { id: '15', image: 'https://picsum.photos/id/237/200/300' },
//     { id: '16', image: 'https://picsum.photos/seed/picsum/200/300' },
//     { id: '17', image: 'https://picsum.photos/200/300/?blur=2' },
//     { id: '18', image: 'https://picsum.photos/id/237/200/300' },
// ];

// const MarketPlace = ({navigation}) => {

//     const { isDarkMode } = useSelector(state => state.theme);

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             // backgroundColor: '#fff',
//             backgroundColor:isDarkMode?'black': '#fff',

//         },
//         searchContainer: {
//             flexDirection: 'row',
//             alignItems: 'center',
//             backgroundColor:isDarkMode?'#252525': '#F0F0F0',
//             borderRadius: 30,
//             margin: 10,
//             padding: 4,
//             marginTop:10,
//             paddingHorizontal:15
//         },
//         icon: {
//             marginRight: 10,
//         },
//         searchInput: {
//             flex: 1,
//             fontSize: 16,
//         },
//         imageWrapper: {
//             flex: 1,
//             margin: 1,
//         },
//         largeItem: {
//             flex: 2,
//         },
//         image: {
//             width: '100%',
//             height: 120,
//             resizeMode: 'cover',
//         },
//     });

//     const renderHeader = () => {
//         return (
//             <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
//                 <TouchableOpacity>
//                { isDarkMode?<BackIcon/>:    <BackIcon />}
//                 </TouchableOpacity>
//                 <CustomText style={{
//                     fontSize: 20,
//                     fontFamily: FONTS_FAMILY.SourceSans3_Bold
//                 }}>Market Place</CustomText>

//                 <TouchableOpacity onPress={() => navigation.navigate('Activity')}>
//                     {/* <NotiFication /> */}
//                 </TouchableOpacity>

//             </SpaceBetweenRow>
//         )
//     }

//     return (
//         <View style={styles.container}>
//             {/* Search Bar */}
        
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode?"light-content": "dark-content"}
//             />
//                 {renderHeader()}
//             <View style={styles.searchContainer}>
//                 <Search />
//                 <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#A0A0A0" />
//                 <TouchableOpacity>
//                     <Mic />
//                 </TouchableOpacity>
//             </View>

//             {/* Grid View */}
//             <FlatList
//             style={{marginBottom:90}}
//                 data={searchData}
//                 keyExtractor={(item) => item.id}
//                 numColumns={3}
//                 showsVerticalScrollIndicator={false}
//                 renderItem={({ item, index }) => (
//                     <TouchableOpacity style={[styles.imageWrapper, index % 9 === 0 ? styles.largeItem : null]}
//                     onPress={()=>navigation.navigate('MarketplaceBuyer')}
//                     >
//                         <Image source={{ uri: item.image }} style={styles.image} />
//                     </TouchableOpacity>
//                 )}
//             />
//         </View>
//     );
// };



// export default MarketPlace;
import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  FlatList, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  StatusBar, 
  ScrollView,
  Text
} from 'react-native';

import { useSelector } from 'react-redux';
import { BackIcon, CameraButton, Mic, NotiFication, Search } from '../assets/SVGs';
import SpaceBetweenRow from '../components/wrapper/spacebetween';
import CustomText from '../components/TextComponent';
import { FONTS_FAMILY } from '../assets/Fonts';

// Sample marketplace data with categories and items
const marketplaceItems = [
  { 
    id: '1', 
    image: 'https://picsum.photos/id/237/200/300',
    price: '₹140,000',
    title: 'Wagonr',
    category: 'cars'
  },
  { 
    id: '2', 
    image: 'https://picsum.photos/seed/house/200/300',
    price: '₹1,021,000',
    title: '1 bed 1 bathroom',
    category: 'houses'
  },
  { 
    id: '3', 
    image: 'https://picsum.photos/seed/laptop/200/300',
    price: '₹6,000',
    title: 'Becna hai 5800/-',
    category: 'electronics'
  },
  { 
    id: '4', 
    image: 'https://picsum.photos/seed/car2/200/300',
    price: '₹99,000',
    title: 'Maruti Suzuki Alto',
    category: 'cars'
  },
  { 
    id: '5', 
    image: 'https://picsum.photos/seed/house2/200/300',
    price: '₹850,000',
    title: '2 BHK House',
    category: 'houses'
  },
  { 
    id: '6', 
    image: 'https://picsum.photos/seed/mobile/200/300',
    price: '₹15,000',
    title: 'Samsung A50',
    category: 'electronics'
  },
  { 
    id: '7', 
    image: 'https://picsum.photos/seed/furniture/200/300',
    price: '₹8,500',
    title: 'Sofa set',
    category: 'furniture'
  },
  { 
    id: '8', 
    image: 'https://picsum.photos/seed/bike/200/300',
    price: '₹65,000',
    title: 'Hero Splendor',
    category: 'bikes'
  },
];

// Categories for the marketplace
const categories = [
  { id: '1', name: 'Inbox' },
  { id: '2', name: 'Sell' },
  { id: '3', name: 'Categories' },
  { id: '4', name: 'Search' },
];

const MarketPlace = ({navigation}) => {
  const { isDarkMode } = useSelector(state => state.theme);
  const [location, setLocation] = useState('Indore');
  const [distance, setDistance] = useState('65 km');

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: isDarkMode ? 'black' : '#f0f2f5',
    },
    headerContainer: {
      backgroundColor: isDarkMode ? '#252525' : 'white',
      paddingTop: 50,
      paddingBottom: 10,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: isDarkMode ? '#3a3b3c' : '#F0F0F0',
      borderRadius: 30,
      margin: 10,
      paddingVertical: 8,
      paddingHorizontal: 15,
    },
    searchInput: {
      flex: 1,
      fontSize: 16,
      color: isDarkMode ? 'white' : 'black',
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
    },
    categoriesContainer: {
      paddingVertical: 10,
      backgroundColor: isDarkMode ? '#252525' : 'white',
    },
    categoryScrollView: {
      paddingHorizontal: 10,
    },
    categoryItem: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      borderRadius: 20,
      marginRight: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    categoryText: {
      fontFamily: FONTS_FAMILY.SourceSans3_Medium,
      color: isDarkMode ? 'white' : 'black',
      fontSize:14
    },
    profileButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
    },
    todaysPicksContainer: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    todaysPicksHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    todaysPicksTitle: {
      fontSize: 20,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
    },
    locationContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    locationText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: '#1877f2',
      marginRight: 5,
    },
    distanceText: {
      fontSize: 16,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
    },
    marketplaceGrid: {
      paddingHorizontal: 5,
    },
    itemContainer: {
      width: '50%',
      padding: 5,
    },
    itemImage: {
      width: '100%',
      height: 150,
      borderRadius: 8,
    },
    itemPrice: {
      fontSize: 18,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginTop: 5,
    },
    itemTitle: {
      fontSize: 14,
      fontFamily: FONTS_FAMILY.SourceSans3_Regular,
      color: isDarkMode ? '#b0b3b8' : '#65676b',
    },
    backButton: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 24,
      fontFamily: FONTS_FAMILY.SourceSans3_Bold,
      color: isDarkMode ? 'white' : 'black',
      marginLeft: 10,
    },
    tabBar: {
      flexDirection: 'row',
      paddingVertical: 10,
      backgroundColor: isDarkMode ? '#252525' : 'white',
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? '#3a3b3c' : '#e4e6eb',
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  const renderHeader = () => {
    return (
      <View style={styles.headerContainer}>
        <SpaceBetweenRow style={{ paddingHorizontal: 20 }}>
          <View style={styles.backButton}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <BackIcon />
            </TouchableOpacity>
            <CustomText style={styles.headerTitle}>Marketplace</CustomText>
          </View>
          {/* <TouchableOpacity>
            <View style={styles.searchContainer}>
              <Search />
            </View>
          </TouchableOpacity> */}
        </SpaceBetweenRow>
      </View>
    );
  };

  const renderCategories = () => {
    return (
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryScrollView}
        >
          <TouchableOpacity style={styles.profileButton}>
            <CustomText style={[styles.categoryText, { fontSize: 18 }]}>👤</CustomText>
          </TouchableOpacity>
          {categories.map(category => (
            <TouchableOpacity key={category.id} style={styles.categoryItem}>
              <CustomText style={styles.categoryText}>{category.name}</CustomText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    );
  };

  const renderTodaysPicks = () => {
    return (
      <View style={styles.todaysPicksContainer}>
        <View style={styles.todaysPicksHeader}>
          <CustomText style={styles.todaysPicksTitle}>Today's picks</CustomText>
          <View style={styles.locationContainer}>
            <CustomText style={styles.locationText}>{location}</CustomText>
            <CustomText style={styles.distanceText}>· {distance}</CustomText>
          </View>
        </View>
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
      {renderCategories()}
      {renderTodaysPicks()}
      
      <FlatList
        data={marketplaceItems}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        style={styles.marketplaceGrid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.itemContainer}
            onPress={() => navigation.navigate('ProductDetail', { item })}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <CustomText style={styles.itemPrice}>{item.price}</CustomText>
            <CustomText style={styles.itemTitle}>{item.title}</CustomText>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default MarketPlace;