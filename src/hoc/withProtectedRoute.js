import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthUser } from 'store/selectors';

const withProtectedRoute = (Component) => {
  return (props) => {
    const { state } = useLocation();
    const user = useSelector(selectAuthUser);

    const pathname = state?.from?.pathname || '/signin';

    if (!user) {
      return <Navigate to={pathname} />;
    }
    return <Component {...props} />;
  };
};

export default withProtectedRoute;
