import { useEffect, useState } from 'react';
import { PostBox, Select, Text } from 'components';
import { withProtectedRoute } from 'hoc';
import { useDispatch, useSelector } from 'react-redux';
import { selectTrendingPosts } from 'store/selectors';
import { getTrendingPosts } from 'store/reducers/slices';

const selectOptions = [
  { label: 'Likes', value: 'likes' },
  { label: 'Bookmarks', value: 'bookmarks' },
  { label: 'Retweets', value: 'retweets' },
  { label: 'Clear', value: 'clear' },
];

const Search = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const dispatch = useDispatch();
  const posts = useSelector(selectTrendingPosts(selectedFilter));

  useEffect(() => {
    if (!posts?.length) {
      dispatch(getTrendingPosts());
    }
  }, [dispatch, posts]);

  const handleSelectClick = (value) => {
    if (value === 'Clear') {
      setSelectedFilter('');
    } else {
      setSelectedFilter(value.toLowerCase());
    }
  };

  return (
    <div className="flex-1 p-2">
      <div className="flex justify-between items-start">
        <Text className="text-gray-300 font-medium text-xl text-center flex-1 mt-2">
          Trending Posts
        </Text>
        <Select
          options={selectOptions}
          defaultValue="Filters"
          dropdownClassName="top-10"
          onSelect={handleSelectClick}
        />
      </div>
      {posts?.map((post) => (
        <PostBox post={post} key={post.id} onUpdatePost={() => dispatch(getTrendingPosts())} />
      ))}
    </div>
  );
};

export default withProtectedRoute(Search);
