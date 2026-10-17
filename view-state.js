
/**
 * Một mục dữ liệu hiển thị.
 * @typedef {Object} Item
 * @property {string} id
 * @property {string} title
 */

/**
 * Trạng thái của view (union 4 trạng thái).
 * @typedef {{ status: 'IDLE' }
 *   | { status: 'LOADING', requestId: number }
 *   | { status: 'SUCCESS', requestId: number, data: Item[] }
 *   | { status: 'ERROR', requestId: number, error: string }} ViewState
 */

/**
 * Sự kiện làm thay đổi ViewState (union 3 loại).
 * @typedef {{ type: 'FETCH_START', requestId: number }
 *   | { type: 'FETCH_SUCCESS', requestId: number, data: Item[] }
 *   | { type: 'FETCH_FAILURE', requestId: number, error: string }} ViewEvent
 */

/** @type {ViewState} */
export const INITIAL_STATE = Object.freeze({ status: 'IDLE' });

/**
 * Hàm chuyển trạng thái thuần: không side effect, không mutate input.
 * Event không hợp lệ hoặc không khớp luật thì trả về ĐÚNG state cũ (cùng reference).
 *
 * @param {ViewState} state - Trạng thái hiện tại.
 * @param {ViewEvent} event - Sự kiện cần áp dụng.
 * @returns {ViewState} Trạng thái mới (frozen) hoặc chính `state` nếu bỏ qua.
 */
export function transition(state, event) {
  if (typeof event !== 'object' || event === null) return state;

  switch (event.type) {
    case 'FETCH_START':
      return Object.freeze({ status: 'LOADING', requestId: event.requestId });

    case 'FETCH_SUCCESS':
      if (state.status !== 'LOADING' || event.requestId !== state.requestId) return state;
      return Object.freeze({
        status: 'SUCCESS',
        requestId: event.requestId,
        data: event.data,
      });

    case 'FETCH_FAILURE':
      if (state.status !== 'LOADING' || event.requestId !== state.requestId) return state;
      return Object.freeze({
        status: 'ERROR',
        requestId: event.requestId,
        error: event.error,
      });

    default:
      return state;
  }
}