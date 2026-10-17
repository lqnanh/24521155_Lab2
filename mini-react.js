
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


