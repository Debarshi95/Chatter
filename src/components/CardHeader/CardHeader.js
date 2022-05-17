import { memo } from 'react';
import { Link } from 'react-router-dom';
import { Text, Button, Avatar } from 'components';

const CardHeader = ({
  username,
  avatar,
  avatarClassName,
  userId,
  showFollowButton,
  isFollowing,
  onClick,
}) => {
  return (
    <Link to={`/profile/${username}`} state={{ id: userId }}>
      <div className="cursor-pointer flex items-center text-white  min-h-full">
        {avatar ? (
          <div className="flex">
            <Avatar url={avatar} alt={username} className={avatarClassName} />
            <div className="text-lg py-2 ml-2">
              <Text>{username}</Text>
              {username && <Text className="text-base text-gray-300">{`@${username}`}</Text>}
            </div>
          </div>
        ) : (
          <div className="text-sm py-2">
            <Text>{username}</Text>
            {username && <Text className="text-base text-gray-300">{`@${username}`}</Text>}
          </div>
        )}

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
};
export default memo(CardHeader);
