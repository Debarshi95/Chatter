import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardHeader, PostBox } from 'components';
import { withProtectedRoute } from 'hoc';
import { selectPosts, selectAuthUser } from 'store/selectors';
import { getAllPosts } from 'store/reducers/slices';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const authUser = useSelector(selectAuthUser);

  useEffect(() => {
    if (authUser?.uid) {
      dispatch(getAllPosts({ userId: authUser.uid, following: authUser.following }));
    }
  }, [authUser.uid, dispatch, authUser.following]);

  return (
    <div className="p-4">
      <PostBox
        contentEditable
        user={authUser}
        headerComponent={
          <CardHeader
            avatarClassName="w-20 h-20"
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
