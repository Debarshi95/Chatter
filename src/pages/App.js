import { lazy, Suspense, useEffect } from 'react';
import { Loader, Navbar } from 'components';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { auth, onAuthStateChanged } from 'Firebase';
import { useDispatch } from 'react-redux';
import { setUser } from 'store/reducers/slices';

const HomePage = lazy(() => import('./Home/Home'));
const SignupPage = lazy(() => import('./Signup/Signup'));
const SigninPage = lazy(() => import('./Signin/Signin'));

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        dispatch(setUser(user));
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
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
