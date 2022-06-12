import { useEffect } from 'react';
import { CardHeader } from 'components';
import { withProtectedRoute } from 'hoc';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateAuthUserData } from 'store/reducers/slices';
import { selectSearchState } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';
import useDocumentTitle from 'hooks/useDocumentTitle';

const Search = ({ user: authUser }) => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector(selectSearchState);

  const searchUsers = users.filter((user) => user.id !== authUser.id);

  useDocumentTitle('Search | Chatter');

  useEffect(() => {
    if (!users.length) {
      dispatch(getAllUsers());
    }
  }, [dispatch, users.length]);

  const handleOnFollowClick = (userId, isFollowingUser) => {
    let type = 'UPDATE';
    if (isFollowingUser) {
      type = 'DELETE';
    }
    dispatch(updateAuthUserData({ type, userId, authUserId: authUser.id }));
    dispatch(getAllUsers());
  };

  return (
    <div className="p-1 flex-1">
      {searchUsers?.map((user) => {
        const isFollowingUser = isFollowing(user, authUser.id);
        return (
          <div className="border-slate-600 border rounded-lg p-2 my-2" key={user.id}>
            <CardHeader
              key={user.id}
              username={user.username}
              isFollowing={isFollowingUser}
              fullname={user?.fullname}
              showFollowButton
              avatar={user.avatar}
              userId={user.id}
              avatarClassName="w-20 h-20"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleOnFollowClick(user.id, isFollowingUser);
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default withProtectedRoute(Search);
