import ArticleList from "@/components/ArticleList";
import Header from "@/components/Header";
import { fetchArticles } from "@/lib/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthTest } from "@/components/AuthTest";

/**
 * ホーム画面（記事一覧ページ）
 * - Cookie内にアクセストークンが存在しない場合は、ログインページへリダイレクト
 * - JWTの検証に失敗した場合は、ログインページへリダイレクト
 * - JWTの検証に成功した場合のみ、記事一覧取得用のAPIを呼び出す
 *
 * @returns 記事一覧表示画面
 */
export default async function Home() {
    // Cookieからアクセストークンを取得
    // const cookieStore = await cookies();
    // const token = cookieStore.get("accessToken");

    // 認証済みでない場合は、login画面に遷移
    // if (!token) {
    //     redirect("/login");
    // }

    // 秘密鍵のデコード
    // const jwtSecret = Buffer.from(process.env.JWT_SECRET!, "base64");

    // let decoded: JwtPayload;
    // try {
    //     // JWTの検証
    //     decoded = jwt.verify(token.value, jwtSecret!) as JwtPayload;
    // } catch (error: unknown) {
    //     // JWTの検証に失敗した場合はlogin画面に遷移
    //     redirect("/login");
    // }

    // let role: string | undefined = undefined;
    // let username: string | undefined = undefined;

    // if (typeof decoded === "object"){
    //     // JWTからユーザーの権限を取得
    //     if ("role" in decoded) {
    //         role = decoded.role as string;
    //     }

    //     // JWTからユーザーの権限を取得
    //     if ("sub" in decoded){
    //         username = decoded.sub as string;
    //     }
    // }

    // 記事一覧を取得
    // const articles = await fetchArticles(token.value);
    // return (
    // 	<main className="pb-12">
    // 		<Header role={role} username={username}/>
    // 		<div className="pt-30">
    // 			<ArticleList articles={articles} />
    // 		</div>
    // 	</main>
    // );

    const res = await fetchArticles();
    return (
        <main className="pb-12">
            <Header />
            <div className="pt-30">
                <AuthTest />
                <ArticleList articles={res.articles} />
            </div>
        </main>
    );
}
