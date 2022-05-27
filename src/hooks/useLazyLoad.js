import { useCallback, useEffect, useRef, useState } from 'react';

const PAGE_LIMIT = 3;

const useLazyLoad = (posts = [], target = {}) => {
  const [pageNum, setPageNum] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const postFeed = posts.slice(0, pageNum * PAGE_LIMIT);
  const observer = useRef(null);
  const elem = target?.current;
  const hasPosts = pageNum !== PAGE_LIMIT;

  const handleIntersection = useCallback((entries) => {
    const entry = entries[0];

    if (entry.isIntersecting) {
      setIsLoading(true);
      setTimeout(() => {
        setPageNum((prev) => prev + 1);
        setIsLoading(false);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(handleIntersection, { threshold: 1 });

    if (elem && observer.current) {
      observer.current.observe(elem);
    }
    return () => {
      if (observer.current && elem) {
        observer.current.unobserve(elem);
      }
    };
  }, [elem, handleIntersection]);

  return {
    pageNum,
    postFeed,
    isLoading,
    hasPosts,
  };
};

export default useLazyLoad;
