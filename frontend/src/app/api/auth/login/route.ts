import { createErrorResponse, ERROR_CODES } from "@/lib/apiResponse";
import { createClient } from "@/lib/supabase/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

/**
 * ログイン用のRoute Handler
 * @param request - HTTPリクエスト
 * @returns ログイン結果
 */

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // 入力validation
        if (!email || !password) {
            return createErrorResponse(
                ERROR_CODES.VALIDATION_ERROR,
                "メールアドレスとパスワードが必要です",
                StatusCodes.BAD_REQUEST
            );
        }

        // supabaseクライアントを作成
        const supabase = await createClient();

        // ログイン
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            console.error("Supabase login error:", error);

            // error.codeで正確に判定
            switch (error.code) {
                case "invalid_credentials":
                    return createErrorResponse(
                        ERROR_CODES.AUTHENTICATION_ERROR,
                        "メールアドレスまたはパスワードが正しくありません",
                        StatusCodes.UNAUTHORIZED
                    );
                default:
                    return createErrorResponse(
                        ERROR_CODES.AUTHENTICATION_ERROR,
                        "ログインに失敗しました",
                        StatusCodes.UNAUTHORIZED
                    );
            }
        }

        // ユーザー情報のvalidation
        if (!data.user) {
            return createErrorResponse(
                ERROR_CODES.INTERNAL_SERVER_ERROR,
                "ユーザー情報の取得に失敗しました",
                StatusCodes.INTERNAL_SERVER_ERROR
            );
        }

        // TODO: username, avatar_urlなどの返却を検討
        return NextResponse.json(
            {
                message: "ログインに成功しました",
                user: {
                    id: data.user.user_metadata?.id,
                    username: data.user.user_metadata?.username,
                    avatar_url: data.user.user_metadata?.avatar_url,
                    role: data.user.user_metadata?.role || "user",
                },
            },
            { status: StatusCodes.OK }
        );
    } catch (error) {
        return createErrorResponse(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "予期せぬエラーが発生しました",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
