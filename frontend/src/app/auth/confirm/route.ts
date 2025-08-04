import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    // NextRequestから直接searchParamsを取得
    const { searchParams } = request.nextUrl;
    const token_hash = searchParams.get("token_hash");
    const type = searchParams.get("type") as EmailOtpType | null;
    const next = searchParams.get("next") ?? "/";

    // リダイレクト先のURLを検証し、外部リンクへのリダイレクトを防ぐ (Open Redirect脆弱性対策)
    // new URL() は、'next'が絶対パスでない場合、第二引数の 'request.url' を基準に解決します。
    const redirectTo = new URL(next, request.url);
    if (redirectTo.origin !== request.nextUrl.origin) {
        console.error(
            "リダイレクトエラー: 不正なリダイレクト先が指定されました。",
            {
                redirectTo: redirectTo.toString(),
                origin: request.nextUrl.origin,
            }
        );
        // 安全なエラーページへリダイレクト
        return NextResponse.redirect(new URL("/error", request.url));
    }

    // 必要なパラメータが存在するかチェック
    if (!token_hash || !type) {
        console.error(
            "Magic Link認証エラー: 必要なパラメータが不足しています。",
            {
                token_hash: !!token_hash,
                type: !!type,
            }
        );
        return NextResponse.redirect(new URL("/error", request.url));
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash,
    });

    if (error) {
        console.error("Magic Link認証失敗:", {
            message: error.message,
            code: error.code,
        });
        return NextResponse.redirect(new URL("/error", request.url));
    }

    // 認証成功後、検証済みのURLにリダイレクト
    return NextResponse.redirect(redirectTo);
}
