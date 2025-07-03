export function getKoreanTime(): string {
    return new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
}