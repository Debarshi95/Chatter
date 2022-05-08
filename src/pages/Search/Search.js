import { CardHeader } from 'components';
import { withProtectedRoute } from 'hoc';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestGetAllUsers } from 'store/reducers/slices';
import { selectAuthUser, selectUsers } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';

const Search = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const users = useSelector(selectUsers(authUser.uid));

  useEffect(() => {
    dispatch(requestGetAllUsers());
  }, [dispatch]);

  return (
    <div className="bg-green w-full p-4">
      {users?.map((user) => {
        const isFollowingUser = isFollowing(user, authUser.uid);
        return (
          <div className="border-2 border-slate-700 rounded-lg p-4 my-2" key={user.id}>
            <CardHeader
              key={user.id}
              authUserId={authUser.id}
              username={user.username}
              userId={user.id}
              isFollowing={isFollowingUser}
              showFollowButton
            />
          </div>
        );
      })}
    </div>
  );
};

export default withProtectedRoute(Search);
