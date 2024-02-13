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
import { DEFAULT_AUTH_STATE, RESPONSE_CODE_SEARCH_PARAM } from './constants';
import { ConnectContext } from './connect-context';

export const hasResponseCode = (searchParams: URLSearchParams): boolean =>
  !!searchParams.get(RESPONSE_CODE_SEARCH_PARAM);

type ConnectProviderProps = IConnectClientOptions & {
  readonly children: React.ReactNode;
  /**
   * Used to detect the response_code query string when handling the response callback.
   *
   * @remarks
   * This prop is only necessary when using SSR to allow hydration to work properly.
   * Otherwise it defaults to `URLSearchParams(window.location.search)` which works for client only implementations
   *
   * @example
   * Usage with Next.js:
   * ```
   * 'use client'
   *
   * import { useSearchParams } from 'next/navigation';
   *
   *  export default function MyApp() {
   *    const searchParams = useSearchParams()
   *
   *    return (
   *      <ConnectProvider
   *       accountId={PORTABL_ACCOUNT_ID}
   *       projectId={PORTABL_VERIFY_ISSUE_PROJECT_ID}
   *       connectDomain={PORTABL_CONNECT_DOMAIN}       )
   *       walletDomain={PORTABL_WALLET_DOMAIN}
   *       searchParams={searchParams}
   *      >
   *        {children}
   *      </ConnectProvider
   *    )
   *  }
   * ```
   */
  readonly searchParams?: URLSearchParams;
};

export const ConnectProvider = ({
  children,
  searchParams,
  ...clientOptions
}: ConnectProviderProps) => {
  const [client] = useState(() => new ConnectClient(clientOptions));

  // We default to this, but allow overrides for SSR to prevent hydration issues
  const defaultClientSearchParams =
    typeof window !== 'undefined'
      ? new URLSearchParams(window.location.search)
      : new URLSearchParams();

  const getIsAuthorized = useCallback(() => client.getIsAuthorized(), [client]);
  const isResponseCodePresent = hasResponseCode(
    searchParams ?? defaultClientSearchParams,
  );

  const [authState, setAuthState] = useState<IConnectAuthState>({
    ...DEFAULT_AUTH_STATE,
    isHandlingResponse: isResponseCodePresent,
    isLoading: isResponseCodePresent,
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
      isHandlingResponse: false,
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
