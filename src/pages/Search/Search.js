import { useEffect } from 'react';
import { CardHeader } from 'components';
import { withProtectedRoute } from 'hoc';
import { useDispatch, useSelector } from 'react-redux';
import { getAllUsers, updateAuthUserData } from 'store/reducers/slices';
import { selectAuthUser, selectUsers } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';

const Search = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const users = useSelector(selectUsers(authUser.uid));

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleOnFollowClick = (userId, isFollowingUser) => {
    let type = 'UPDATE';
    if (isFollowingUser) {
      type = 'DELETE';
    }
    dispatch(updateAuthUserData({ type, userId, authUserId: authUser.id }));
    dispatch(getAllUsers());
  };

  return (
    <div className="bg-green w-full p-4">
      {users?.map((user) => {
        const isFollowingUser = isFollowing(user, authUser.id);
        return (
          <div className="bg-slate-700 rounded-lg p-4 my-2" key={user.id}>
            <CardHeader
              key={user.id}
              username={user.username}
              isFollowing={isFollowingUser}
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
