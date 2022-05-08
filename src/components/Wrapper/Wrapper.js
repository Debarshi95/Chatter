import { Sidebar } from 'components';
import { Outlet } from 'react-router-dom';

const Wrapper = () => {
  return (
    <main className="flex p-6">
      <Sidebar />
      <div className="max-w-75 w-full">
        <Outlet />
      </div>
    </main>
  );
};

export default Wrapper;
