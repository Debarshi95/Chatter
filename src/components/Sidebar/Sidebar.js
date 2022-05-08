import { memo } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { useSelector } from 'react-redux';
import { selectAuthUser } from 'store/selectors';
import { Text } from 'components';

const sidebarLinks = [
  {
    name: 'Home',
    pathname: '/',
    icon: <AiOutlineHome className="text-3xl text-inherit font-medium" />,
  },
  {
    name: 'Search',
    pathname: '/search',
    icon: <AiOutlineSearch className="text-3xl text-inherit font-medium" />,
  },
  {
    name: 'Profile',
    pathname: '/profile/:username',
    icon: <AiOutlineUser className="text-3xl text-inherit font-medium" />,
  },
];

const Sidebar = () => {
  const authUser = useSelector(selectAuthUser);

  return (
    <div className="bg-slate-700 h-90 sticky top-24 w-80 md:mr-6 rounded-md p-4">
      <Text className="bg-slate-800 p-4 rounded-md text-gray-300 text-xl">
        @{authUser?.username}
      </Text>
      <nav>
        {sidebarLinks.map((link, idx) => {
          const pathname =
            link.name === 'Profile' ? `/profile/${authUser?.username}` : link.pathname;
          const state = link.name === 'Profile' && { id: authUser?.uid };
          return (
            <NavLink to={pathname} state={state} key={idx} className="block w-full">
              <div className="w-full flex items-center text-white text-xl font-medium p-2 md:p-4 cursor-pointer hover:bg-slate-600 rounded-md">
                <span className="mr-2">{link.icon}</span>
                <span>{link.name}</span>
              </div>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default memo(Sidebar);
