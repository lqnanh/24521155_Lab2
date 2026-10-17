/**
 * reactive-engine.js
 *
 * INVARIANT:
 * I1: cursor luôn là số nguyên >= 0.
 * I2: states không bị xóa giữa các lần render, chỉ ghi đè theo index.
 * I3: resetCursor phải được gọi trước mỗi lần chạy component.
 * I4: số lần gọi hook mỗi lần render phải bằng nhau.
 */

const stateStore = { states: [], cursor: 0 };

export function resetCursor() {
  stateStore.cursor = 0;
}

