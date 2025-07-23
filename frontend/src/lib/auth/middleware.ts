import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";
import { AppUser } from "@/types/user";

/**
 * 認証ミドルウェア
 * 認証が必要なページへのアクセス制御とリダイレクト処理を行う
 */

/**
 * 認証が必要なパス（ページパス）
 */
const PROTECTED_PATHS = [
    "/dashboard",
    "/profile",
    "/articles/new",
    "/articles/edit",
];

/**
 * 認証済みユーザーがアクセスできないパス（ページパス）
 */
const AUTH_PAGES = ["/login", "/signup", "/register"];

/**
 * 認証ミドルウェアのメイン処理
 * @param request NextRequest
 * @returns NextResponse
 */
export async function authMiddleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request);

    const pathname = request.nextUrl.pathname;

    // 保護されたページへのアクセス制御
    if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
        if (!user) {
            // 未認証の場合、ログインページにリダイレクト
            const redirectUrl = new URL("/login", request.url);
            // ログイン後に元のページにリダイレクト
            redirectUrl.searchParams.set("redirect", pathname);
            return NextResponse.redirect(redirectUrl);
        }
    }

    // 認証ページへのアクセス制御（認証済みユーザー）
    if (AUTH_PAGES.includes(pathname)) {
        if (user) {
            // 認証済みの場合、ホームページにリダイレクト
            // TODO: ダッシュボードページ作成後は '/dashboard' に変更
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    // セッション更新されたレスポンスを返す
    return supabaseResponse;
}

// /**
//  * Main authentication middleware handler.
//  * @param request - Incoming NextRequest object.
//  * @returns NextResponse - Response after handling authentication logic.
//  */
// export async function authMiddleware(request: NextRequest) {
//     let supabaseResponse = NextResponse.next({
//         request,
//     });

//     // Create Supabase server-side client
//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll();
//                 },
//                 setAll() {
//                     // Read-only setting (for getClaims)
//                 },
//             },
//         }
//     );

//     const { data, error } = await supabase.auth.getClaims();
//     let user: AppUser | null = null;

//     if (error || !data || !data.claims) {
//         // Refresh Supabase session (token refresh)
//         // Internally calls getUser()
//         ({ supabaseResponse, user } = await updateSession(request));
//     } else {
//         // Construct user object from claims
//         user = {
//             id: data.claims.sub,
//             username: data.claims.username,
//             avatar_url: data.claims.avatar_url,
//             role: data.claims.role || "user",
//         };
//     }

//     const pathname = request.nextUrl.pathname;

//     // Access control for protected pages
//     if (PROTECTED_PATHS.some((path) => pathname.startsWith(path))) {
//         if (!user) {
//             // If not authenticated, redirect to login page
//             const redirectUrl = new URL("/login", request.url);
//             // Redirect back to the original page after login
//             redirectUrl.searchParams.set("redirect", pathname);
//             return NextResponse.redirect(redirectUrl);
//         }
//     }

//     // Access control for auth pages (authenticated users)
//     if (AUTH_PAGES.includes(pathname)) {
//         if (user) {
//             // If already authenticated, redirect to homepage
//             // TODO: Change to '/dashboard' after dashboard page creation
//             return NextResponse.redirect(new URL("/", request.url));
//         }
//     }

//     // Return response with potentially updated session
//     return supabaseResponse;
// }
