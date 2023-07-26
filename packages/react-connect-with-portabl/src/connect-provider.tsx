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

  const getIsAuthenticated = useCallback(
    () => client.getIsAuthenticated(),
    [client],
  );

  const [authState, setAuthState] = useState<IConnectAuthState>({
    ...DEFAULT_AUTH_STATE,
    isAuthenticated: getIsAuthenticated(),
  });

  const handleRedirectCallback = useCallback(
    async () => client.handleRedirectCallback(),
    [client],
  );

  const getAccessTokenSilently = useCallback(
    async () => client.getAccessToken(),
    [client],
  );

  const logout = useCallback(async () => {
    client.logout();

    setAuthState(prevAuthState => ({
      ...prevAuthState,
      isAuthenticated: false,
      isLoading: false,
    }));
  }, [client]);

  const loginWithRedirect = useCallback(
    async () => client.loginWithRedirect(),
    [client],
  );

  const hasHandledRedirectCallbackRef = useRef(false);

  useEffect(() => {
    if (hasHandledRedirectCallbackRef.current) {
      return;
    }

    hasHandledRedirectCallbackRef.current = true;

    if (hasResponseCode()) {
      (async () => {
        await handleRedirectCallback();

        setAuthState(prevAuthState => ({
          ...prevAuthState,
          isAuthenticated: true,
          isLoading: false,
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
      loginWithRedirect,
      getAccessTokenSilently,
      logout,
    }),
    [authState, loginWithRedirect, getAccessTokenSilently, logout],
  );

  return (
    <ConnectContext.Provider value={contextValue}>
      {children}
    </ConnectContext.Provider>
  );
};
