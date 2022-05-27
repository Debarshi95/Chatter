import { Navbar, SideDrawer, SuggestionSidebar } from 'components';
import { Outlet, useLocation } from 'react-router-dom';

const suggestionBarLink = ['/'];

const Wrapper = () => {
  const { pathname } = useLocation();
  const showSuggestionBar = suggestionBarLink.includes(pathname);

  return (
    <main>
      <div>
        <Navbar />
      </div>
      <div className="flex w-full max-w-85 mx-auto">
        <SideDrawer />
        <Outlet />
        {showSuggestionBar && <SuggestionSidebar />}
      </div>
    </main>
  );
};

export default Wrapper;
