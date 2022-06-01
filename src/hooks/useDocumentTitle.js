import { useEffect } from 'react';

const useDocumentTitle = (title = '') => {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return null;
};

export default useDocumentTitle;
