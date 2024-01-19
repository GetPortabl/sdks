import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  ConnectClient,
  IConnectClientOptions,
} from '@portabl/js-connect-with-portabl';
import { IConnectAuthState } from './types';
import { DEFAULT_AUTH_STATE, RESPONSE_CODE_REGEX } from './constants';
import { ConnectContext } from './connect-context';

export const hasResponseCode = (
  searchParams = window.location.search,
): boolean => RESPONSE_CODE_REGEX.test(searchParams);

type ConnectProviderProps = IConnectClientOptions & {
  readonly children: React.ReactNode;
};

export const ConnectProvider = ({
  children,
  ...clientOptions
}: ConnectProviderProps) => {
  const [client] = useState(() => new ConnectClient(clientOptions));

  const getIsAuthorized = useCallback(() => client.getIsAuthorized(), [client]);
  const isResponseCodePresent =
    typeof window !== 'undefined' && hasResponseCode();

  const [authState, setAuthState] = useState<IConnectAuthState>({
    ...DEFAULT_AUTH_STATE,
    isHandlingResponse: isResponseCodePresent,
    isAuthorized: getIsAuthorized(),
  });

  const handleRedirectCallback = useCallback(
    async () => client.handleRedirectCallback(),
    [client],
  );

  const resetAuthorization = useCallback(async () => {
    client.resetAuthorization();

    setAuthState(prevAuthState => ({
      ...prevAuthState,
      isAuthorized: false,
      isLoading: false,
      error: Error,
      user: undefined,
      idTokenJwt: undefined,
      vpToken: undefined,
    }));
  }, [client]);

  const authorizeWithRedirect = useCallback(async () => {
    setAuthState(prevAuthState => ({
      ...prevAuthState,
      isLoading: true,
      isInitiating: true,
    }));
    await client.authorizeWithRedirect();
  }, [client]);

  const hasHandledRedirectCallbackRef = useRef(false);

  useEffect(() => {
    if (hasHandledRedirectCallbackRef.current) {
      return;
    }

    hasHandledRedirectCallbackRef.current = true;

    if (isResponseCodePresent) {
      (async () => {
        setAuthState(prevAuthState => ({
          ...prevAuthState,
          isHandlingResponse: true,
          isLoading: true,
        }));

        try {
          await handleRedirectCallback();
        } catch (e) {
          setAuthState(prevAuthState => ({
            ...prevAuthState,
            error: e,
          }));
        }

        setAuthState(prevAuthState => ({
          ...prevAuthState,
          isAuthorized: true,
          isLoading: false,
          isHandlingResponse: false,
          vpToken: client.vpTokenJsonLd,
          idTokenJwt: client.idTokenJwt,
          user: client.idTokenClaims,
        }));
      })();
    } else {
      setAuthState(prevAuthState => ({
        ...prevAuthState,
        isLoading: false,
      }));
    }
  }, [handleRedirectCallback]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      authorizeWithRedirect,
      resetAuthorization,
    }),
    [authState, authorizeWithRedirect, resetAuthorization],
  );

  return (
    <ConnectContext.Provider value={contextValue}>
      {children}
    </ConnectContext.Provider>
  );
};
