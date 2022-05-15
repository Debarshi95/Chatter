import { cloneElement, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { BiTrendingUp } from 'react-icons/bi';
import { useSelector } from 'react-redux';
import { selectAuthUser } from 'store/selectors';
import { Text } from 'components';

const sidebarLinks = [
  {
    name: 'Home',
    pathname: '/',
    icon: <AiOutlineHome />,
  },
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
  {
    name: 'Profile',
    pathname: '/profile/:username',
    icon: <AiOutlineUser />,
  },
];

const Sidebar = () => {
  const authUser = useSelector(selectAuthUser);

  return (
    <div className="bg-slate-700 h-90 sticky top-24 w-80 md:mr-6 rounded-md p-4">
      <Text className="bg-slate-800 p-4 rounded-md text-gray-300 text-xl mb-2">
        @{authUser?.username}
      </Text>
      <nav>
        {sidebarLinks.map((link, idx) => {
          const pathname =
            link.name === 'Profile' ? `/profile/${authUser?.username}` : link.pathname;
          const state = link.name === 'Profile' && { id: authUser?.uid };
          return (
            <NavLink to={pathname} state={state} key={idx} className="block w-full">
              <div className="w-full flex items-center text-white text-xl font-medium p-2 md:p-4 cursor-pointer hover:bg-slate-600 rounded-3xl">
                <span className="mr-2">
                  {cloneElement(link.icon, { className: 'text-3xl text-inherit font-medium"' })}
                </span>
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
