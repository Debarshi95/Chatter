import cn from 'clsx';
import Text from 'components/Text/Text';
import { memo } from 'react';
import { getFirstChar } from 'utils/helperFuncs';

const Avatar = ({ url, alt, className }) => {
  return (
    <div className={cn('w-36 h-36', className)}>
      {url ? (
        <img src={url} alt={alt} className="w-full h-full overflow-hidden rounded-full" />
      ) : (
        <div className="w-full h-full overflow-hidden bg-slate-700 flex items-center content-center rounded-full">
          <Text className="text-2xl text-center flex-1 text-gray-300">{getFirstChar(alt)}</Text>
        </div>
      )}
    </div>
  );
};

Avatar.defaultProps = {
  url: '',
  alt: '',
};

export default memo(Avatar);
