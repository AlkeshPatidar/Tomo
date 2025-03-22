export const inValidEmail = (email) => {
    if (email?.length <= 0) {
      return 'Please enter email';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address';
    }
  
    return null;
  };
  
  export const inValidPassword = (password) => {
    if (password?.length < 4) {
      return 'Password should not be less than 4 characters';
    }
    return null;
  };
  