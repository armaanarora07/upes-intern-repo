import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const authToken = useSelector((state) => state.auth.authToken);

  return authToken ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
