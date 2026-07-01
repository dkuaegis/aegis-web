export function pickIndexByPercent<T>(
  list: T[],
  getPercent: (x: T) => number | undefined
): number {
  const n = list.length;
  if (n === 0) return 0;

  // 퍼센트 수집 (undefined/음수/NaN -> 0)
  const pct: number[] = new Array(n);
  let total = 0;
  for (let i = 0; i < n; i++) {
    const raw = getPercent(list[i]);
    const v =
      typeof raw === "number" && Number.isFinite(raw) && raw > 0 ? raw : 0;
    pct[i] = v;
    total += v;
  }

  // 전부 0이면 균등 분포로 대체
  if (total <= 0) {
    return Math.floor(Math.random() * n);
  }

  // 누적 감산 방식으로 추첨
  let r = Math.random() * total;
  for (let i = 0; i < n; i++) {
    r -= pct[i];
    if (r < 0) return i;
  }
  return n - 1;
}
