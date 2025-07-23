"use client";

import { useState } from "react";
import Tiptap from "./Tiptap";
import { formatCreatedDate } from "@/utils/date";
import LikeMvpButtonBar from "./LikeMvpButtonBar";
import { addLike, addStock } from "@/lib/api";

// TODO: ArticleDetail型をtypes/ディレクトリで管理する
/**
 * 記事詳細のデータ型
 * @property id - 記事id
 * @property username - ユーザーネーム
 * @property firstName - 名字
 * @property lastName - 名前
 * @property title - 記事タイトル
 * @property body - 記事本文
 * @property createdAt - 作成日
 * @property likeCount - いいね数
 * @property mvpCount - MVP数
 */
type ArticleDetail = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    title: string;
    body: string;
    createdAt: string;
    likeCount: number;
    mvpCount: number;
};

/**
 * ArticleDetailコンポーネントのプロパティ型
 * @property articleDetail - 記事詳細データ
 */
type ArticleDetailProps = {
    articleDetail: ArticleDetail;
};

/**
 * ArticleDetailコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns 記事詳細コンポーネント
 */
export default function ArticleDetail({ articleDetail }: ArticleDetailProps) {
    // like, mvp数を管理するstate
    const [likeCount, setLikeCount] = useState(articleDetail.likeCount);
    const [mvpCount, setMvpCount] = useState(articleDetail.mvpCount);

    // ユーザーがいいね、MVPボタンを押したかどうかを管理するstate
    const [isLiked, setIsLiked] = useState(false);
    const [isMvped, setIsMvped] = useState(false);

    // いいねボタン押下時のハンドラ
    const handleLike = async () => {
        try {
            await addLike(articleDetail.id);
            // いいね済みにして、いいね数を+1する
            setIsLiked(true);
            setLikeCount((prev) => prev + 1);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    // MVPボタン押下時のハンドラ
    const handleMvp = async () => {
        try {
            await addStock(articleDetail.id);
            // MVP済みにして、MVP数を+1する
            setIsMvped(true);
            setMvpCount((prev) => prev + 1);
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            }
        }
    };

    return (
        <>
            <LikeMvpButtonBar
                likeCount={likeCount}
                onLike={handleLike}
                isLiked={isLiked}
                mvpCount={mvpCount}
                onMvp={handleMvp}
                isMvped={isMvped}
            />
            <div className="max-w-4xl mx-auto px-4">
                <div className="font-bold text-center text-4xl">
                    {articleDetail.title}
                </div>
                <div className="text-gray-500 text-center mt-5 mb-10">
                    {formatCreatedDate(articleDetail.createdAt)}に公開
                </div>
                {/* <div className="text-gray-500 text-center mt-5 mb-10">{articleDetail.username}（{articleDetail.lastName} {articleDetail.firstName}）</div> */}
                <Tiptap articleDetail={articleDetail} editable={false} />
            </div>
        </>
    );
}
