import cn from 'clsx';

const variants = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  p: 'p',
  div: 'div',
};
const Text = ({ variant, className, align, ...props }) => {
  const Component = variants[variant] || 'p';
  return <Component className={cn(className)} {...props} />;
};

export default Text;
