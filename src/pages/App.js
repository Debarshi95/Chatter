import { lazy, Suspense, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader, Navbar, NotFound } from 'components';
import { auth, onAuthStateChanged } from 'Firebase';
import { getAuthUserData } from 'store/reducers/slices';
import { selectAuthUser } from 'store/selectors';

const HomePage = lazy(() => import('./Home/Home'));
const SignupPage = lazy(() => import('./Signup/Signup'));
const SigninPage = lazy(() => import('./Signin/Signin'));
const SearchPage = lazy(() => import('./Search/Search'));
const ProfilePage = lazy(() => import('./Profile/Profile'));
const IndexPage = lazy(() => import('components/Wrapper/Wrapper'));
const TrendingPage = lazy(() => import('./Trending/Trending'));

const App = () => {
  const dispatch = useDispatch();
  const authUser = useSelector(selectAuthUser);

  useEffect(() => {
    let unsub;
    const fetchUser = () => {
      return onAuthStateChanged(auth, (user) => {
        if (user) {
          dispatch(getAuthUserData(user));
        }
      });
    };
    if (!authUser) {
      unsub = fetchUser();
    }

    return () => {
      if (typeof unsub === 'function') {
        unsub();
      }
    };
  }, [authUser, dispatch]);

  return (
    <div className="bg-gray-800 min-h-screen w-full font-poppins">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <IndexPage />
              </Suspense>
            }
          >
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
    </div>
  );
};

export default App;
