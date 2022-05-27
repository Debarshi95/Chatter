import { useEffect, useState } from 'react';
import { PostBox, Select } from 'components';
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
      <Select
        options={selectOptions}
        defaultValue="Filters"
        dropdownClassName="top-10"
        onSelect={handleSelectClick}
      />
      {posts?.map((post) => (
        <PostBox post={post} key={post.id} />
      ))}
    </div>
  );
};

export default withProtectedRoute(Search);
