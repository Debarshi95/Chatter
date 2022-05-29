import { HashLoader } from 'react-spinners';

const Loader = ({ className }) => {
  return (
    <div className={className}>
      <HashLoader color="white" />
    </div>
  );
};

Loader.defaultProps = {
  className: 'h-80 flex items-center justify-center flex-1',
};
export default Loader;
