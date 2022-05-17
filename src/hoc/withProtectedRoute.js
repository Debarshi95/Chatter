import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthState } from 'store/selectors';
import { Loader } from 'components';

const withProtectedRoute = (Component) => {
  return (props) => {
    const { state } = useLocation();
    const { user } = useSelector(selectAuthState);
    const token = localStorage.getItem('token');

    const pathname = state?.from?.pathname || '/signin';

    if (token && !user) return <Loader />;

    if (!token && !user) {
      return <Navigate to={pathname} />;
    }
    return <Component {...props} />;
  };
};

export default withProtectedRoute;
