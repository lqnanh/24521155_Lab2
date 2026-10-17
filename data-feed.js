
import { createElement } from './mini-react.js';
import { useState } from './reactive-engine.js';
import { INITIAL_STATE, transition } from './view-state.js';
import { createRequestIdGenerator, fetchFeed } from './feed-api.js';

const nextRequestId = createRequestIdGenerator();

/**
 * Component hiển thị feed. Hook chỉ gọi ở top-level.
 * Tạm thời chỉ hiện status và nút tải; render theo status thuộc Task 3.4.
 *
 * @returns {import('./view-state.js').VNode} VNode gốc là <main>.
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

  return createElement(
    'main',
    null,
    createElement('p', null, `status: ${state.status}`),
    createElement('button', { type: 'button', onClick: loadData }, 'Load feed')
  );
}