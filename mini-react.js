
/**
 * Loại của một VNode: tên thẻ HTML (vd: 'div', 'button')
 * hoặc một function component nhận props và trả về VNode.
 * Riêng chuỗi 'TEXT_ELEMENT' được dành cho text node.
 *
 * @typedef {string | ((props: VNodeProps) => VNode)} VNodeType
 */

/**
 * Props của VNode: object tự do (className, id, onClick, ...)
 * cộng với hai trường có ý nghĩa đặc biệt là `children` và `nodeValue`.
 *
 * @typedef {Object.<string, any> & {
 *   children: VNode[],
 *   nodeValue?: string
 * }} VNodeProps
 */

/**
 * Một node trong cây Virtual DOM (POJO, bất biến sau khi tạo).
 *
 * @typedef {Object} VNode
 * @property {VNodeType} type
 * @property {VNodeProps} props
 */

/**
 * Tạo VNode dạng text từ một giá trị nguyên thủy.
 *
 * @param {string | number} text - Nội dung text (số 0 vẫn hợp lệ).
 * @returns {VNode} VNode có type = 'TEXT_ELEMENT', đã bị đóng băng.
 */
export function createTextElement(text) {
  return Object.freeze({
    type: 'TEXT_ELEMENT',
    props: Object.freeze({
      nodeValue: String(text),
      children: [],
    }),
  });
}

/**
 * Tạo VNode từ type, props và danh sách con.
 *  
 * @param {VNodeType} type - Tên thẻ hoặc function component.
 * @param {Object.<string, any> | null} [props] - Props gốc (có thể null).
 * @param {...any} children - Con (có thể lồng mảng, lẫn null/false/primitive).
 * @returns {VNode} VNode đã bị đóng băng.
 */
export function createElement(type, props, ...children) {
  const normalizedChildren = children
    .flat(Infinity)
    .filter((child) => child !== null && child !== undefined && child !== false && child !== true)
    .map((child) =>
      typeof child === 'object' ? child : createTextElement(child)
    );

  return Object.freeze({
    type,
    props: Object.freeze({
      ...(props ?? {}),
      children: Object.freeze(normalizedChildren),
    }),
  });
}

/**
 * Chuyển một VNode thành DOM node thật (đệ quy).
 *
 * @param {VNode} vNode
 * @returns {Node} Text node hoặc Element tương ứng.
 * @throws {TypeError} Nếu vNode không hợp lệ hoặc có prop bị cấm.
 * @throws {Error} Nếu type là function component hoặc prop là innerHTML/outerHTML.
 */
export function renderToDOM(vNode) {
  // 1. Typeguard
  if (typeof vNode !== 'object' || vNode === null) {
    throw new TypeError('renderToDOM: vNode phải là object khác null.');
  }
  const { type, props } = vNode;
  if (typeof props !== 'object' || props === null) {
    throw new TypeError('renderToDOM: vNode.props phải là object khác null.');
  }
  if (!Array.isArray(props.children)) {
    throw new TypeError('renderToDOM: vNode.props.children phải là mảng.');
  }
  if (typeof type !== 'function' && (typeof type !== 'string' || type === '')) {
    throw new TypeError('renderToDOM: vNode.type phải là string không rỗng hoặc function.');
  }

  // 2. Text node: tạo bằng createTextNode rồi return luôn
  if (type === 'TEXT_ELEMENT') {
    return document.createTextNode(props.nodeValue);
  }

  // 4. Function component chưa hỗ trợ (kiểm tra trước khi gọi createElement)
  if (typeof type === 'function') {
    throw new Error('Function components chưa hỗ trợ ở Sprint 1');
  }

  // 3. Thẻ HTML
  const dom = document.createElement(type);

  // 5. Gán props
  for (const [name, value] of Object.entries(props)) {
    if (name === 'children' || name === 'nodeValue') continue;

    const lowerName = name.toLowerCase();
    if (lowerName === 'innerhtml' || lowerName === 'outerhtml') {
      throw new Error(`renderToDOM: prop "${name}" bị cấm (nguy cơ XSS).`);
    }

    if (name.startsWith('on')) {
      if (typeof value === 'function') {
        dom.addEventListener(name.slice(2).toLowerCase(), value);
        continue;
      }
      if (value === null || value === undefined || value === false) continue;
      throw new TypeError(`renderToDOM: prop "${name}" phải là function (cấm inline event handler dạng chuỗi).`);
    }

    if (value === null || value === undefined || value === false) continue;

    if (name === 'className') {
      dom.className = String(value);
    } else {
      dom.setAttribute(name, String(value));
    }
  }

  // 6. Đệ quy children
  for (const child of props.children) {
    dom.appendChild(renderToDOM(child));
  }

  // 7.
  return dom;
}


