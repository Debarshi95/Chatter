import { useEffect } from 'react';
import { PostBox } from 'components';
import { withProtectedRoute } from 'hoc';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendingPosts } from 'store/selectors';
import { getTrendingPosts } from 'store/reducers/slices';

const Search = () => {
  const dispatch = useDispatch();
  const posts = useSelector(selectTrendingPosts);

  useEffect(() => {
    dispatch(getTrendingPosts());
  }, [dispatch]);

  return (
    <div className="bg-green w-full p-4">
      {posts?.map((post) => (
        <PostBox post={post} key={post.id} />
      ))}
    </div>
  );
};

export default withProtectedRoute(Search);
