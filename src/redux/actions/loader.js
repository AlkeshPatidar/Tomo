// import {clearAsyncStorage} from '../../utils/utils';
// import {removeUser, setIsFirstTime, setUser} from '../reducer/user';
import { setLoader } from '../reducer/loader';
import store from '../store';
const {dispatch} = store;

export const skip = data => {
  dispatch(setLoader(data));
};
