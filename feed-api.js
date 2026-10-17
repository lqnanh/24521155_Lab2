
/**
 * Một mục dữ liệu hiển thị (khớp contract trong view-state.js).
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} title
 */

/**
 * Tùy chọn cho fetchFeed.
 * @typedef {Object} FetchFeedOptions
 * @property {number} [delayMs=1200] - Thời gian chờ giả lập (ms), số >= 0.
 * @property {number} [failureRate=0.4] - Xác suất thất bại, trong [0, 1].
 * @property {() => number} [random=Math.random] - Nguồn ngẫu nhiên, trả số trong [0, 1).
 */

/**
 * Mô phỏng gọi API lấy danh sách feed.
 *
 * @param {FetchFeedOptions} [options]
 * @returns {Promise<Item[]>} Mảng 5 Item với id ổn định 'feed-1'...'feed-5'.
 * @throws {TypeError} Nếu options không hợp lệ (reject Promise vì hàm là async).
 * @throws {Error} 'Không thể kết nối máy chủ' khi random() < failureRate.
 */
export async function fetchFeed(options = {}) {
  const { delayMs = 1200, failureRate = 0.4, random = Math.random } = options;

  if (typeof delayMs !== 'number' || Number.isNaN(delayMs) || delayMs < 0) {
    throw new TypeError('fetchFeed: delayMs phải là số >= 0.');
  }
  if (typeof failureRate !== 'number' || Number.isNaN(failureRate) || failureRate < 0 || failureRate > 1) {
    throw new TypeError('fetchFeed: failureRate phải là số trong [0, 1].');
  }
  if (typeof random !== 'function') {
    throw new TypeError('fetchFeed: random phải là function.');
  }

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (random() < failureRate) {
    throw new Error('Không thể kết nối máy chủ');
  }

  return [1, 2, 3, 4, 5].map((n) => ({ id: `feed-${n}`, title: `Bài viết ${n}` }));
}

/**
 * Tạo bộ sinh requestId tăng dần, bắt đầu từ 1. Mỗi bộ sinh có bộ đếm riêng.
 *
 * @returns {() => number} Hàm next() trả 1, 2, 3, ...
 */
export function createRequestIdGenerator() {
  let current = 0;
  return function next() {
    current += 1;
    return current;
  };
}