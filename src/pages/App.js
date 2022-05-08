import { lazy, Suspense, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Loader, Navbar, NotFound } from 'components';
import { auth, onAuthStateChanged } from 'Firebase';
import { setUser, requestGetUserData } from 'store/reducers/slices';

const HomePage = lazy(() => import('./Home/Home'));
const SignupPage = lazy(() => import('./Signup/Signup'));
const SigninPage = lazy(() => import('./Signin/Signin'));
const SearchPage = lazy(() => import('./Search/Search'));
const ProfilePage = lazy(() => import('./Profile/Profile'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
        dispatch(requestGetUserData(user.uid));
      } else {
        dispatch(dispatch(setUser(null)));
      }
    });
  }, [dispatch]);

  return (
    <div className="bg-gray-800 min-h-screen w-full">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <HomePage />
              </Suspense>
            }
          />
          <Route
            path="/signup"
            element={
              <Suspense fallback={<Loader />}>
                <SignupPage />
              </Suspense>
            }
          />
          <Route
            path="/signin"
            element={
              <Suspense fallback={<Loader />}>
                <SigninPage />
              </Suspense>
            }
          />
          <Route
            path="/search"
            element={
              <Suspense fallback={<Loader />}>
                <SearchPage />
              </Suspense>
            }
          />
          <Route
            path="/profile/:username"
            element={
              <Suspense fallback={<Loader />}>
                <ProfilePage />
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
