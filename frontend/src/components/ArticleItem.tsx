'use client'

import { FaHeart, FaTrophy } from "react-icons/fa";

import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';


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
 * ArticleItemコンポーネントのプロパティ型
 * @property article - 記事データ（記事一覧表示用）
 */
type ArticleItemProps = {
    article: Article;
}


/**
 * ArticleItemコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns 記事一覧表示画面内の記事コンポーネント
 */
export default function ArticleItem({ article }: ArticleItemProps){
    const router = useRouter();
    // click時に詳細ページに遷移
    const handleClick = () => {
        router.push(`/articles/${article.id}`);
    };

    return (
        <div>
            <Card className="w-full max-w-sm cursor-pointer" onClick={handleClick}>
                <CardContent>
                    <div className="flex flex-col">
                        <div className="font-bold">{ article.title }</div>
                        <div className="mt-2">{ article.username}（{ article.lastName } { article.firstName }）</div>
                        <div className="flex items-center mt-1 gap-1">
                            <FaHeart size={16} className="text-gray-300"/>
                            { article.likeCount }
                            <FaTrophy size={16} className="text-gray-300 ml-2"/>
                            { article.mvpCount }
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}