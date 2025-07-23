import { Editor } from '@tiptap/react';

import { 
    RiH1, 
    RiH2, 
    RiH3, 
    RiBold, 
    RiItalic, 
    RiListUnordered, 
    RiListOrdered, 
    RiStrikethrough, 
    RiArrowGoBackLine, 
    RiArrowGoForwardLine 
} from "react-icons/ri";


/**
 * TiptapToolbarコンポーネントのプロパティ型
 * @property editor - Tiptap Editorインスタンス
 */
type ToolbarProps = {
    editor: Editor | null;
}


/**
 * Tiptapエディタ用のツールバーコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns ツールバーコンポーネント
 */
export default function TiptapToolbar({ editor }: ToolbarProps) {
    if (!editor) return null;

    return (
    <div className="flex gap-2 border-b mb-2 px-2 py-1 bg-gray-50">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? "opacity-20" : ""}>
            <RiH1 />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? "opacity-20" : ""}>
            <RiH2 />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? "opacity-20" : ""}>
            <RiH3 />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? "opacity-20" : ""}>
            <RiBold />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? "opacity-20" : ""}>
            <RiItalic />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? "opacity-20" : ""}>
            <RiStrikethrough />
        </button>
        <button
            type="button" 
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive('bulletList') ? "opacity-20" : ""}
            >
            <RiListUnordered />
        </button>
        <button
            type="button" 
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive('orderedList') ? "opacity-20" : ""}
            >
            <RiListOrdered />
        </button>
        <button type="button" onClick={() => editor.chain().focus().undo().run()}>
            <RiArrowGoBackLine  />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()}>
            <RiArrowGoForwardLine />
        </button>
    </div>
    );
}
