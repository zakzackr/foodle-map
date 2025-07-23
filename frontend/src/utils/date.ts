/**
 * 日付情報をフォーマットする関数
 * 2025-06-09T19:50:00.452684 → 2025/06/09
 * @param isoString - ISO 8601形式の日付情報
 * @returns フォーマットされた日付情報
 */
export function formatCreatedDate(isoString: string): string {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}/${mm}/${dd}`;
}