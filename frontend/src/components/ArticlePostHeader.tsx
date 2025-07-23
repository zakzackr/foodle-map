import { Button } from "./ui/button";
import { Editor } from "@tiptap/react";
import { ChevronLeftIcon } from "lucide-react"
import Link from "next/link";


/**
 * ArticlePostHeaderコンポーネントのプロパティ型
 * @property onSubmit - 投稿するボタン押下時のハンドラ
 * @property title - 記事タイトル
 * @property editor - Tiptap Editorインスタンス
 */
type ArticlePostHeaderProps ={
    onSubmit: () => void;
    title: string;
    editor: Editor | null;
}


/**
 * ArticlePostHeaderコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns 記事投稿画面用のヘッダー
 */
export default function ArticlePostHeader({onSubmit, title, editor}: ArticlePostHeaderProps) {
    return (
        <header className="w-full fixed flex items-center justify-between h-16 px-52 border-b bg-white shadow">
            <Button variant="secondary">
                <Link href="/" className="flex items-center gap-1">
                    <ChevronLeftIcon />
                    <span>記事一覧へ</span>
                </Link>
            </Button>
            <Button
                type="submit"
                disabled={!editor || !title.trim()}
                className="cursor-pointer"
                onClick={onSubmit}
            >
                <span className="font-bold"> 投稿する</span>
            </Button>
        </header>
    )
}