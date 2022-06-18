import { Navbar, SideDrawer, SuggestionSidebar } from 'components';
import { withProtectedRoute } from 'hoc';
import { Outlet, useLocation } from 'react-router-dom';

const suggestionBarLink = ['/', '/search', '/trending'];

const Wrapper = (props) => {
  const { pathname } = useLocation();
  const showSuggestionBar = suggestionBarLink.includes(pathname);

  return (
    <main>
      <Navbar {...props} />
      <div className="flex w-full md:max-w-85 mx-auto">
        <SideDrawer />
        <Outlet />
        {showSuggestionBar && <SuggestionSidebar {...props} />}
      </div>
    </main>
  );
};

export default withProtectedRoute(Wrapper);
