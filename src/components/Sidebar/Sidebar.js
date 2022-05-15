import cn from 'clsx';
import { cloneElement, memo } from 'react';
import { NavLink } from 'react-router-dom';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { BiTrendingUp } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from 'store/selectors';
import { Text } from 'components';
import { setSidebarOpen } from 'store/reducers/slices';

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
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const { sidebarOpen } = useSelector((state) => state.sidebar);

  return (
    <div
      className={cn(
        'bg-slate-700 slide-out h-90 fixed top-16 md:sticky md:my-4 Md:mx-6 w-80 md:rounded-md p-4',
        {
          'slide-in': sidebarOpen,
          // 'slide-out': !sidebarOpen,
        },
        'sm:relative'
      )}
    >
      <Text className="bg-slate-600 p-4 rounded-md text-gray-300 text-xl mb-2">
        @{authUser?.username}
      </Text>
      <nav>
        {sidebarLinks.map((link, idx) => {
          const pathname =
            link.name === 'Profile' ? `/profile/${authUser?.username}` : link.pathname;
          const state = link.name === 'Profile' && { id: authUser?.uid };
          return (
            <NavLink
              to={pathname}
              state={state}
              key={idx}
              className="block w-full"
              onClick={() => dispatch(setSidebarOpen(!sidebarOpen))}
            >
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
