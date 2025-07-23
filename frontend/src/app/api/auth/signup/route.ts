import { createErrorResponse, ERROR_CODES } from "@/lib/apiResponse";
import { createClient } from "@/lib/supabase/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

/**
 * 新規登録用のRoute Handler
 * @param request - HTTPリクエスト
 * @returns ログイン結果
 */

export async function POST(request: Request) {
    try {
        const { email, password, username } = await request.json();

        // 入力validation
        if (!email || !password || !username) {
            return createErrorResponse(
                ERROR_CODES.VALIDATION_ERROR,
                "メールアドレス、パスワード、ユーザーネームが必要です",
                StatusCodes.BAD_REQUEST
            );
        }

        // パスワード強度チェック
        if (password.length < 8) {
            return createErrorResponse(
                ERROR_CODES.WEAK_PASSWORD,
                "パスワードは8文字以上で設定してください",
                StatusCodes.BAD_REQUEST
            );
        }

        // supabaseクライアントを作成
        const supabase = await createClient();

        // username, email, passwordで新規登録
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    username,
                    avatar_url: "", // 空文字で初期化
                    role: "user", // TODO: role名、adminの設定方法など確認
                },
            },
        });

        if (error) {
            console.error("Supabase signup error:", error);

            // error.codeで正確に判定
            switch (error.code) {
                // TODO: DUPLICATE_EMAILがerrorcodeで返された場合に、フロントでログイン画面に遷移
                case "email_exists":
                case "user_already_exists":
                    return createErrorResponse(
                        ERROR_CODES.DUPLICATE_EMAIL,
                        "このメールアドレスは既に登録されています",
                        StatusCodes.CONFLICT
                    );
                default:
                    return createErrorResponse(
                        ERROR_CODES.AUTHENTICATION_ERROR,
                        "新規登録に失敗しました",
                        StatusCodes.BAD_REQUEST
                    );
            }
        }

        // ユーザー情報のvalidation
        if (!data.user) {
            return createErrorResponse(
                ERROR_CODES.INTERNAL_SERVER_ERROR,
                "ユーザー情報の作成に失敗しました",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        return NextResponse.json(
            {
                message: "新規登録に成功しました",
                user: {
                    username: data.user.user_metadata?.username,
                    avatar_url: data.user.user_metadata?.avatar_url,
                    role: data.user.user_metadata?.role || "user",
                },
            },
            { status: StatusCodes.CREATED }
        );
    } catch (error) {
        console.error("Signup API error:", error);

        return createErrorResponse(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "予期せぬエラーが発生しました",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
