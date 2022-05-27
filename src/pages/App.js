import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader, NotFound, Wrapper as IndexPage } from 'components';
import { getAuthUserData } from 'store/reducers/slices';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from 'Firebase';
import { Toaster } from 'react-hot-toast';

const HomePage = lazy(() => import('./Home/Home'));
const SignupPage = lazy(() => import('./Signup/Signup'));
const SigninPage = lazy(() => import('./Signin/Signin'));
const SearchPage = lazy(() => import('./Search/Search'));
const ProfilePage = lazy(() => import('./Profile/Profile'));
const TrendingPage = lazy(() => import('./Trending/Trending'));
const CommentPage = lazy(() => import('./Comment/Comment'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = () => {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(getAuthUserData(user));
        }
      });
    };

    const unsub = fetchUser();

    return () => {
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, [dispatch]);

  return (
    <div className="bg-gray-800 min-h-screen w-full font-poppins">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<IndexPage />}>
            <Route
              path="/"
              index
              element={
                <Suspense fallback={<Loader />}>
                  <HomePage />
                </Suspense>
              }
            />
            <Route
              path="profile/:username"
              element={
                <Suspense fallback={<Loader />}>
                  <ProfilePage />
                </Suspense>
              }
            />
            <Route
              path="search"
              index
              element={
                <Suspense fallback={<Loader />}>
                  <SearchPage />
                </Suspense>
              }
            />
            <Route
              path="trending"
              index
              element={
                <Suspense fallback={<Loader />}>
                  <TrendingPage />
                </Suspense>
              }
            />
            <Route
              path="comment/:postId"
              index
              element={
                <Suspense fallback={<Loader />}>
                  <CommentPage />
                </Suspense>
              }
            />
          </Route>

          <Route
            path="/signup"
            index
            element={
              <Suspense fallback={<Loader />}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route
            path="/signin"
            index
            element={
              <Suspense fallback={<Loader />}>
                <SigninPage />
              </Suspense>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
};

export default App;
