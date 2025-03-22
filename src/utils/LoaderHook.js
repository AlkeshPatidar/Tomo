// src/hooks/useLoader.js
import { useDispatch } from 'react-redux';
import { setLoader } from '../redux/reducer/loader';

const useLoader = () => {
  const dispatch = useDispatch();

  const showLoader = () => {
    dispatch(setLoader(true));
  };

  const hideLoader = () => {
    dispatch(setLoader(false));
  };

  return { showLoader, hideLoader };
};

export default useLoader;
