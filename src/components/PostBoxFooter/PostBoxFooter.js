import cn from 'clsx';
import { cloneElement } from 'react';
import { AiOutlineRetweet } from 'react-icons/ai';
import { BsBookmark, BsBookmarkFill } from 'react-icons/bs';
import { MdThumbUp, MdOutlineThumbUpOffAlt, MdOutlineComment } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { updatePost } from 'store/reducers/slices';
import { selectAuthUser } from 'store/selectors';

const footerItems = [
  { name: 'likes', outlined: <MdOutlineThumbUpOffAlt />, contained: <MdThumbUp /> },
  { name: 'retweets', outlined: <AiOutlineRetweet />, contained: <AiOutlineRetweet /> },
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
    <div className="flex justify-start items-center w-full">
      {footerItems.map((item) => {
        const itemLength = post?.[item.name]?.length;
        const postClicked = post?.[item.name]?.includes(user.id);
        const icon = postClicked ? item.contained : item.outlined;
        return (
          <div
            className="relative tooltip text-inherit flex items-center mr-4 font-thin"
            onClick={() => {
              const type = postClicked ? 'DELETE' : 'UPDATE';
              handleOnButtonClick(item.name, type);
            }}
            role="button"
            aria-hidden
            key={item.name}
            data-tooltip={item.name}
          >
            {cloneElement(icon, {
              className: cn('block text-xl font-thin hover:text-slate-600', {
                'text-sm': item.name === 'bookmarks',
              }),
            })}
            <p className="text-base ml-2">{itemLength}</p>
          </div>
        );
      })}
      <Link
        to={`/comment/${post?.id}`}
        className="relative tooltip flex items-center mr-4 font-thin"
        data-tooltip="Comments"
      >
        <MdOutlineComment className={cn('block text-xl font-thin hover:text-slate-600 ')} />
        <p className="text-base ml-2">{post?.comments?.length}</p>
      </Link>
    </div>
  );
};

export default PostBoxFooter;
