import { createElement } from './mini-react.js';
import { useState } from './reactive-engine.js';
import { INITIAL_STATE, transition } from './view-state.js';
import { createRequestIdGenerator, fetchFeed } from './feed-api.js';

const nextRequestId = createRequestIdGenerator();

/**
 * Khung chờ (skeleton) hiển thị khi đang tải.
 *
 * @returns {import('./mini-react.js').VNode} VNode <section aria-busy="true">.
 */
function SkeletonList() {
  return createElement(
    'section',
    { 'aria-busy': 'true' },
    createElement('p', { role: 'status', className: 'visually-hidden' }, 'Đang tải dữ liệu...'),
    createElement(
      'ul',
      null,
      ...[1, 2, 3, 4, 5].map(() =>
        createElement('li', { className: 'skeleton-item', 'aria-hidden': 'true' })
      )
    )
  );
}

/**
 * Giao diện lỗi kèm nút thử lại. Hàm thường trả VNode, không phải component của engine.
 *
 * @param {{ message: string, onRetry: () => void }} params
 * @returns {import('./mini-react.js').VNode} VNode <section role="alert">.
 */
export function ErrorView({ message, onRetry }) {
  return createElement(
    'section',
    { role: 'alert', className: 'error-view' },
    createElement('h2', null, 'Không tải được dữ liệu'),
    createElement('p', null, message),
    // TODO: focus bị mất sau khi bấm Retry do replaceChildren dựng lại toàn bộ cây (ghi vào audit).
    createElement('button', { type: 'button', onClick: onRetry }, 'Retry Connection')
  );
}

/**
 * Hàm thuần: chọn VNode tương ứng với status của state.
 *
 * @param {import('./view-state.js').ViewState} state
 * @param {() => void} onLoad - Handler cho nút tải / tải lại.
 * @returns {import('./mini-react.js').VNode}
 * @throws {Error} Nếu status không nhận diện được.
 */
function renderByStatus(state, onLoad) {
  switch (state.status) {
    case 'IDLE':
      return createElement(
        'section',
        null,
        createElement('p', null, 'Nhấn nút bên dưới để tải danh sách.'),
        createElement('button', { type: 'button', onClick: onLoad }, 'Load feed')
      );

    case 'LOADING':
      return SkeletonList();

    case 'SUCCESS':
      return createElement(
        'section',
        null,
        createElement(
          'ul',
          null,
          ...state.data.map((item) =>
            createElement('li', { 'data-item-id': item.id }, item.title)
          )
        ),
        createElement('button', { type: 'button', onClick: onLoad }, 'Reload')
      );

    case 'ERROR':
      return createElement('p', null, state.error);

    default:
      throw new Error(`renderByStatus: status không hợp lệ: ${state.status}`);
  }
}

/**
 * Component hiển thị feed. Hook chỉ gọi ở top-level.
 *
 * @returns {import('./mini-react.js').VNode} VNode gốc là <main>.
 */
export function DataFeed() {
  const [state, setState] = useState(INITIAL_STATE);

  /**
   * Gọi API và đẩy kết quả vào state qua transition.
   * Chỉ được gọi từ onClick, không gọi trong thân render.
   *
   * @returns {Promise<void>}
   */
  async function loadData() {
    const requestId = nextRequestId();
    setState((prev) => transition(prev, { type: 'FETCH_START', requestId }));
    try {
      const data = await fetchFeed();
      setState((prev) => transition(prev, { type: 'FETCH_SUCCESS', requestId, data }));
    } catch (err) {
      setState((prev) =>
        transition(prev, {
          type: 'FETCH_FAILURE',
          requestId,
          error: err instanceof Error ? err.message : String(err),
        })
      );
    }
  }

  return createElement('main', null, renderByStatus(state, loadData));
}