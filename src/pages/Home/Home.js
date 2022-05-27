import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardHeader, PostBox } from 'components';
import { withProtectedRoute } from 'hoc';
import { selectPosts, selectAuthUser } from 'store/selectors';
import { createPost, getAllPosts } from 'store/reducers/slices';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const authUser = useSelector(selectAuthUser);

  useEffect(() => {
    if (authUser?.uid) {
      dispatch(getAllPosts({ userId: authUser.uid, following: authUser.following }));
    }
  }, [authUser.uid, dispatch, authUser.following]);

  const handleCreatePost = async (value) => {
    dispatch(createPost({ content: value, user: authUser }));
  };

  return (
    <div className="p-2 flex-1">
      <PostBox
        contentEditable
        user={authUser}
        onCreatePost={handleCreatePost}
        showPostIcons={false}
        headerComponent={
          <CardHeader
            avatarClassName="w-16 h-16"
            avatar={authUser?.avatar}
            userId={authUser?.id}
            username={authUser?.username}
          />
        }
      />
      <section>
        {posts?.map((post) => (
          <PostBox key={post.id} post={post} />
        ))}
      </section>
    </div>
  );
};

export default withProtectedRoute(Home);
