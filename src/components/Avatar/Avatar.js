import cn from 'clsx';
import { memo } from 'react';

const Avatar = ({ url, alt, className }) => {
  return (
    <div className={cn('w-36 h-36', className)}>
      <img src={url} alt={alt} className="w-full h-full overflow-hidden rounded-full" />
    </div>
  );
};

Avatar.defaultProps = {
  url: '',
  alt: '',
};

export default memo(Avatar);
