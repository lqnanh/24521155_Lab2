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

let triggerRender = () => {};

export function setRenderer(fn) {
  if (typeof fn !== 'function') {
    throw new TypeError('setRenderer: fn phải là function.');
  }
  triggerRender = fn;
}

export function useState(initialValue) {
  const currentCursor = stateStore.cursor;

  if (currentCursor >= stateStore.states.length) {
    stateStore.states[currentCursor] = initialValue;
  }

  function setState(nextValue) {
    const prev = stateStore.states[currentCursor];
    const resolved = typeof nextValue === 'function' ? nextValue(prev) : nextValue;
    if (Object.is(prev, resolved)) return;
    stateStore.states[currentCursor] = resolved;
    triggerRender();
  }

  stateStore.cursor++;
  return [stateStore.states[currentCursor], setState];
}

export function resetCursor() {
  stateStore.cursor = 0;
}



