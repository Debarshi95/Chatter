import { HashLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="h-80 flex items-center justify-center w-full">
      <HashLoader color="red" />
    </div>
  );
};

export default Loader;
