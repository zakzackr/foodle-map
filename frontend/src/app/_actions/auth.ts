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
    prevState: any,
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
            // Magic Link クリック後のリダイレクト先
            emailRedirectTo: "",
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
 * メールアドレスの基本バリデーション
 */
function isValidEmail(email: string): boolean {
    // 基本チェック: @の前後に1文字以上の文字が存在するか
    const basicPattern = /^.+@.+$/;
    return basicPattern.test(email.trim());
}

/**
 * Signout用のServer Action
 */
export async function signout() {
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
