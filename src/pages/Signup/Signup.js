import { Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthErrorCodes } from 'Firebase';
import { withAuthRoute } from 'hoc';

import { Button, Text, Input } from 'components';
import { validateRegister } from 'utils/formValidations';
import { authErrorMessage } from 'constants/authMessage';
import { signup } from 'store/reducers/slices';

const Signup = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (values, { resetForm, setFieldError }) => {
    const { password, confirmPassword } = values;
    let message;

    if (password !== confirmPassword) {
      return setFieldError('confirmPassword', 'Passwords donot match');
    }

    try {
      const res = await dispatch(signup(values)).unwrap();
      if (res?.id) {
        navigate('/', { replace: true });
      }
    } catch (err) {
      if (err?.code === AuthErrorCodes.EMAIL_EXISTS) {
        message = authErrorMessage.EMAIL_IN_USE;
      } else {
        message = err?.message;
      }
    }

    resetForm({
      values: { ...values, password: '', confirmPassword: '' },
      errors: { message },
      touched: {
        password: true,
        confirmPassword: true,
      },
    });
    return null;
  };

  return (
    <div className="w-full p-4 max-w-md mx-auto my-8">
      <Text
        variant="h5"
        className="text-3xl md:text-4xl mt-1 text-center text-white font-medium mb-6"
      >
        Signup to get started
      </Text>
      <Formik
        initialValues={{
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
        }}
        validationSchema={validateRegister()}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit: handleFormikSubmit, isSubmitting, values, errors, isValid }) => {
          return (
            <>
              {errors?.message && (
                <Text
                  variant="p"
                  className="text-red-500 bg-red-400 bg-opacity-30 p-2 mb-4 rounded-md text-center"
                >
                  {errors.message || 'Oops! Some error occurred'}
                </Text>
              )}
              <Form autoComplete="off" onSubmit={handleFormikSubmit}>
                <Input
                  name="username"
                  type="text"
                  className=""
                  placeholder="Username"
                  value={values.username}
                />
                <Input name="email" type="email" placeholder="Email" value={values.email} />
                <Input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={values.password}
                />
                <Input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={values.confirmPassword}
                />
                <Button
                  component="button"
                  type="submit"
                  className="mt-4 p-2 text-gray-200 rounded-md text-lg"
                  disabled={
                    isSubmitting ||
                    !isValid ||
                    Boolean(
                      values.username === '' ||
                        values.email === '' ||
                        values.password === '' ||
                        values.confirmPassword === ''
                    )
                  }
                >
                  {isSubmitting ? 'Submitting...' : 'Sign Up'}
                </Button>
              </Form>
            </>
          );
        }}
      </Formik>
    </div>
  );
};

export default withAuthRoute(Signup);
