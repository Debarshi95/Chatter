import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuthState } from 'store/selectors';
import { Loader } from 'components';

const withProtectedRoute = (Component) => {
  return (props) => {
    const { state } = useLocation();
    const { user, loading } = useSelector(selectAuthState);
    const token = localStorage.getItem('token');

    const pathname = state?.from?.pathname || '/signin';

    if (loading === 'pending' || (token && !user)) return <Loader />;

    if (!user) {
      return <Navigate to={pathname} />;
    }
    return <Component {...props} user={user} />;
  };
};

export default withProtectedRoute;
