const PostBoxContent = ({ children, ...props }) => {
  return <article {...props}>{children}</article>;
};

export default PostBoxContent;
