import { Form, Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AuthErrorCodes } from 'Firebase';
import { withAuthRoute } from 'hoc';

import { Button, Text, Input } from 'components';
import { validateLogin } from 'utils/formValidations';
import { authErrorMessage } from 'constants/authMessage';
import { signin } from 'store/reducers/slices';
import { selectAuthState } from 'store/selectors';
import useDocumentTitle from 'hooks/useDocumentTitle';

const GUEST_EMAIL = process.env.REACT_APP_GUEST_EMAIL;
const GUEST_PASSWORD = process.env.REACT_APP_GUEST_PASSWORD;

const Signin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useDocumentTitle('Search | Chatter');

  const { loading } = useSelector(selectAuthState);

  const handleSubmit = async (values, { resetForm }) => {
    let message;

    try {
      const res = await dispatch(signin(values)).unwrap();

      if (res?.id) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err?.code === AuthErrorCodes.INVALID_PASSWORD) {
        message = authErrorMessage.WRONG_PASSWORD;
      } else if (err?.code === AuthErrorCodes.USER_DELETED) {
        message = authErrorMessage.USER_NOT_FOUND;
      } else {
        message = err?.message;
      }
    }

    resetForm({
      values: { ...values, password: '' },
      errors: { message },
      touched: {
        password: true,
      },
    });
    return null;
  };

  return (
    <div className="w-full h-screen md:h-fit bg-slate-700 border-stone-600 border-1 max-w-md mx-auto md:translate-y-24 p-4 rounded-md">
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validationSchema={validateLogin()}
        onSubmit={handleSubmit}
      >
        {({
          handleSubmit: handleFormikSubmit,
          isSubmitting,
          values,
          errors,
          touched,
          setValues,
        }) => {
          const isLoading = isSubmitting || loading === 'pending';
          return (
            <>
              <Text
                variant="h5"
                className="text-2xl text-center translate-y-20 md:translate-y-6 text-blue-500 font-bold mb-6"
              >
                Sign in to continue
              </Text>
              {errors?.message && (
                <Text
                  variant="p"
                  className="text-red-500 bg-red-400 bg-opacity-30 translate-y-20 md:translate-y-6 p-2 mb-4 rounded-md text-center"
                >
                  {errors.message || 'Oops! Some error occurred'}
                </Text>
              )}
              <Form
                autoComplete="off"
                onSubmit={handleFormikSubmit}
                className="py-8 translate-y-20 md:translate-y-0"
              >
                <Input
                  name="email"
                  hasLabel
                  label="Email"
                  type="email"
                  placeholder="johndoe@test.com"
                  value={values.email}
                />
                <Input
                  name="password"
                  type="password"
                  hasLabel
                  label="Password"
                  placeholder="******"
                  value={values.password}
                />
                <Button
                  component="button"
                  type="submit"
                  className="mt-4 p-2 text-gray-300 bg-blue-500 hover:bg-blue-600 rounded-md font-semibold"
                  disabled={Boolean(
                    isLoading || !touched || values.email === '' || values.password === ''
                  )}
                >
                  {isLoading ? 'Submitting...' : 'Signin'}
                </Button>
                <Button
                  component="button"
                  type="submit"
                  className="my-4 p-2 text-blue-500 font-semibold bg-transparent rounded-md border-2 border-blue-500"
                  disabled={isLoading}
                  onClick={() => {
                    setValues({
                      email: GUEST_EMAIL,
                      password: GUEST_PASSWORD,
                    });
                  }}
                >
                  {isLoading ? 'Submitting...' : 'Signin with Guest account'}
                </Button>
                <Text className="text-gray-300 text-center">
                  Not registered?{' '}
                  <Link
                    to="/signup"
                    className="text-white font-medium hover:border-b-2 border-white"
                  >
                    Sign up
                  </Link>
                </Text>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default withAuthRoute(Signin);
