import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Button, PostBox, Text } from 'components';
import { withProtectedRoute } from 'hoc';
import { requestGetUserProfilePosts, requestUpdateUserProfileData } from 'store/reducers/slices';
import { selectAuthUser, selectUserPosts } from 'store/selectors';
import { selectUserById } from 'store/selectors/searchSelector';
import { getFirstChar, isFollowing } from 'utils/helperFuncs';

const Profile = () => {
  const {
    state: { id },
  } = useLocation();

  const dispatch = useDispatch();
  const user = useSelector(selectUserById(id));

  const authUser = useSelector(selectAuthUser);
  const posts = useSelector(selectUserPosts);

  const isFollowingUser = isFollowing(user, authUser.uid);

  useEffect(() => {
    if (authUser?.uid && authUser.uid !== id) {
      dispatch(requestGetUserProfilePosts(id));
    }
  }, [authUser.uid, dispatch, id]);

  const handleButtonClick = () => {
    const userId = user.id;
    const authUserId = authUser.id;

    if (!isFollowingUser) {
      return dispatch(requestUpdateUserProfileData({ type: 'UPDATE', userId, authUserId }));
    }
    return dispatch(requestUpdateUserProfileData({ type: 'DELETE', userId, authUserId }));
  };

  return (
    <div className="text-white p-4 md:w-3/5 mx-auto">
      <header className="flex items-center justify-center flex-col">
        <Text
          variant="div"
          className="text-2xl bg-slate-600 h-36 w-36 rounded-full flex items-center justify-center"
        >
          <span className="text-5xl">{getFirstChar(user?.username)}</span>
        </Text>
        {user?.username && (
          <Text className="text-2xl text-center my-4 text-gray-300 font-medium">{`@${user.username}`}</Text>
        )}
        <Button
          className="w-36 rounded-lg h-10  flex items-center justify-center text-slate-800"
          onClick={handleButtonClick}
        >
          {isFollowingUser ? 'Following' : 'Follow'}
        </Button>

        <Text className="md:w-3/4 mx-auto text-center text-lg my-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
          been the standard dummy text ever since the 1500s, w
        </Text>
        <div className="bg-gray-700 text-xl w-full md:w-3/4 p-4 rounded-md flex justify-between md:justify-evenly">
          <Text className="flex items-center justify-center flex-col">
            <span className="text-2xl">{user?.following?.length}</span>
            <span>Following</span>
          </Text>
          <Text className="flex items-center justify-center flex-col">
            <span className="text-2xl">{user?.posts?.length}</span>
            <span>Posts</span>
          </Text>
          <Text className="flex items-center justify-center flex-col">
            <span className="text-2xl">{user?.followers?.length}</span>
            <span>Followers</span>
          </Text>
        </div>
      </header>
      <section>
        <Text className="text-2xl font-medium mt-6 mb-4">Latest Posts</Text>
        <article>
          {posts?.map((post) => (
            <PostBox key={post.id} post={post} user={user} />
          ))}
        </article>
      </section>
    </div>
  );
};

export default withProtectedRoute(Profile);
