import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabaseクライアント（クライアントコンポーネント）
 */

// ブラウザからSupabase APIにアクセスするための設定
export const createClient = () => {
    // CCでSupabaseクライアントを生成
    return createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};
