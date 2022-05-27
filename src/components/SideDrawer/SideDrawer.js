import cn from 'clsx';
import { cloneElement } from 'react';
import { AiOutlineHome, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { FiTrendingUp } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { selectAuthUser } from 'store/selectors';

const sidebarLinks = [
  { path: '/', icon: <AiOutlineHome />, name: 'Feed' },
  { path: '/search', icon: <AiOutlineSearch />, name: 'Search' },
  { path: '/trending', icon: <FiTrendingUp />, name: 'Trending' },
  { path: '/profile/:username', icon: <AiOutlineUser />, name: 'Profile' },
];

const SideDrawer = () => {
  const authUser = useSelector(selectAuthUser);
  const location = useLocation();

  return (
    <aside className="border-slate-700 border w-64 h-90 sticky my-2 rounded-md top-20 px-2">
      {sidebarLinks.map((link) => {
        const pathname =
          link.path === '/profile/:username' ? `/profile/${authUser?.username}` : link.path;
        return (
          <NavLink
            to={pathname}
            key={link.name}
            className={cn(
              'flex text-white p-3 px-4 items-center text-lg w-full rounded-md my-1 hover:bg-slate-700 hover:text-blue-500',
              pathname === location.pathname ? 'bg-slate-700 text-blue-500' : ''
            )}
            state={{ id: authUser?.id }}
          >
            <div className="flex">
              {cloneElement(link.icon, { className: 'text-2xl mr-2' })}
              <p className="font-light">{link.name}</p>
            </div>
          </NavLink>
        );
      })}
    </aside>
  );
};

export default SideDrawer;
