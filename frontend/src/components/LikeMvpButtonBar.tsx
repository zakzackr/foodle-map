'use client'

import { FaHeart, FaTrophy } from "react-icons/fa";

/**
 * LikeMvpButtonBarコンポーネントのプロパティ型
 * @property likeCount - いいね数
 * @property onLike - いいね押下時のハンドラ
 * @property isLiked - いいね済みかを示すフラグ
 * @property mvpCount - MVP数
 * @property onMVP - MVP押下時のハンドラ
 * @property isMvped - MVP済みかを示すフラグ
 */
type LikeMvpProps = {
    likeCount: number;
    onLike: () => void;
    isLiked: boolean;
    mvpCount: number;
    onMvp: () => void;
    isMvped: boolean;
}


/**
 * LikeMvpButtonBarコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns 記事詳細画面に表示されるいいね・MVPコンポーネント
 */
export default function LikeMvpButtonBar({likeCount, onLike, isLiked, mvpCount, onMvp, isMvped}: LikeMvpProps){

    return (
        <>
            {/* md以上の時は、flex要素として表示する */}
            <div className="hidden md:flex flex-col fixed left-15 top-1/2 -translate-y-1/2 z-50 gap-1">
                <button className="cursor-pointer" onClick={onLike}>
                    <FaHeart size={24} className={isLiked ? "text-red-400" : "text-gray-300"} />
                </button>
                <span className="text-center text-xs text-gray-400">{likeCount}</span>
                <button className="cursor-pointer" onClick={onMvp}>
                    <FaTrophy size={24} className={isMvped ? "text-yellow-400" : "text-gray-300"} />
                </button>
                <span className="text-center text-xs text-gray-400">{mvpCount}</span>
            </div>
            {/* md以上の時は、display:noneにして非表示 */}
            <div className="flex md:hidden fixed bottom-0 left-0 w-full justify-center bg-white border-t z-50 py-2 gap-1">
                <button className="cursor-pointer" onClick={onLike}>
                    <FaHeart size={24} className={isLiked ? "text-red-400" : "text-gray-300"}  />
                </button>
                <span className="text-center text-xs text-gray-400">{likeCount}</span>

                <button className="cursor-pointer" onClick={onMvp}>
                    <FaTrophy size={24} className={isMvped ? "text-yellow-400" : "text-gray-300"}  />
                </button>
                <span className="text-center text-xs text-gray-400">{mvpCount}</span>

            </div>
        </>
    )
}