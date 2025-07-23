'use client'

import { Editor, EditorContent } from "@tiptap/react"
import { Input } from "./ui/input"
import TiptapToolbar from "./TiptapToolbar"


/**
 * ArticlePostコンポーネントのプロパティ型
 * @property title - 記事タイトル
 * @property setTitle - 記事タイトルを更新する関数
 * @property error - 記事投稿時のエラーメッセージ
 * @property editor - Tiptap Editorインスタンス
 */
type ArticlePostProps ={
    title: string;
    setTitle: (title: string) => void;
    error: string;
    editor: Editor | null;
}


/**
 * ArticlePostコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns 記事投稿コンポーネント
 */
export default function ArticlePost({ title, setTitle, error, editor }: ArticlePostProps){

    return (
        <form className="space-y-4 w-full max-w-4xl mx-auto">
            {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <Input
                type="text"
                placeholder="記事タイトル"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="font-bold"
                required
            />
            <div className="border min-h-[70vh] rounded-xl p-4 bg-background">
                <TiptapToolbar editor={editor}/>
                <EditorContent editor={editor} />
            </div>
        </form>
    )
}