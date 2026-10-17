
import { createElement } from './mini-react.js';
import { useState, setRenderer, renderApp, setupEventDelegation } from './reactive-engine.js';

function TaskApp() {
  const [tasks, setTasks] = useState([
    { id: 'seed-1', title: 'Review PR', done: false },
    { id: 'seed-2', title: 'Verify AST', done: false },
  ]);
  const [filter, setFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'DONE'

  // Danh sách hiển thị tính ngay lúc render, không lưu state phái sinh
  const visibleTasks = tasks.filter((t) => {
    if (filter === 'ACTIVE') return !t.done;
    if (filter === 'DONE') return t.done;
    return true;
  });

  const handleAdd = () => {
    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title: `Task ${prev.length + 1}`, done: false },
    ]);
  };

  const handleToggle = (id) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  };

  return createElement(
    'main',
    null,
    createElement(
      'header',
      null,
      createElement('h2', null, `Tasks: ${visibleTasks.length}/${tasks.length}`)
    ),
    createElement(
      'section',
      null,
      ...['ALL', 'ACTIVE', 'DONE'].map((name) =>
        createElement(
          'button',
          {
            type: 'button',
            'aria-pressed': filter === name ? 'true' : 'false',
            onClick: () => setFilter(name),
          },
          name
        )
      )
    ),
    createElement('button', { type: 'button', onClick: handleAdd }, 'Add Task'),
    createElement(
      'ul',
      null,
      ...visibleTasks.map((task) =>
        createElement(
          'li',
          { 'data-task-id': task.id },
          createElement('span', null, task.done ? `${task.title} (done)` : task.title),
          createElement(
            'button',
            { type: 'button', onClick: () => handleToggle(task.id) },
            task.done ? 'Undo' : 'Done'
          )
        )
      )
    )
  );
}

const root = document.getElementById('app');

setRenderer(() => renderApp(TaskApp, root)); // đăng ký trước để setState biết cách render lại
renderApp(TaskApp, root);                    // render lần đầu