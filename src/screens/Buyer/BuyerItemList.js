// // Marketplace Buyer Screens UI for React Native (Mobile Application)

// import React from 'react';
// import { View, Text, TextInput, FlatList, Image, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
// import { useSelector } from 'react-redux';
// import SpaceBetweenRow from '../../components/wrapper/spacebetween';
// import { BackIcon, Mic, Search } from '../../assets/SVGs';
// import { FONTS_FAMILY } from '../../assets/Fonts';
// import CustomText from '../../components/TextComponent';
// import { App_Primary_color } from '../../common/Colors/colors';

// const listings = [
//     {
//         id: '1',
//         title: 'Wireless Headphones',
//         price: '$49.99',
//         image: 'https://picsum.photos/seed/picsum/200/300',
//     },
//     {
//         id: '2',
//         title: 'Sneakers - Size 10',
//         price: '$79.00',
//         image: 'https://picsum.photos/seed/picsum/200/300',
//     },
//     {
//         id: '3',
//         title: 'iPhone 12 (128GB)',
//         price: '$499.00',
//         image: 'https://picsum.photos/seed/picsum/200/300',
//     },
// ];


// const MarketplaceBuyer = ({navigation}) => {
//     const { isDarkMode } = useSelector(state => state.theme);

//     const styles = StyleSheet.create({
//         container: {
//             flex: 1,
//             backgroundColor: isDarkMode ? 'black' : '#fff',

//             // paddingHorizontal: 16,
//             // paddingTop: 16,
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
//         list: {
//             paddingBottom: 16,
//         },
//         card: {
//             flexDirection: 'row',
//             backgroundColor:isDarkMode?'#252525': '#F0F0F0',
//             borderRadius: 12,
//             marginBottom: 16,
//             overflow: 'hidden',
//             elevation: 2,
//         },
//         image: {
//             width: 100,
//             height: 100,
//         },
//         details: {
//             flex: 1,
//             padding: 12,
//             justifyContent: 'space-between',
//         },
//         title: {
//             fontSize: 16,
//            fontFamily:FONTS_FAMILY.SourceSans3_Bold
//         },
//         price: {
//             fontSize: 14,
//             color: '#666',
//             marginTop: 4,
//         },
//         button: {
//             marginTop: 8,
//             backgroundColor: App_Primary_color,
//             paddingVertical: 6,
//             paddingHorizontal: 12,
//             borderRadius: 6,
//             alignSelf: 'flex-start',
//         },
//         buttonText: {
//             color: '#fff',
//            fontFamily:FONTS_FAMILY.SourceSans3_Bold
//         },
//     });
//     const renderHeader = () => {
//         return (
//             <SpaceBetweenRow style={{ paddingTop: 50, paddingHorizontal: 20, backgroundColor: isDarkMode ? '#252525' : 'white', paddingBottom: 15 }}>
//                 <TouchableOpacity 
//                 onPress={()=>navigation.goBack()}
                
//                 >
//                     {isDarkMode ? <BackIcon /> : <BackIcon />}
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
//     const renderItem = ({ item }) => (
//         <View style={styles.card}>
//             <Image source={{ uri: item.image }} style={styles.image} />
//             <View style={styles.details}>
//                 <CustomText style={styles.title}>{item.title}</CustomText>
//                 <CustomText style={styles.price}>{item.price}</CustomText>
//                 <TouchableOpacity style={styles.button}
//                 onPress={()=>navigation.navigate('ProductDetail',{item:item})}
//                 >
//                     <CustomText style={styles.buttonText}>View</CustomText>
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );

//     return (
//         <View style={styles.container}>
//             <StatusBar
//                 translucent={true}
//                 backgroundColor="transparent"
//                 barStyle={isDarkMode ? "light-content" : "dark-content"}
//             />
//             {renderHeader()}
//             <View style={styles.searchContainer}>
//                 <Search />
//                 <TextInput style={styles.searchInput} placeholder="Search" placeholderTextColor="#A0A0A0" />
//                 <TouchableOpacity>
//                     <Mic />
//                 </TouchableOpacity>
//             </View>
//             <FlatList
//                 data={listings}
//                 keyExtractor={(item) => item.id}
//                 renderItem={renderItem}
//                 contentContainerStyle={styles.list}
//             />
//         </View>
//     );
// };

// export default MarketplaceBuyer;


// MarketplaceHomeScreen.js

import React from 'react';
import { View, Text, Image, FlatList, StyleSheet, TouchableOpacity } from 'react-native';

const shops = [
  { id: '1', name: 'Sports World', address: 'MG Road, Delhi', image: 'https://via.placeholder.com/150' },
  { id: '2', name: 'Fitness Hub', address: 'Brigade Road, Bangalore', image: 'https://via.placeholder.com/150' },
  { id: '3', name: 'Active Zone', address: 'Bandra, Mumbai', image: 'https://via.placeholder.com/150' },
];

const MarketplaceHomeScreen = ({ navigation }) => {
  const renderShop = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ShopDetails', { item })}>
      <Image source={{ uri: item.image }} style={styles.shopImage} />
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>{item.name}</Text>
        <Text style={styles.shopAddress}>{item.address}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Marketplace</Text>
      <Image
        source={{ uri: 'https://via.placeholder.com/400x200?text=Map+Placeholder' }}
        style={styles.mapImage}
        resizeMode="cover"
      />
      <FlatList
        data={shops}
        keyExtractor={(item) => item.id}
        renderItem={renderShop}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default MarketplaceHomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 16,
  },
  heading: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shopImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 12,
  },
  shopInfo: {
    flex: 1,
  },
  shopName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  shopAddress: {
    fontSize: 14,
    color: '#aaa',
  },
});
