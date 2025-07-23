const goApiBaseUrl =
    process.env.GO_API_BASE_URL || "http://localhost:8080/api/v1";

// TODO: export const createClient = () => {}で統一

/**
 * 記事一覧を取得
 * @param token 認証用トークン（SSRで利用）
 * @returns 記事一覧の配列
 * @throws API通信エラー時に例外を投げる
 */
// export async function fetchArticles(token: string) {
//     const res = await fetch(`${baseUrl}/articles`, {
//         headers: {
//             'Cookie': `accessToken=${token}`
//         }
//     });

//     if (!res.ok) {
//         const errorJson = await res.json();
//         throw new Error(errorJson.message || '記事一覧の取得に失敗しました。');
//     }
//     return res.json();
// }

export async function fetchArticles() {
    const res = await fetch(`${goApiBaseUrl}/articles`);

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "記事一覧の取得に失敗しました。");
    }
    return res.json();
}

/**
 * 記事詳細を取得
 * @param articleId 記事ID
 * @param token 認証用トークン（SSRで利用）
 * @returns 記事データ
 * @throws API通信エラー時に例外を投げる
 */
// export async function fetchArticleById(articleId: string | number, token: string | undefined) {
//     const res = await fetch(`${baseUrl}/articles/${articleId}`, {
//         headers: {
//             'Cookie': `accessToken=${token}`
//         }
//     });
//     if (!res.ok) {
//         const errorJson = await res.json();
//         throw new Error(errorJson.message || '記事の取得に失敗しました。');
//     }
//     return res.json();
// }

export async function fetchArticleById(articleId: string | number) {
    const res = await fetch(`${goApiBaseUrl}/articles/${articleId}`);
    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "記事の取得に失敗しました。");
    }
    return res.json();
}

/**
 * 記事投稿で使用する入力データ型
 * @property title - 記事のタイトル
 * @property body - 記事の本文
 */
type ArticlePostInput = {
    title: string;
    body: string;
};

/**
 * 記事を投稿する
 * @param articlePostInput - 投稿する記事データ（タイトルと本文）
 * @returns 作成された記事データ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */

export async function postArticle({ title, body }: ArticlePostInput) {
    const res = await fetch(`/api/articles`, {
        method: "POST",
        body: JSON.stringify({ title, body }),
        headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "記事の投稿に失敗しました。");
    }
    return res.json();
}

/**
 * 記事にいいねを追加する
 * @param articleId - 記事のID
 * @returns 更新後の記事データ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
export async function addLike(articleId: string | number) {
    const res = await fetch(`/api/articles/${articleId}/likes`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "いいねに失敗しました。");
    }
    return res.json();
}

/**
 * 記事にMVPを追加する
 * @param articleId - 記事のID
 * @returns 更新後の記事データ
 * @throws API通信エラー時に例外を投げる
 * @note Cookieをクロスオリジンに送信するため、credentials: 'include' を指定
 */
export async function addStock(articleId: string | number) {
    const res = await fetch(`/api/articles/${articleId}/stock`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const errorJson = await res.json();
        if (errorJson.code === "MAX_MVP_LIMIT_EXCEEDED") {
            throw new Error(errorJson.message);
        } else {
            throw new Error(errorJson.message || "MVPに失敗しました。");
        }
    }
    return res.json();
}

/**
 * ユーザーの新規登録を行う
 * @param email - メールアドレス
 * @param password - パスワード
 * @param lastName - 名字
 * @param firstName - 名前
 * @param username - ユーザーネーム
 * @returns 作成されたユーザーデータ
 * @throws API通信エラー時に例外を投げる
 * @note 新規登録後にCookieを受け取るために、credentials: 'include' を指定
 */
export async function signup(
    email: string,
    password: string,
    username: string
) {
    const res = await fetch(`/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email,
            password,
            username,
        }),
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(
            errorJson.message || "新規ユーザー登録に失敗しました。"
        );
    }
    return res.json();
}

/**
 * ユーザーのログインを行う
 * @param email - メールアドレス
 * @param password - パスワード
 * @returns ログインしたユーザーのデータ
 * @throws API通信エラー時に例外を投げる
 * @note ログイン後にCookieを受け取るために、credentials: 'include' を指定
 */
export async function login(email: string, password: string) {
    console.log(email);
    console.log(password);

    const res = await fetch(`/api/auth/login`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "ログインに失敗しました。");
    }
    return res.json();
}

/**
 * ユーザーのログアウトを行う
 * @returns ログアウト成功のメッセージ
 * @throws API通信エラー時に例外を投げる
 * @note 有効期限切れのCookieを受け取るために、credentials: 'include' を指定
 */
export async function logout() {
    const res = await fetch(`/api/auth/logout`, {
        method: "POST",
        credentials: "include",
    });

    if (!res.ok) {
        const errorJson = await res.json();
        throw new Error(errorJson.message || "ログアウトに失敗しました。");
    }
    return res.text();
}
