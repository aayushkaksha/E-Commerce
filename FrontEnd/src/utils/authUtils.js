import { jwtDecode} from 'jwt-decode';


export const getUserRoleFromToken = () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    try {
      const decoded = jwtDecode(token); 
      console.log('Decoded Token:', decoded);
      console.log('User Role:', decoded.role);
      return decoded.role; 
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }
  return null;
};
