import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError } from './helperFunctions';
import RNRestart from 'react-native-restart';
import { Alert } from 'react-native';

export const BASE_URL = 'https://tomo-backend-app.vercel.app';

export async function getHeaders() {
  let token = await getItem('token');
  console.log("token in api", token);
  if (token) {
    return {
      Authorization: 'Bearer ' + token,
      // Authorization: 'Bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZTY5YjY3OWM3NDY1OGY3MjI2YjcwZiIsImlhdCI6MTc0MzIyNzgyNn0.4AnKNo_IvtQDCX2H6Z4IJGlx_nSkoaQmWCZTfLUf__Q',

    };
  }
  return {};
}

// export async function apiReq(
//   endPoint,
//   data,
//   method,
//   headers,
//   requestOptions = {},
// ) {

//   return new Promise(async (res, rej) => {
//     const getTokenHeader = await getHeaders();
//     headers = {
//       ...getTokenHeader,
//       ...headers,
//     };

//     if (method === 'get' || method === 'delete') {
//       data = {
//         ...requestOptions,
//         ...data,
//         headers,
//       };
//     }

//     axios[method](BASE_URL + endPoint, data, {headers})
//       .then(result => {
//         const {data} = result;

//         if (data.status === false) {
//           return rej(data);
//         }

//         return res(data);
//       })
//       .catch(error => {
//         console.log(error);
//         console.log(error && error.response, 'the error response');
//         if (error && error.response && error.response.status === 401) {
//           showError('User is not authorized');
//           clearAsyncStorage();
//           setTimeout(() => {
//             RNRestart.restart();
//           }, 1000);
//           // NavigationService.resetNavigation();
//           //NavigationService.navigate('loginUsingEmailScreen');
//         }
//         if (error && error.response && error.response.data) {
//           if (!error.response.data.message) {
//             return rej({
//               ...error.response.data,
//               msg: error.response.data.message || 'Network Error',
//             });
//           }
//           return rej(error.response.data);
//         } else {
//           return rej({message: 'Network Error', msg: 'Network Error'});
//         }
//         return rej(error);
//       });
//   });
// }

export async function apiReq(
  endPoint,
  data,
  method,
  headers,
  requestOptions = {},
) {
  return new Promise(async (res, rej) => {
    const getTokenHeader = await getHeaders();
    headers = {
      ...getTokenHeader,
      ...headers,
    };
    // console.log(requestOptions,'-------------he');

    if (method === 'get' || method === 'delete') {
      data = {
        ...requestOptions,
        ...data,
        headers,
      };
    }

    axios[method](BASE_URL + endPoint, method === 'get' || method === 'delete' ? { headers, params: data } : data, { headers })
      .then(result => {
        const { data } = result;

        if (data.status === false) {
          return rej(data);
        }
        return res(data);
      })
      .catch(error => {
        console.log(error);
        console.log(error && error.response, 'the error response');
        if (error && error.response && error.response.status === 401) {
          showError('User is not authorized');
          clearAsyncStorage();
          setTimeout(() => {
            RNRestart.restart();
          }, 1000);
          // NavigationService.resetNavigation();
          // NavigationService.navigate('loginUsingEmailScreen');
        }
        if (error && error.response && error.response.data) {
          if (!error.response.data.message) {
            return rej({
              ...error.response.data,
              msg: error.response.data.message || 'Network Error',
            });
          }
          return rej(error.response.data);
        } else {
          return rej({ message: 'Network Error', msg: 'Network Error' });
        }
        return rej(error);
      });
  });
}

// formdata Api







export function apiPost(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'post', headers);
}

export function apiDelete(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'delete', headers);
}

export function apiGet(endPoint, data, headers = {}, requestOptions) {
  return apiReq(endPoint, data, 'get', headers, requestOptions);
}

export function apiPut(endPoint, data, headers = {}) {
  return apiReq(endPoint, data, 'put', headers);
}

export function setItem(key, data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
}

export function getItem(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}

const CLEAR_KEYS = [
  'token',
  
];

// export function clearAsyncStorage() {
//   return AsyncStorage.clear();
// }

export async function clearAsyncStorage() {
  try {
    await AsyncStorage.multiRemove(CLEAR_KEYS);
        navigation.replace('MainScreen')
    console.log('Session data cleared, biometric data preserved');
  } catch (error) {
    console.log('Error clearing storage:', error);
  }
}

export function setUserData(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('userData', data);
}

export async function getUserData() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('userData').then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export function setFirstTime(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('isFirstTime', data);
}

export async function getFirstTime() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('isFirstTime').then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export async function clearUserData() {
  return AsyncStorage.removeItem('userData');
}
