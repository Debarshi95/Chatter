import { Avatar, Text } from 'components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { BiCheckSquare } from 'react-icons/bi';
import { getAllUsers, updateAuthUserData } from 'store/reducers/slices';
import { selectAuthUser, selectUsers } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';

const SuggestionSidebar = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);
  const users = useSelector(selectUsers(authUser?.uid));

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleOnFollowClick = (userId, isFollowingUser) => {
    let type = 'UPDATE';
    if (isFollowingUser) {
      type = 'DELETE';
    }

    dispatch(updateAuthUserData({ type, userId, authUserId: authUser?.id }));
    dispatch(getAllUsers());
  };

  return (
    <div className="w-72 bg-slate-700 h-fit my-2 rounded-md px-2 py-1 invisible md:visible">
      {users?.slice(0, 4)?.map((user) => {
        const isFollowingUser = isFollowing(user, authUser?.id);
        return (
          <div
            key={user.id}
            className="border-slate-600 border-2 p-2 my-1 flex items-center rounded-md"
          >
            <Avatar url={user.avatar} alt={user.username} className="h-12 w-12 mr-2" />
            <div className="text-gray-300">
              <Text className="text-base">{user.username}</Text>
              <Text className="text-sm text-slate-400">
                {user?.fullname || `@${user.username}`}
              </Text>
            </div>
            <div
              role="button"
              aria-hidden
              className="text-3xl ml-auto text-slate-400"
              onClick={() => handleOnFollowClick(user.id, isFollowingUser)}
            >
              {isFollowingUser ? <BiCheckSquare /> : <AiOutlinePlusSquare />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestionSidebar;
