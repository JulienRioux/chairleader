import { useMutation } from '@apollo/client';
import { Input, Loader, message } from 'components-library';
import { useAuth } from 'hooks/auth';
import { HalfImagePageLayout } from 'pages/auth-page';
import { AUTHENTICATE, VALIDATE_OTP } from 'queries';
import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Logger, routes, StorageKeys } from 'utils';

import { OtpPageWrapper, ResendCodeBtn } from './styled';

export const VerifyCodePage = () => {
  const { refetchMe, isLoading: useAuthIsLoading } = useAuth();

  const [authenticate, { loading: resendIsLoading }] =
    useMutation(AUTHENTICATE);
  const [validateOtp, { loading: isLoading }] = useMutation(VALIDATE_OTP);
  const { userEmail } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [validationCode, setValidationCode] = useState('');
  const [validationCodeErrorMsg, setValidationCodeErrorMsg] = useState('');

  const handleValidateOtp = useCallback(
    async (codeValue: string) => {
      try {
        // Validate the user code
        const res = await validateOtp({
          variables: {
            email: userEmail,
            validationCode: codeValue,
          },
        });

        const validateOtpResponse = res?.data?.validateOtp;
        const validateOtpMessage = validateOtpResponse.message;

        if (validateOtpMessage === 'VALID_CODE') {
          localStorage.setItem(StorageKeys.TOKEN, validateOtpResponse.token);
          refetchMe();
          return;
        }
        if (validateOtpMessage === 'INVALID_CODE') {
          setValidationCodeErrorMsg(
            "The code you entered doesn't match the code we sent."
          );
        }
        if (validateOtpMessage === 'INVALID_USER') {
          message.error('Something went wrong, please try again.');
          navigate(routes.auth);
        }
        if (validateOtpMessage === 'CODE_EXPIRED') {
          setValidationCodeErrorMsg(
            'Your code is expired. Please click on the "Resend Code" button.'
          );
        }
      } catch (err) {
        Logger.error(err);
        message.error();
      }
    },
    [navigate, refetchMe, userEmail, validateOtp]
  );

  useEffect(() => {
    // If there is a code in the URL (email link), set the valiation code and run the validation query
    const paramCode = searchParams.get('validationCode');
    if (paramCode) {
      setValidationCode(paramCode);
      handleValidateOtp(paramCode);
    }
  }, [handleValidateOtp, searchParams]);

  const handleChange = useCallback(
    async (e: any) => {
      const codeValue = e.target.value;
      if (codeValue.length <= 6) {
        setValidationCodeErrorMsg('');
        setValidationCode(e.target.value);
      }
      if (codeValue.length === 6) {
        handleValidateOtp(codeValue);
      }
    },
    [handleValidateOtp]
  );

  const handleResendCode = useCallback(async () => {
    // Reset the component state
    setValidationCode('');
    setValidationCodeErrorMsg('');

    // Authenticate
    try {
      const hostname = window.location.origin;
      const authenticateResponse = await authenticate({
        variables: { email: userEmail, hostname },
      });
      const signupStatus = authenticateResponse?.data?.authenticate?.status;
      if (signupStatus === 202) {
        message.success(`A new login email has been sent to ${userEmail}!`);
        return;
      }
    } catch (err) {
      message.error('Something went wrong... Please try again.');
      Logger.error(err);
    }
  }, [authenticate, userEmail]);

  const showLoadingState = isLoading || useAuthIsLoading;

  return (
    <HalfImagePageLayout>
      <OtpPageWrapper>
        <h1>Verify with code</h1>
        <p>We sent an email with login instructions to {userEmail}</p>

        {showLoadingState ? (
          <Loader />
        ) : (
          <>
            <Input
              label="Validation code"
              type="number"
              value={validationCode}
              onChange={handleChange}
              placeholder="••••••"
              error={validationCodeErrorMsg}
              name="validationCode"
              disabled={isLoading}
            />

            <p>
              Didn&apos;t receive a code?{' '}
              {resendIsLoading ? (
                'Sending a new link...'
              ) : (
                <ResendCodeBtn
                  onClick={handleResendCode}
                  disabled={resendIsLoading}
                >
                  Resend Code
                </ResendCodeBtn>
              )}
            </p>
          </>
        )}
      </OtpPageWrapper>
    </HalfImagePageLayout>
  );
};
