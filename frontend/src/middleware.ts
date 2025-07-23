import { NextRequest } from "next/server";
import { authMiddleware } from "@/lib/auth/middleware";

/**
 * Next.js ミドルウェアのエントリーポイント
 * 全てのページアクセスに対して認証チェックを実行
 */
export async function middleware(request: NextRequest) {
    return authMiddleware(request);
}

/**
 * ミドルウェアを適用するパスの設定
 */
export const config = {
    // TODO: 認証が必要なページのみ個別に設定
    // 記事編集画面 etc...
    matcher: ["/dashboard/:path*", "/articles/new", "/profile/:path*"],
};
