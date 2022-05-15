import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { GiHamburgerMenu } from 'react-icons/gi';
import { setSidebarOpen, signout } from 'store/reducers/slices';
import { selectAuthUser } from 'store/selectors';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);
  const { sidebarOpen } = useSelector((state) => state.sidebar);

  const handleSignout = () => {
    dispatch(signout());
  };

  return (
    <div className="w-full bg-slate-700 p-2 sticky top-0 z-20 ">
      <nav className="flex w-full md:w-11/12 mx-auto text-gray-200 items-center">
        <Link
          to={user ? '/' : 'signin'}
          className="invisible md:visible inline-block font-medium p-2 text-2xl md:text-3xl cursor-pointer"
        >
          Chatter
        </Link>
        <GiHamburgerMenu
          size="1.4rem"
          className="block absolute left-6 cursor-pointer md:invisible"
          onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
        />
        {user ? (
          <div
            role="button"
            aria-hidden
            onClick={handleSignout}
            className="inline-block py-2 px-2 cursor-pointer md:text-xl ml-auto hover:bg-slate-900 rounded-md md:mr-2 md:px-6"
          >
            Signout
          </div>
        ) : (
          <div className="d-flex items-center ml-auto md:text-xl">
            <Link
              to="/signin"
              className="py-2 px-2 cursor-pointer  hover:bg-slate-900 rounded-md md:mr-2 md:px-6"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="py-2 px-2 md:px-6 cursor-pointer hover:bg-slate-900 rounded-md"
            >
              Sign up
            </Link>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
