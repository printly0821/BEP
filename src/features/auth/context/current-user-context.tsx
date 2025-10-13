"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { match, P } from "ts-pattern";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser-client";
import type {
  CurrentUserContextValue,
  CurrentUserSnapshot,
} from "../types";

const CurrentUserContext = createContext<CurrentUserContextValue | null>(null);

type CurrentUserProviderProps = {
  children: ReactNode;
  initialState: CurrentUserSnapshot;
};

export const CurrentUserProvider = ({
  children,
  initialState,
}: CurrentUserProviderProps) => {
  const queryClient = useQueryClient();
  // 초기 상태를 loading으로 설정하여 클라이언트에서 항상 fresh 체크
  const [snapshot, setSnapshot] = useState<CurrentUserSnapshot>({
    status: "loading",
    user: initialState.user,
  });

  const refresh = useCallback(async () => {
    setSnapshot((prev) => ({ status: "loading", user: prev.user }));
    const supabase = getSupabaseBrowserClient();

    try {
      const result = await supabase.auth.getUser();

      const nextSnapshot = match(result)
        .with({ data: { user: P.nonNullable } }, ({ data }) => ({
          status: "authenticated" as const,
          user: {
            id: data.user.id,
            email: data.user.email,
            appMetadata: data.user.app_metadata ?? {},
            userMetadata: data.user.user_metadata ?? {},
          },
        }))
        .otherwise(() => ({ status: "unauthenticated" as const, user: null }));

      setSnapshot(nextSnapshot);
      queryClient.setQueryData(["currentUser"], nextSnapshot);
    } catch (error) {
      const fallbackSnapshot: CurrentUserSnapshot = {
        status: "unauthenticated",
        user: null,
      };
      setSnapshot(fallbackSnapshot);
      queryClient.setQueryData(["currentUser"], fallbackSnapshot);
    }
  }, [queryClient]);

  // 마운트 시 세션 체크 및 인증 상태 변경 리스너 설정
  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    // 초기 세션 체크 - refreshSession으로 강제 갱신
    const initializeAuth = async () => {
      // refreshSession을 먼저 시도하여 세션을 갱신
      const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();

      if (refreshError) {
        // refreshSession 실패 시 getSession으로 fallback
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setSnapshot({
            status: "authenticated",
            user: {
              id: session.user.id,
              email: session.user.email,
              appMetadata: session.user.app_metadata ?? {},
              userMetadata: session.user.user_metadata ?? {},
            },
          });
        } else {
          setSnapshot({ status: "unauthenticated", user: null });
        }
      } else {
        if (refreshedSession?.user) {
          setSnapshot({
            status: "authenticated",
            user: {
              id: refreshedSession.user.id,
              email: refreshedSession.user.email,
              appMetadata: refreshedSession.user.app_metadata ?? {},
              userMetadata: refreshedSession.user.user_metadata ?? {},
            },
          });
        } else {
          setSnapshot({ status: "unauthenticated", user: null });
        }
      }
    };

    initializeAuth();

    // 인증 상태 변경 리스너
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setSnapshot({
          status: "authenticated",
          user: {
            id: session.user.id,
            email: session.user.email,
            appMetadata: session.user.app_metadata ?? {},
            userMetadata: session.user.user_metadata ?? {},
          },
        });
      } else {
        setSnapshot({ status: "unauthenticated", user: null });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 마운트 시 한 번만 실행

  const value = useMemo<CurrentUserContextValue>(() => {
    return {
      ...snapshot,
      refresh,
      isAuthenticated: snapshot.status === "authenticated",
      isLoading: snapshot.status === "loading",
    };
  }, [refresh, snapshot]);

  return (
    <CurrentUserContext.Provider value={value}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUserContext = () => {
  const value = useContext(CurrentUserContext);

  if (!value) {
    throw new Error("CurrentUserProvider가 트리 상단에 필요합니다.");
  }

  return value;
};
