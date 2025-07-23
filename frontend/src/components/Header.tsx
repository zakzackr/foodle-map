"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { RiLogoutBoxRLine } from "react-icons/ri";
import { logout } from "@/lib/api";

import { RiChatSettingsLine, RiDiscussLine } from "react-icons/ri";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useState } from "react";
import { Separator } from "./ui/separator";

/**
 * Headerコンポーネントのプロパティ型
 * @property role - ユーザーの権限（ROLE_ADMIN or ROLE_USER）
 * @property username - ユーザーネーム
 */
type HeaderProps = {
    role: string | undefined;
    username: string | undefined;
};

/**
 * Headerコンポーネント
 * @component
 * @param props - コンポーネントに渡すProps
 * @returns ヘッダーコンポーネント
 */
// export default function Header({role, username}: HeaderProps) {

//     const router = useRouter();
//     const [topicTitle, setTopicTitle] = useState("");
//     const [topicDescription, setTopicDescription] = useState("");
//     const [topicError, setTopicError] = useState("");

//     // click時に投稿ページに遷移
//     const handleNewArticle = () => {
//         router.push('/articles/new');
//     };

//     // トークテーマの取得
//     const handleFetchTopic = async () => {
//         setTopicError("");
//         try {
//             // トークテーマ取得API呼び出し
//             const res = await fetchTopic();
//             setTopicTitle(res.title);
//             setTopicDescription(res.description);
//         } catch(error: unknown){
//             if (error instanceof Error){
//                 setTopicError(error.message)
//             } else {
//                 setTopicError("トークテーマの取得に失敗しました。");
//             }
//         }
//     };

//     // ログアウトを行う
//     const handleLogout = async () => {
//         try {
//             // ログアウトAPI呼び出し
//             await logout();
//         } catch(error: unknown){
//             console.log("logoutに失敗しました。", error);
//         } finally{
//             // ログイン画面に遷移
//             router.push("/login");
//         }
//     };

//     return (
//         <header className="w-full fixed flex items-center justify-between h-16 px-52 border-b bg-white shadow z-50">
//             <Link href="/">
//                 <h1 className="text-2xl font-bold cursor-pointer">knowme</h1>
//             </Link>
//             <div className="flex items-center">
//                 {role === "ROLE_ADMIN" &&
//                     <Button variant="secondary" size="icon" className="mr-3" onClick={() => router.push("/topics")}><RiChatSettingsLine /></Button>
//                 }
//                 <Popover>
//                     <PopoverTrigger asChild>
//                         <Button variant="secondary" size="icon" className="mr-3" onClick={handleFetchTopic}>
//                             <RiDiscussLine />
//                         </Button>
//                     </PopoverTrigger>
//                     <PopoverContent className="flex flex-col justify-center text-center w-[90vw] max-w-sm">
//                         <div className="font-bold text-sm">トークテーマ</div>
//                         {topicError ? (
//                                 <div className="text-red-500 text-sm">{topicError}</div>
//                             ) : (
//                                 <>
//                                     <Separator className="mt-2"/>
//                                     <div className="flex flex-col mt-4">
//                                         <div className="font-bold">{topicTitle || "トークテーマが設定されていません。"}</div>
//                                         {topicDescription && <div className="text-gray-600 text-sm mt-5">{topicDescription}</div>}
//                                     </div>
//                                 </>
//                                 )
//                         }
//                     </PopoverContent>
//                 </Popover>
//                 <DropdownMenu>
//                     <DropdownMenuTrigger asChild>
//                         <Button variant="outline">My Account</Button>
//                     </DropdownMenuTrigger>
//                     <DropdownMenuContent className="w-56" align="start">
//                         <DropdownMenuLabel>{username}</DropdownMenuLabel>
//                         <DropdownMenuSeparator />
//                         <DropdownMenuItem onClick={handleLogout}>
//                             <RiLogoutBoxRLine />
//                             ログアウト
//                         </DropdownMenuItem>
//                     </DropdownMenuContent>
//                 </DropdownMenu>
//                 <Button className="cursor-pointer ml-3" onClick={handleNewArticle}>
//                     <span className="font-bold"> 投稿する</span>
//                 </Button>
//             </div>
//         </header>
//     )
// }

export default function Header() {
    const router = useRouter();
    const [topicTitle, setTopicTitle] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [topicError, setTopicError] = useState("");

    // click時に投稿ページに遷移
    const handleNewArticle = () => {
        router.push("/articles/new");
    };

    // ログアウトを行う
    const handleLogout = async () => {
        try {
            // ログアウトAPI呼び出し
            await logout();
        } catch (error: unknown) {
            console.log("logoutに失敗しました。", error);
        } finally {
            // ログイン画面に遷移
            router.push("/login");
        }
    };

    return (
        <header className="w-full fixed flex items-center justify-between h-16 px-52 border-b bg-white shadow z-50">
            <Link href="/">
                <h1 className="text-2xl font-bold cursor-pointer">mogumogu</h1>
            </Link>
            <div className="flex items-center">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline">My Account</Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuLabel>{}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                            <RiLogoutBoxRLine />
                            ログアウト
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button
                    className="cursor-pointer ml-3"
                    onClick={handleNewArticle}
                >
                    <span className="font-bold"> 投稿する</span>
                </Button>
            </div>
        </header>
    );
}
