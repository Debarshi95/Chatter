import { Sidebar } from 'components';
import { Outlet } from 'react-router-dom';

const Wrapper = () => {
  return (
    <main className="flex">
      <Sidebar />
      <div className="w-full md:max-w-75">
        <Outlet />
      </div>
    </main>
  );
};

export default Wrapper;
