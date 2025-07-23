import { AppUser } from "@/types/user";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, NextRequest } from "next/server";

/**
 * Supabaseクライアント（ミドルウェア）
 * Server ComponentからはCookieに書き込みできないので、middlewareでトークンのリフレッシュを行い保存する。
 *
 * Key roles:
 * アクセストークンをリフレッシュ
 * リフレッシュされたアクセストークンをServer Componentにパスする
 * リフレッシュされたアクセストークンをClient Componentにパスする
 *
 * Details:
 * Refreshing the Auth token (by calling supabase.auth.getUser).
 *
 * ref: https://supabase.com/docs/guides/auth/server-side/nextjs
 */

export async function updateSession(
    request: NextRequest
): Promise<{ supabaseResponse: NextResponse; user: AppUser | null }> {
    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({
                        request,
                    });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()
    // DONT USE getSession() inside Server Components.

    const { data, error } = await supabase.auth.getClaims();

    if (error || !data || !data.claims) {
        // TODO: might need to call getUser() to refresh the session if getClaims doesn't
        // const {
        //     data: { user },
        // } = await supabase.auth.getUser();

        return { supabaseResponse, user: null };
    }

    const appUser: AppUser = {
        id: data.claims.id,
        username: data.claims.username,
        avatar_url: data.claims.avatar_url,
        role: data.claims.role || "user",
    };

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return { supabaseResponse, user: appUser };
}

// export async function updateSession(request: NextRequest) {
//     let supabaseResponse = NextResponse.next({
//         request,
//     });

//     const supabase = createServerClient(
//         process.env.NEXT_PUBLIC_SUPABASE_URL!,
//         process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
//         {
//             cookies: {
//                 getAll() {
//                     return request.cookies.getAll();
//                 },
//                 setAll(cookiesToSet) {
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         request.cookies.set(name, value)
//                     );
//                     supabaseResponse = NextResponse.next({
//                         request,
//                     });
//                     cookiesToSet.forEach(({ name, value, options }) =>
//                         supabaseResponse.cookies.set(name, value, options)
//                     );
//                 },
//             },
//         }
//     );

//     const { data, error } = await supabase.auth.getClaims();

//     let appUser: AppUser;

//     if (error || !data || !data.claims) {
//         // getClaims()失敗時のみgetUser()実行
//         // (トークンリフレッシュ + セッション検証)

//         const {
//             data: { user },
//         } = await supabase.auth.getUser();

//         appUser = {

//         }

//         return { supabaseResponse, user };
//     } else {

//         // 成功: claimsからuser情報を構築
//         user: AppUser = {
//         id: data.claims.sub,
//         username: data.claims.username,
//         avatar_url: data.claims.avatar_url,
//         role: data.claims.role || "user",
//     };
//     }

//     return { supabaseResponse, user };
// }
