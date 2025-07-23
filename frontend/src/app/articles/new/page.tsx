'use client'

import ArticlePost from "@/components/ArticlePost";
import ArticlePostHeader from "@/components/ArticlePostHeader";
import { postArticle } from "@/lib/api";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useRouter } from "next/navigation";
import { useState } from "react";


/**
 * 記事の新規作成画面
 * @returns 記事の新規作成画面
 */
export default function ArticlePostPage() {

    // 親コンポーネントでフォーム状態を管理する
    const [title, setTitle] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    // Editorインスタンスを生成
    const editor = useEditor({
        // StarterKit: 見出し・太字・リストなど一般的な編集機能がセットになった拡張セット
        extensions: [StarterKit],  
        content: "",  // 本文なしの状態で初期化する
        editorProps: {
            attributes: {
                class: "m-5 focus:outline-none",  // Editor内のアウトラインを非表示にする
            },
        },
    });

    // ArticlePostHeader内の投稿ボタン押下時のハンドラ
    const handleSubmit = async () => {
        // validationを行う
        if (!title || !editor || editor.isEmpty){
            if (!title.trim()) {
                setError("タイトルは必須です")
                return
            }
            if (!editor || editor.isEmpty) {
                setError("本文が空です")
                return
            }
            setError("")
            return;
        }

        // editor内の本文をJSONで取得してから、DB保存用にJSON文字列に変換
        const bodyJson = editor.getJSON();
        const body = JSON.stringify(bodyJson);

        try {
            // 記事投稿APIの呼び出し
            await postArticle({ title, body });
            // 記事投稿完了後に、記事一覧画面に遷移
            router.push('/');
        } catch (error: unknown) {
            if (error instanceof Error){
                setError(error.message);
            } else {
                setError("記事の投稿に失敗しました");
            }
        }
    };

    return (
        <div>
            <ArticlePostHeader onSubmit={handleSubmit} title ={title} editor={editor} />
            <div className="pt-30 pb-12">
                <ArticlePost title={title} setTitle={setTitle} error={error} editor={editor}/>
            </div>
        </div>
    )
}