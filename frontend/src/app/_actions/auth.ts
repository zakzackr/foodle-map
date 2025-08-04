"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

type AuthState = {
    success?: boolean;
    message?: string;
    error?: string;
};

/**
 * Magic Link認証用のServer Action
 * Signup/Signinに対応
 */
export async function signInWithEmail(
    _prevState: AuthState | null,
    formData: FormData
): Promise<AuthState> {
    // メールアドレスのvalidation
    const email = formData.get("email") as string;
    if (!isValidEmail(email)) {
        // エラーログを表示
        console.error({
            message: "Invalid email.",
            timestamp: new Date().toISOString(),
        });
        return { error: "有効なメールアドレスを入力してください" };
    }

    const supabase = await createClient();

    // MagicLinkでのsignup/signin
    const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
            // TODO: Magic Link クリック後のリダイレクト先の設定
            // TODO: /auth/callbackがないとトークン処理ができない？要調査
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
        },
    });

    if (error) {
        // エラーログを表示
        console.error({
            message: "Supabase signin failed.",
            error: error.message,
            code: error.code,
            timestamp: new Date().toISOString(),
        });

        if (error.code == "over_email_send_rate_limit") {
            return {
                error: "送信制限に達しました。しばらく待ってから再度お試しください。",
            };
        }

        return {
            error: "認証に失敗しました。メールアドレスを確認してください。",
        };
    }

    // TODO: redirect先をログインページ遷移前にする
    return {
        success: true,
        message: "確認メールを送信しました。メールボックスをご確認ください。",
    };
}

/**
 * メールアドレスのバリデーション（RFC準拠）
 */
function isValidEmail(email: string): boolean {
    const trimmed = email.trim();
    
    if (trimmed.length === 0 || trimmed.length > 254) return false;
    
    const emailPattern = /^[a-zA-Z0-9]([a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9]([a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    
    if (!emailPattern.test(trimmed)) return false;
    
    // 追加チェック
    const [local] = trimmed.split('@');
    return local.length <= 64 && !trimmed.includes('..');
}

/**
 * Signout用のServer Action
 */
export async function signOut(
    _prevState: AuthState | null,
    _formData: FormData
): Promise<AuthState> {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
        console.error({
            message: "Supabase signout failed.",
            error: error.message,
            code: error.code,
            timestamp: new Date().toISOString(),
        });
    }
    // TODO: ログアウトが失敗しても、ホーム画面に遷移？
    // キャッシュされたページを無効化。認証状態のキャッシュをクリア
    revalidatePath("/", "layout");
    redirect("/");
}
