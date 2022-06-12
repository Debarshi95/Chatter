import { Avatar, Text } from 'components';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AiOutlinePlusSquare } from 'react-icons/ai';
import { BiCheckSquare } from 'react-icons/bi';
import { getAllUsers, updateAuthUserData } from 'store/reducers/slices';
import { selectSearchState } from 'store/selectors';
import { isFollowing } from 'utils/helperFuncs';

const SuggestionSidebar = ({ user: authUser }) => {
  const dispatch = useDispatch();
  const { users = [] } = useSelector(selectSearchState);

  const searchUsers = users.filter((user) => user.id !== authUser.id);

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

    dispatch(updateAuthUserData({ type, userId, authUserId: authUser?.id }));
    dispatch(getAllUsers());
  };

  return (
    <div className="w-72 min-h-20 sticky top-20 border-slate-700 border h-fit my-2 rounded-md px-2 py-1 hidden md:block">
      <Text className="text-white font-bold text-center mt-2 mb-3 text-2xl">Suggestions</Text>
      {searchUsers?.slice(0, 4)?.map((user) => {
        const isFollowingUser = isFollowing(user, authUser?.id);
        return (
          <div
            key={user.id}
            className="bg-slate-800 border-slate-700 border p-2 my-1 flex items-center rounded-md"
          >
            <Avatar url={user.avatar} alt={user.username} className="h-12 w-12 mr-2" />
            <div className="text-gray-300">
              <Text className="text-base">{user?.fullname || user.username}</Text>
              <Text className="text-sm text-slate-400 font-sans">
                {user?.fullname || `@${user.username}`}
              </Text>
            </div>
            <div
              role="button"
              aria-hidden
              data-tooltip={isFollowingUser ? 'Unfollow' : 'Follow'}
              className="tooltip relative text-3xl ml-auto text-slate-400"
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
