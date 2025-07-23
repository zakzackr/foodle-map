import ArticleDetail from "@/components/ArticleDetail";
import Header from "@/components/Header";
import { fetchArticleById } from "@/lib/api";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";


/**
 * ArticleDetailPageコンポーネントのプロパティ型
 * @property params - Next.jsのルーティングで渡される、記事ID（id）を含むオブジェクトのPromise
 */
type ArticleDetailProps = {
    params: Promise<{
        id: string;
    }>;
}

/**
 * 記事詳細画面
 * @returns 記事詳細画面
 */
// export default async function ArticleDetailPage({params} : ArticleDetailProps) {
//     // Cookieからアクセストークンを取得
//     const cookieStore = await cookies();
//     const token = cookieStore.get("accessToken");

//     // TODO: 例外ハンドリングを行い、エラーメッセージの表示
//     // 記事詳細取得用APIの呼び出し
//     const articleDetail = await fetchArticleById((await params).id, token?.value);

//     let role: string | undefined = undefined;
//     let username: string | undefined = undefined;
//     if (token){
//         // 秘密鍵のデコード
//         const jwtSecret = Buffer.from(process.env.JWT_SECRET!, "base64"); 
//         // JWTをdecodeしてroleを取得
//         const decoded = jwt.verify(token.value, jwtSecret);

//         if (typeof decoded === "object"){
//             if ("role" in decoded) {
//                 role = (decoded as JwtPayload).role as string;
//             }

//             if ("sub" in decoded){
//                 username = (decoded as JwtPayload).sub as string;
//             }
//         }
//     }

//     return (
//         <div>
//             <Header role={role} username={username}/>
//             <div className="pt-30 pb-12">
//                 <ArticleDetail articleDetail={articleDetail} />
//             </div>
//         </div>
//     )
// }

export default async function ArticleDetailPage({params} : ArticleDetailProps) {

    // TODO: 例外ハンドリングを行い、エラーメッセージの表示
    // 記事詳細取得用APIの呼び出し
    const articleDetail = await fetchArticleById((await params).id);

    return (
        <div>
            <Header/>
            <div className="pt-30 pb-12">
                <ArticleDetail articleDetail={articleDetail} />
            </div>
        </div>
    )
}