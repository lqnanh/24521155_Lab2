import { fetchFeed, createRequestIdGenerator } from './feed-api.js';

// Thành công tất định
const items = await fetchFeed({ delayMs: 0, random: () => 0.99 });
console.assert(items.length === 5, 'phải có 5 item');
console.assert(new Set(items.map((i) => i.id)).size === 5, 'id phải duy nhất');
console.assert(items[0].id === 'feed-1', 'id ổn định');

// Thất bại tất định
let failed = false;
try { await fetchFeed({ delayMs: 0, random: () => 0 }); } catch (e) {
  failed = e.message === 'Không thể kết nối máy chủ';
}
console.assert(failed, 'phải reject với đúng message');

// Validate
for (const bad of [{ delayMs: -1 }, { failureRate: 2 }, { random: 5 }]) {
  let isTypeError = false;
  try { await fetchFeed(bad); } catch (e) { isTypeError = e instanceof TypeError; }
  console.assert(isTypeError, `phải TypeError với ${JSON.stringify(bad)}`);
}

// Bộ sinh requestId độc lập
const a = createRequestIdGenerator();
const b = createRequestIdGenerator();
console.assert(a() === 1 && a() === 2 && b() === 1, 'bộ đếm riêng, bắt đầu từ 1');
console.log('done');