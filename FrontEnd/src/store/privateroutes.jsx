import { Navigate } from "react-router-dom";
import { getUserRoleFromToken } from "../utils/authUtils";

const PrivateRoute = ({ element, allowedRoles }) => {
  
  const userRole = getUserRoleFromToken();

  if (!userRole) {
    // Redirect to login if no user role
    return <Navigate to="/login" />;
  }

  // Check if the role is allowed
  if (allowedRoles.includes(userRole)) {
    return element; // Render the element
  }

  // Redirect to unauthorized if role is not allowed
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;
