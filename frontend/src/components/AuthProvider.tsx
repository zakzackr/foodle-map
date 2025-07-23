"use client";

import { createClient } from "@/lib/supabase/client";
import { AppUser } from "@/types/user";
import { createContext, useContext, useEffect, useState } from "react";

import {
    login as apiLogin,
    signup as apiSignup,
    logout as apiLogout,
} from "@/lib/api";

interface AuthContextType {
    user: AppUser | null;
    isLoading: boolean;

    // モーダル関連（ログインモーダル）
    showLoginModal: boolean;
    openLoginModal: () => void;
    closeLoginModal: () => void;

    // pending action（ログインモーダル表示後、元の操作を行う）
    pendingAction?: () => Promise<void>;
    setPendingAction: (action?: () => Promise<void>) => void;

    // 統一したsignup, login, logout処理と状態管理
    signup: (
        email: string,
        password: string,
        username: string
    ) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

// Contextオブジェクトを生成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AppUser | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
    const [pendingAction, setPendingAction] = useState<
        (() => Promise<void>) | undefined
    >(undefined);

    // supabaseクライアントの作成
    const supabase = createClient();

    useEffect(() => {
        // user情報の取得
        // 画面リロード時などは、supabaseからユーザー情報を取得する必要ある
        const getUser = async () => {
            try {
                const { data, error } = await supabase.auth.getClaims();

                if (error || !data || !data.claims) {
                    console.error("認証エラー", error);
                    throw Error("JWT claims取得エラー");
                }

                const appUser: AppUser = {
                    id: data.claims.sub,
                    username: data.claims.username,
                    avatar_url: data.claims.avatar_url,
                    role: data.claims.role || "user",
                };

                console.log("getClaims success!!");

                setUser(appUser);
            } catch (error) {
                // getClaims()失敗時はgetUser()にフォールバック
                try {
                    const {
                        data: { user },
                        error: getUserError,
                    } = await supabase.auth.getUser();

                    if (getUserError) {
                        console.error("ユーザー情報取得エラー:", getUserError);
                        setUser(null);
                    } else if (user) {
                        const appUser: AppUser = {
                            id: user.id,
                            username: user.user_metadata.username,
                            avatar_url: user.user_metadata.avatar_url,
                            role: user.user_metadata.role || "user",
                        };

                        setUser(appUser);
                    } else {
                        setUser(null);
                    }
                } catch (fallbackError) {
                    console.error(
                        "getUserフォールバックエラー:",
                        fallbackError
                    );
                    setUser(null);
                }
            } finally {
                setIsLoading(false);
            }
        };

        getUser();

        // 認証状態の変更を監視
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            // 認証状態変更時に実行されるcallback関数
            (event, session) => {
                if (session?.user) {
                    // ログイン状態 (SIGNED_IN, TOKEN_REFRESHEDなど全て含む)
                    const appUser: AppUser = {
                        id: session.user.id,
                        username: session.user.user_metadata?.username || "",
                        avatar_url: session.user.user_metadata.avatar_url,
                        role: session.user.user_metadata.role || "user",
                    };

                    console.log("onAuthStateChange login");
                    setUser(appUser);
                } else {
                    // 非ログイン状態 (SIGNED_OUT, 初期状態など全て含む)
                    console.log("onAuthStateChange signout");
                    setUser(null);
                }
                setIsLoading(false);
            }
        );

        // クリーンアップ関数により監視を停止（コンポーネントアンマウント時に実行）
        // TODO: クリーンアップ関数実行されるタイミングないかも、、
        return () => subscription.unsubscribe();
    }, []);

    // useEffect(() => {
    //     // user情報の取得
    //     // 画面リロード時などは、supabaseからユーザー情報を取得する必要ある
    //     const getUser = async () => {
    //         try {
    //             const {
    //                 data: { user: supabaseUser },
    //                 error,
    //             } = await supabase.auth.getUser();

    //             if (error) {
    //                 console.error("認証エラー", error);
    //                 setUser(null);
    //             } else if (supabaseUser) {
    //                 const appUser: AppUser = {
    //                     id: supabaseUser.id,
    //                     username: supabaseUser.user_metadata?.username,
    //                     avatar_url: supabaseUser.user_metadata?.avatar_url,
    //                     role: supabaseUser.user_metadata?.role || "user",
    //                 };

    //                 setUser(appUser);
    //             } else {
    //                 setUser(null);
    //             }
    //         } catch (error) {
    //             console.error("ユーザー情報取得エラー:", error);
    //             setUser(null);
    //         } finally {
    //             setIsLoading(false);
    //         }
    //     };

    //     getUser();

    //     // 認証状態の変更を監視
    //     const {
    //         data: { subscription },
    //     } = supabase.auth.onAuthStateChange(
    //         // 認証状態変更時に実行されるcallback関数
    //         (event, session) => {
    //             if (session?.user) {
    //                 // ログイン状態 (SIGNED_IN, TOKEN_REFRESHEDなど全て含む)
    //                 const appUser: AppUser = {
    //                     id: session.user.id,
    //                     username: session.user.user_metadata?.username || "",
    //                     avatar_url: session.user.user_metadata.avatar_url,
    //                     role: session.user.user_metadata.role || "user",
    //                 };

    //                 setUser(appUser);
    //             } else {
    //                 // 非ログイン状態 (SIGNED_OUT, 初期状態など全て含む)
    //                 setUser(null);
    //             }
    //             setIsLoading(false);
    //         }
    //     );

    //     // クリーンアップ関数により監視を停止（コンポーネントアンマウント時に実行）
    //     // TODO: クリーンアップ関数実行されるタイミングないかも、、
    //     return () => subscription.unsubscribe();
    // }, []);

    // 非ログインユーザーが投稿、いいね機能などを使用しようとした時にログインモーダルを表示
    // ログイン完了後、投稿、いいね機能を実行
    useEffect(() => {
        if (user && pendingAction) {
            pendingAction();
            setPendingAction(undefined);
            setShowLoginModal(false); // ログイン完了後にモーダルを閉じる
        }
    }, [user, pendingAction]);

    const openLoginModal = () => setShowLoginModal(true);
    const closeLoginModal = () => {
        setShowLoginModal(false);
        setPendingAction(undefined);
    };

    const login = async (email: string, password: string) => {
        await apiLogin(email, password);
    };

    const signup = async (
        email: string,
        password: string,
        username: string
    ) => {
        await apiSignup(email, password, username);
    };

    const logout = async () => {
        await apiLogout();
    };

    const value: AuthContextType = {
        user,
        isLoading,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        pendingAction,
        setPendingAction,
        signup,
        login,
        logout,
    };

    return (
        // Contextオブジェクトが持つProviderは、Contextの適用範囲を決定する
        // Provider内の子要素でvalueの受け渡しが可能（valueが更新されると子コンポーネントは全て再レンダリング）
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

// useAuthフック
// 各コンポーネントでAuthContextにアクセス可能にする
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuthはAuthProviderの内側で使用してください");
    }

    return context;
};
