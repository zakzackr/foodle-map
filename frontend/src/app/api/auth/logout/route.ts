import { createErrorResponse, ERROR_CODES } from "@/lib/apiResponse";
import { createClient } from "@/lib/supabase/server";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

/**
 * ログアウト用のRoute Handler
 * @param request - HTTPリクエスト
 * @returns ログイン結果
 */

export async function POST() {
    try {
        // supabaseクライアントを作成
        const supabase = await createClient();

        // ログアウト
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.error("Supabase logout error:", error);
        }

        // ログアウト成功時のレスポンス
        // signOut()が成功しても失敗しても、このレスポンスが返され、
        // SupabaseのミドルウェアがCookieをクリアするヘッダーを添付します。

        // TODO: signOut成功時も失敗時も、supabase middlewareがmax-age:0をセットにより、Cookieが自動クリアされるか確認
        const response = NextResponse.json(
            {
                message: "ログアウトに成功しました",
            },
            { status: StatusCodes.OK }
        );

        // ログアウト失敗時用に、手動でCookieを削除
        response.cookies.set("sb-access-token", "", {
            path: "/",
            maxAge: 0,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // 本番環境では、true
            sameSite: "strict",
        });

        return response;
    } catch (error) {
        console.error("Logout API error:", error);
        return createErrorResponse(
            ERROR_CODES.INTERNAL_SERVER_ERROR,
            "予期せぬエラーが発生しました",
            StatusCodes.INTERNAL_SERVER_ERROR
        );
    }
}
