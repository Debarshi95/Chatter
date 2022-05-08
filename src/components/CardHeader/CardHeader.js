import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Text, Button } from 'components';
import { getFirstChar, isFollowing } from 'utils/helperFuncs';
import { selectAuthUser } from 'store/selectors';
import { requestUpdateUserProfileData } from 'store/reducers/slices';

const CardHeader = ({ user, showFollowButton }) => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const isFollowingUser = isFollowing(user, authUser.id);

  const handleButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const userId = user.id;
    const authUserId = authUser.id;

    if (!isFollowingUser) {
      return dispatch(requestUpdateUserProfileData({ type: 'UPDATE', userId, authUserId }));
    }
    return dispatch(requestUpdateUserProfileData({ type: 'DELETE', userId, authUserId }));
  };

  return (
    <Link to={`/profile/${user.username}`} state={{ uid: user.uid, docId: user.id }} key={user.id}>
      <div className="cursor-pointer flex items-center text-white  min-h-full">
        <Text className="bg-slate-700 p-4 w-20 h-18 text-3xl  text-center rounded-lg mr-4">
          {getFirstChar(user?.username)}
        </Text>
        <div className="text-xl py-2">
          <Text>{user?.username}</Text>
          {user?.username && <Text className="text-base text-gray-300">{`@${user.username}`}</Text>}
        </div>
        {showFollowButton && (
          <Button
            className="w-32 rounded-lg h-10 ml-auto flex items-center justify-center text-slate-800"
            onClick={handleButtonClick}
          >
            {isFollowingUser ? 'Following' : 'Follow'}
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
