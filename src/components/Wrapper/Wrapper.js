import { Outlet } from 'react-router-dom';

const Wrapper = () => {
  return (
    <main className="w-full mx-auto md:w-1/2">
      <Outlet />
    </main>
  );
};

export default Wrapper;
