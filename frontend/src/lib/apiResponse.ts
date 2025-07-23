import { NextResponse } from "next/server";

// エラーコード定義
export const ERROR_CODES = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    AUTHENTICATION_ERROR: "AUTHENTICATION_ERROR",
    INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR",
    USER_NOT_FOUND: "USER_NOT_FOUND",
    AUTHORIZATION_ERROR: "AUTHORIZATION_ERROR",

    DUPLICATE_EMAIL: "DUPLICATE_EMAIL",
    WEAK_PASSWORD: "WEAK_PASSWORD",
} as const; // as constでreadonlyかつリテラル型に

// ErrorCode型を定義
export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// レスポンス型定義
// エラーレスポンス
export interface ErrorResponse {
    code: ErrorCode;
    message: string;
}

// エラーレスポンスの作成
export function createErrorResponse(
    code: ErrorCode,
    message: string,
    status: number
): NextResponse<ErrorResponse> {
    return NextResponse.json({ code, message }, { status });
}
