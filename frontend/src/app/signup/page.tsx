"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { signup } from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * ユーザー新規登録画面
 * @returns ユーザー新規登録画面
 */
export default function RegisterPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [username, setUsername] = useState("");
    // 新規登録時のエラーメッセージ
    const [error, setError] = useState("");

    // 新規登録ボタン投下時のハンドラ
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            // 新規登録APIの呼び出し
            await signup(email, password, username);
            // 新規登録完了後、記事一覧表示画面に遷移
            router.push("/");
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("新規登録に失敗しました。");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pb-12">
            <Card className="w-full max-w-md">
                <CardHeader className="font-bold">
                    <CardTitle className="text-center">新規登録</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="mb-6">
                        {error && (
                            <div className="text-red-500 text-center text-sm mb-2">
                                {error}
                            </div>
                        )}
                        <div className="flex flex-col gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email" className="text-sm">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="メールアドレス"
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password" className="text-sm">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="パスワード"
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="lastName" className="text-sm">
                                    名字
                                </Label>
                                <Input
                                    id="lastName"
                                    type="text"
                                    placeholder="名字"
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="firstName" className="text-sm">
                                    名前
                                </Label>
                                <Input
                                    id="firstName"
                                    type="text"
                                    placeholder="名前"
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="username" className="text-sm">
                                    Username
                                </Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="ユーザーネーム"
                                    onChange={(e) =>
                                        setUsername(e.target.value)
                                    }
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            新規登録
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full text-gray-950"
                            onClick={() => router.push("/login")}
                        >
                            ログイン
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
