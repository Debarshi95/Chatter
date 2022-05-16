import { cloneElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FiMoreVertical } from 'react-icons/fi';
import { AiOutlineSearch } from 'react-icons/ai';
import { BiTrendingUp } from 'react-icons/bi';
import { signout } from 'store/reducers/slices';
import { selectAuthUser } from 'store/selectors';
import { Avatar, Select } from 'components';

const navbarSelectItems = [
  {
    label: 'Profile',
    value: 'profile',
  },
  {
    label: 'Signout',
    value: 'signout',
  },
];

const navbarLinks = [
  {
    name: 'Trending',
    pathname: '/trending',
    icon: <BiTrendingUp />,
  },
  {
    name: 'Search',
    pathname: '/search',
    icon: <AiOutlineSearch />,
  },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const navigate = useNavigate();

  const handleDropDown = (value) => {
    if (value === 'Signout') {
      dispatch(signout());
    }
    if (value === 'Profile') {
      navigate(`/profile/${user.username}`, { state: { id: user.id } });
    }
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full bg-slate-700 p-2 sticky top-0 z-20 ">
      <nav className="flex w-full md:w-11/12 mx-auto text-gray-200 items-center">
        <Link
          to={user ? '/' : 'signin'}
          className="inline-block font-medium p-2 text-2xl md:text-3xl cursor-pointer"
        >
          Chatter
        </Link>

        {user ? (
          <div className="flex ml-auto items-center relative">
            {navbarLinks.map((link, idx) => {
              return (
                <NavLink to={link.pathname} key={idx} className="inline-block">
                  <div>
                    {cloneElement(link.icon, {
                      className: 'text-3xl mr-2 text-inherit font-medium hover:text-slate-300',
                    })}
                  </div>
                </NavLink>
              );
            })}
            <Avatar url={user.avatar} alt={user.username} className="w-10 h-10" />

            <div onClick={() => setIsDropdownOpen(!isDropdownOpen)} role="button" aria-hidden>
              <FiMoreVertical className="block cursor-pointer text-2xl" />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-12 right-0">
                <Select
                  options={navbarSelectItems}
                  defaultValue={user.username}
                  onSelect={handleDropDown}
                  defaultMenuOpen
                  dropdownClassName="top-0"
                />
              </div>
            )}
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
