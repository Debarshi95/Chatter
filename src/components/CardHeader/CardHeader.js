import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button, Avatar } from 'components';

const CardHeader = ({
  fullname,
  username,
  avatar,
  avatarClassName,
  userId,
  showFollowButton,
  isFollowing,
  onClick,
  bio,
}) => {
  return (
    <Link to={`/profile/${username}`} state={{ id: userId }}>
      <div className="cursor-pointer flex items-center text-gray-300 font-sans min-h-full">
        <div className="flex items-center justify-start">
          <Avatar url={avatar} alt={username} className={avatarClassName} />
          <div className="text-lg py-2 ml-2">
            <Text>{fullname || username}</Text>
            {username && <Text className="text-sm font-normal">{`@${username}`}</Text>}
            <Text className="text-sm text-ellipsis font-light max-w-md overflow-hidden">{bio}</Text>
          </div>
        </div>
        {showFollowButton && (
          <Button
            className="w-32 border-2 border-slate-600 bg-slate-700 rounded-3xl h-10 ml-auto text-white"
            onClick={onClick}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </Button>
        )}
      </div>
    </Link>
  );
};

CardHeader.defaultProps = {
  showFollowButton: false,
  onClick: () => null,
  fullname: '',
  bio: '',
};
export default memo(CardHeader);
