import { useState, useEffect } from 'react';
import { Keyboard } from 'react-native';

const useKeyboardStatus = () => {
    const [isKeyboardOpen, setKeyboardOpen] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            setKeyboardOpen(true);
            setKeyboardHeight(e.endCoordinates.height);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardOpen(false);
            setKeyboardHeight(0);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    return { isKeyboardOpen, keyboardHeight };
};

export default useKeyboardStatus;
