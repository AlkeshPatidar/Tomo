import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showError } from './helperFunctions';
import RNRestart from 'react-native-restart';
import { Alert } from 'react-native';

export const BASE_URL = 'https://kreedabackend.vercel.app/api';

export async function getHeaders() {
  let token = await getItem('token');
  console.log("token in api", token);
  if (token) {
    return {
      Authorization: 'Bearer ' + token,
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


export async function makeApiFormDataRequest(endpoint, method, data = {}, hobbies, isPurpose, isImagePicked) {
  console.log('PAYLOAD-----------------', data, 'PAYLOAD')

  try {
    const token = await getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    };

    const formData = new FormData();



    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].forEach(item => {
          formData.append(`${key}[]`, item);
        });
      }


      if (isImagePicked == true) {
        if (key === 'image1' && data[key] && data[key].uri) {
          const response = await fetch(data[key].uri);
          const blob = await response.blob();
          const filename = data[key].uri.split('/').pop();
          const fileType = blob.type;

          formData.append('image1', {
            name: filename,
            type: fileType,
            uri: data[key].uri,
          });
        }
        else if (key === 'image2' && data[key] && data[key].uri) {
          const response = await fetch(data[key].uri);
          const blob = await response.blob();
          const filename = data[key].uri.split('/').pop();
          const fileType = blob.type;

          formData.append('image2', {
            name: filename,
            type: fileType,
            uri: data[key].uri,
          });
        }
        else if (key === 'image3' && data[key] && data[key].uri) {
          const response = await fetch(data[key].uri);
          const blob = await response.blob();
          const filename = data[key].uri.split('/').pop();
          const fileType = blob.type;

          formData.append('image3', {
            name: filename,
            type: fileType,
            uri: data[key].uri,
          });
        }
        else if (key === 'image4' && data[key] && data[key].uri) {
          const response = await fetch(data[key].uri);
          const blob = await response.blob();
          const filename = data[key].uri.split('/').pop();
          const fileType = blob.type;

          formData.append('image4', {
            name: filename,
            type: fileType,
            uri: data[key].uri,
          });
        }
        else if (key === 'image5' && data[key] && data[key].uri) {
          const response = await fetch(data[key].uri);
          const blob = await response.blob();
          const filename = data[key].uri.split('/').pop();
          const fileType = blob.type;

          formData.append('image5', {
            name: filename,
            type: fileType,
            uri: data[key].uri,
          });
        }
      }



      else {

        if (hobbies == true) {

          formData.append("hobbies", JSON.stringify(data));
        }
        if (isPurpose) {
          formData.append("purpose", JSON.stringify(data));
          // console.log(JSON.stringify(data));
        }
        else {
          formData.append(key, data[key]);
        }

      }
    }


    const requestOptions = {
      method: method,
      url: endpoint,
      headers: headers,
      data: formData,
    };

    console.log('Request Options:', JSON.stringify(requestOptions));

    const response = await axios(requestOptions);
    console.log('response OF API', response)
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error('Response error:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('Request error:', error.request);
    } else {
      console.error('General error:', error.message);
    }
    console.error('Config error:', error.config);
    throw error;
  }
}




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

export function clearAsyncStorage() {
  return AsyncStorage.clear();
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
