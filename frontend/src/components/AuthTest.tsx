"use client";

import { signInWithEmail } from "@/app/_actions/auth";
import { useAuth } from "@/components/AuthProvider";
import { useActionState, useState } from "react";

export function AuthTest() {
    const {
        user,
        login,
        logout,
        signup,
        isLoading,
        showLoginModal,
        openLoginModal,
        closeLoginModal,
        pendingAction,
        setPendingAction,
    } = useAuth();

    const [email, setEmail] = useState("ryuichi12150105syhrh@gmail.com");
    const [error, setError] = useState<string | null>(null);

    const [signInState, signInAction, isPending] = useActionState(
        signInWithEmail,
        null
    );

    const handleLogout = async () => {
        setError(null);
        try {
            await logout();
            console.log("✅ ログアウト成功");
        } catch (error) {
            console.error("❌ ログアウトエラー:", error);
            setError(
                error instanceof Error
                    ? error.message
                    : "ログアウトに失敗しました"
            );
        }
    };

    const handlePendingActionTest = () => {
        // setPendingAction: (action?: () => Promise<void>) => void;
        setPendingAction(async () => {
            console.log("🔄 PendingAction実行中...");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log("✅ PendingAction完了");
        });
        openLoginModal();
    };

    if (isLoading) {
        return (
            <div
                style={{
                    padding: "20px",
                    border: "2px solid #007bff",
                    margin: "20px",
                }}
            >
                <h2>🔄 認証状態を確認中...</h2>
            </div>
        );
    }

    return (
        <div
            style={{
                padding: "20px",
                border: "2px solid #ccc",
                margin: "20px",
                backgroundColor: "#f9f9f9",
            }}
        >
            <h2>🧪 認証テスト</h2>

            {/* 現在の認証状態 */}
            <div style={{ marginBottom: "20px" }}>
                <h3>現在の状態</h3>
                {user ? (
                    <div style={{ color: "green" }}>
                        <p>✅ ログイン済み</p>
                        <p>
                            <strong>ID:</strong> {user.id}
                        </p>
                        <p>
                            <strong>Username:</strong> {user.username}
                        </p>
                        <p>
                            <strong>Avatar URL:</strong>{" "}
                            {user.avatar_url || "未設定"}
                        </p>
                        <p>
                            <strong>Role:</strong> {user.role}
                        </p>
                    </div>
                ) : (
                    <div style={{ color: "red" }}>
                        <p>❌ 未ログイン</p>
                    </div>
                )}
            </div>

            {/* エラー表示 */}
            {signInState?.error && (
                <div
                    style={{
                        color: "red",
                        backgroundColor: "#ffebee",
                        padding: "10px",
                        marginBottom: "20px",
                    }}
                >
                    <strong>エラー:</strong> {signInState.error}
                </div>
            )}

            {signInState?.success && (
                <div
                    style={{
                        color: "black",
                        backgroundColor: "#ffebee",
                        padding: "10px",
                        marginBottom: "20px",
                    }}
                >
                    {signInState.message}
                </div>
            )}

            {/* ログイン済みの場合 */}
            {user ? (
                <div>
                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#dc3545",
                            color: "white",
                            border: "none",
                            marginRight: "10px",
                        }}
                    >
                        ログアウト
                    </button>
                    <button
                        onClick={handlePendingActionTest}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                        }}
                    >
                        PendingActionテスト
                    </button>
                </div>
            ) : (
                /* 未ログインの場合 */
                <div>
                    <div style={{ marginBottom: "20px" }}>
                        <h3>ログイン</h3>
                        <form action={signInAction}>
                            <div style={{ marginBottom: "10px" }}>
                                <input
                                    type="email"
                                    placeholder="メールアドレス"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        marginRight: "10px",
                                        padding: "5px",
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    style={{
                                        padding: "5px 15px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                    }}
                                >
                                    ログイン
                                </button>
                            </div>
                        </form>
                    </div>
                    <div>
                        <button
                            onClick={openLoginModal}
                            style={{
                                padding: "10px 20px",
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                            }}
                        >
                            ログインモーダルを開く
                        </button>
                    </div>
                </div>
            )}

            {/* モーダル表示 */}
            {showLoginModal && (
                <div
                    style={{
                        position: "fixed",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "white",
                        padding: "20px",
                        border: "2px solid #333",
                        zIndex: 1000,
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                >
                    <h3>ログインモーダル</h3>
                    <p>モーダルが表示されました</p>
                    <p>PendingAction: {pendingAction ? "あり" : "なし"}</p>
                    <button
                        onClick={closeLoginModal}
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                        }}
                    >
                        閉じる
                    </button>
                </div>
            )}
        </div>
    );
}
