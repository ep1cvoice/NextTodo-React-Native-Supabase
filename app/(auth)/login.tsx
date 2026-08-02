import { useMemo, useState } from 'react';
import { Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import { Mail, Lock } from 'lucide-react-native';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Heading from '@/components/ui/Heading';
import Field from '@/components/ui/Field';
import Button from '@/components/ui/Button';
import Linking from '@/components/ui/Linking';
import AuthLayout, { LoggingInOverlay } from '@/components/ui/AuthLayout';
import type { AppColors } from '@/constants/theme';

export default function LoginScreen() {
  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);
  const [formMessage, setFormMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const { signIn } = useAuth();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const router = useRouter();
  const params = useLocalSearchParams<{ registered?: string }>();

  const registeredMessage = useMemo(
    () =>
      params.registered === '1'
        ? 'Account created successfully. You can now log in.'
        : '',
    [params.registered]
  );

  const displayMessage = formMessage || registeredMessage;
  const displayIsError = !!formMessage && isError;

  const validate = (vals: typeof values) => {
    const temp: Record<string, string> = {};
    if (!vals.email) temp.email = 'Email is required';
    if (!vals.password) temp.password = 'Password is required';
    return temp;
  };

  const handleSubmit = async () => {
    setSubmitted(true);
    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length !== 0) return false;

    setLoggingIn(true);
    setFormMessage('');
    setIsError(false);

    const { error } = await signIn(values.email, values.password);

    if (error) {
      setLoggingIn(false);
      setIsError(true);
      setFormMessage(error);
      return false;
    }

    router.replace('/(main)/(tabs)/active' as Href);
    return false;
  };

  return (
    <AuthLayout gap={48} overlay={loggingIn ? <LoggingInOverlay /> : null}>
      <Heading title="Welcome Back" text="Sign in to manage your tasks" />
      {!!displayMessage && (
        <Text style={displayIsError ? styles.errorInfo : styles.successInfo}>
          {displayMessage}
        </Text>
      )}
      <Field
        innerText="Enter your email"
        Icon={Mail}
        id="email"
        type="email"
        label="Email"
        value={values.email}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, email: text }));
          setErrors((prev) => ({ ...prev, email: '' }));
        }}
        error={submitted ? errors.email : ''}
      />
      <Field
        innerText="Enter your password"
        Icon={Lock}
        id="password"
        type="password"
        label="Password"
        value={values.password}
        onChangeText={(text) => {
          setValues((prev) => ({ ...prev, password: text }));
          setErrors((prev) => ({ ...prev, password: '' }));
        }}
        error={submitted ? errors.password : ''}
      />
      <Button inner="Sign in" onPress={handleSubmit} />
      <Linking to={'/(auth)/register' as Href} innerText="Don't have an account? Sign up" />
    </AuthLayout>
  );
}

function createStyles(colors: AppColors) {
  return StyleSheet.create({
    successInfo: {
      color: colors.green,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '500',
    },
    errorInfo: {
      color: colors.red,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: '500',
    },
  });
}
