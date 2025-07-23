'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ArticleDetail from './ArticleDetail';

/**
 * Tiptap用のコンポーネント
 * https://tiptap.dev/docs/editor/getting-started/install/nextjs
 */

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
}


/**
 * Tiptapコンポーネントのプロパティ型
 * @property articleDetail - ArticleDetailオブジェクト
 * @property editable - 記事が編集可能かどうかを示すフラグ
 */
type TiptapProps = {
    articleDetail: ArticleDetail;  
    editable: boolean;
}


/**
 * Tiptapエディタコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns EditorContent - エディタ本体となるコンポーネント
 */
export default function Tiptap({articleDetail, editable = true}: TiptapProps){
    // 記事本文をJSON文字列からJSONに変換
    const content = JSON.parse(articleDetail.body);
    // TiptapのEditorインスタンスを作成。
    const editor = useEditor({
        extensions: [StarterKit],
        content: content,
        editable
    });
    
    return (
        <EditorContent editor={editor} />
    )
}

