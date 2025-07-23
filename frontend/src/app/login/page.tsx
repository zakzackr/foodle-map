'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { login } from "@/lib/api";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import { useState } from "react";


/**
 * ユーザーログイン画面
 * @returns ユーザーログイン画面
 */
export default function LoginPage() {
    const router = useRouter();
    const [usernameOrEmail, setUsernameOrEmail] = useState("");
    const [password, setPassword] = useState("");
    // ログイン時のエラーメッセージ
    const [error, setError] = useState("");

    // ログインボタン押下時のハンドラ
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            // ログインAPIの呼び出し
            await login(usernameOrEmail, password);
            // ログイン完了後に、記事一覧表示画面に遷移
            router.push("/");
        } catch(error: unknown){
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("ログインに失敗しました。");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pb-12">
            <Card className="w-full max-w-md">
                <CardHeader className="font-bold">
                    <CardTitle className="text-center">ログイン</CardTitle>
                </CardHeader>
                {error && <div className="text-red-500 text-center text-sm">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <CardContent className="mb-6">
                            <div className="flex flex-col gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="usernameOrEmail" className="text-sm">Username / Email</Label>
                                    <Input
                                        id="usernameOrEmail"
                                        type="text"
                                        placeholder="ユーザー名 または メールアドレス"
                                        onChange={(e) => setUsernameOrEmail(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password" className="text-sm">Password</Label>
                                    <Input 
                                        id="password" 
                                        type="password"
                                        placeholder="パスワード"
                                        onChange={(e) => setPassword(e.target.value)}
                                        required />
                                </div>
                            </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <Button type="submit" className="w-full">
                            ログイン
                        </Button>
                        <Button type="button" variant="outline" className="w-full text-gray-950" onClick={() => router.push("/register")}>
                            新規登録
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}