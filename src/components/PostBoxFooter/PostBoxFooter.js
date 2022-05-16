import cn from 'clsx';
import { cloneElement } from 'react';
import { AiFillHeart, AiOutlineHeart, AiOutlineRetweet } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from 'store/reducers/slices';
import { selectAuthUser } from 'store/selectors';

const footerItems = [
  { name: 'retweets', outlined: <AiOutlineRetweet />, contained: <AiOutlineRetweet /> },
  { name: 'likes', outlined: <AiOutlineHeart />, contained: <AiFillHeart /> },
  { name: 'bookmarks', outlined: <BsBookmark />, contained: <BsBookmarkFill /> },
];

const PostBoxFooter = ({ post, onUpdate }) => {
  const dispatch = useDispatch();

  const user = useSelector(selectAuthUser);

  const handleOnButtonClick = (path = 'likes', type = 'UPDATE') => {
    if (type === 'UPDATE') {
      dispatch(
        updatePost({
          type,
          postId: post.id,
          userId: user.id,
          path,
        })
      );
    } else {
      dispatch(
        updatePost({
          type: 'DELETE',
          postId: post.id,
          userId: user.id,
          path,
        })
      );
    }
    if (onUpdate) {
      onUpdate();
    }
  };

  return (
    <div className="flex justify-between w-2/3 ml-auto">
      {footerItems.map((item) => {
        const itemLength = post?.[item.name]?.length;
        const postClicked = post?.[item.name]?.includes(user.id);
        const icon = postClicked ? item.contained : item.outlined;
        return (
          <div
            className="text-inherit flex items-center"
            onClick={() => {
              const type = postClicked ? 'DELETE' : 'UPDATE';
              handleOnButtonClick(item.name, type);
            }}
            role="button"
            aria-hidden
            key={item.name}
          >
            {cloneElement(icon, {
              className: cn({
                'text-slate-500': postClicked,
                'text-xl': item.name === 'bookmarks',
              }),
            })}
            <p className="text-base ml-2">{itemLength}</p>
          </div>
        );
      })}
    </div>
  );
};

export default PostBoxFooter;
