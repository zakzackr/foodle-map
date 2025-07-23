import ArticleItem from "./ArticleItem";


// TODO: Article型をtypes/ディレクトリで管理する

/**
 * 記事のデータ型（記事一覧表示用）
 * @property id - 記事id
 * @property title - 記事タイトル
 * @property createdAt - 作成日
 * @property username - ユーザーネーム
 * @property firstName - 名字
 * @property lastName - 名前
 * @property likeCount - いいね数
 * @property mvpCount - MVP数
 */
type Article = {
    id: string;
    title: string;
    createdAt: string;
    username: string;
    firstName: string;
    lastName: string;
    likeCount: number;
    mvpCount: number;
}


/**
 * ArticleListコンポーネントのプロパティ型
 * @property articles - 記事の配列
 */
type ArticleListProps = {
    articles: Article[];  
}


/**
 * ArticleListコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns 記事一覧表示コンポーネント
 */
export default function ArticleList({ articles }: ArticleListProps) {
    return (
        <div className="max-w-4xl mx-auto px-4 grid gap-5 grid-cols-1 md:grid-cols-2">
            {articles.map(article => (
                <ArticleItem key={article.id} article={article} />
            ))}
        </div>
    )
};
