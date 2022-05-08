import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Text, Button } from 'components';
import { getFirstChar } from 'utils/helperFuncs';
import { requestUpdateUserProfileData } from 'store/reducers/slices';

const CardHeader = ({ authUserId, username, userId, showFollowButton, isFollowing }) => {
  const dispatch = useDispatch();

  const handleOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isFollowing) {
      return dispatch(requestUpdateUserProfileData({ type: 'UPDATE', userId, authUserId }));
    }
    return dispatch(requestUpdateUserProfileData({ type: 'DELETE', userId, authUserId }));
  };

  return (
    <Link to={`/profile/${username}`} state={{ id: userId }}>
      <div className="cursor-pointer flex items-center text-white  min-h-full">
        <Text className="bg-slate-700 p-4 w-20 h-18 text-3xl  text-center rounded-lg mr-4">
          {getFirstChar(username)}
        </Text>
        <div className="text-xl py-2">
          <Text>{username}</Text>
          {username && <Text className="text-base text-gray-300">{`@${username}`}</Text>}
        </div>
        {showFollowButton && (
          <Button
            className="w-32 rounded-lg h-10 ml-auto flex items-center justify-center text-slate-800"
            onClick={handleOnClick}
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
};
export default memo(CardHeader);
