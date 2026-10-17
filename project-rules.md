# PROJECT_RULES.md - Exercise 1: Building Mini-React VNode & Mounting Engine

## 1. Nguyên Tắc Kỹ Thuật Cốt Lõi (Core Engineering Principles)
* **Trách nhiệm kỹ sư:** AI hỗ trợ sinh mã nguồn tự động, nhưng lập trình viên chịu trách nhiệm kiểm định tính đúng đắn kỹ thuật (Deterministic Verification).
* **Thiết kế theo hợp đồng (Contract-First Workflow):** Bắt buộc định nghĩa rõ ràng kiểu dữ liệu/interface cho VNode trước khi triển khai hàm xử lý.
* **Phân định trách nhiệm công nghệ:** HTML đóng vai trò nền tảng ngữ nghĩa, CSS chịu trách nhiệm hiển thị giao diện, và JavaScript quản lý hành vi/state phản ứng.

## 2. Tiêu Chuẩn Mã Nguồn & Quy Tắc Cấm (Deprecation Audit & Anti-Patterns)
* **Cấm tuyệt đối `var`:** Chỉ được phép sử dụng `const` và `let`.
* **Phòng chống lỗ hổng XSS (Cấm `innerHTML`):** Nghiêm cấm gán chuỗi HTML thô qua `innerHTML`[cite: 3]. Việc tạo text node bắt buộc dùng `document.createTextNode` hoặc gán an toàn qua các thuộc tính DOM API.
* **Cấm Inline Event Handler:** Tuyệt đối không gắn sự kiện dạng chuỗi trực tiếp (`onclick="..."`, `onkeypress="..."`).
* **Nghiêm cấm "Div-Soup":** Các phần tử HTML sinh ra phải tuân thủ đúng ngữ nghĩa (như `<main>`, `<header>`, `<section>`, `<button>`), nghiêm cấm việc dùng thẻ `<div>` cho mọi thành phần giao diện.

## 3. Quy Nhất Thiết Lập Lõi Engine (Exercise 1 Specifications)
* **`createTextElement(text)`:**
  * Bọc các giá trị chuỗi/số nguyên thủy thành một cấu trúc VNode dạng `TEXT_ELEMENT` để đảm bảo tính đồng nhất của cây VDOM.
* **`createElement(type, props, ...children)`:**
  * Xử lý các mảng `children` lồng nhau bằng phương thức `.flat(Infinity)`.
  * Lọc bỏ hoàn toàn các giá trị `null`, `undefined`, `false`.
  * Tự động chuyển đổi các giá trị con dạng chuỗi/số thành node `TEXT_ELEMENT`.
  * Trả về đối tượng POJO frozen bao gồm `type` và `props` (chứa `children`).
* **`renderToDOM(vNode)`:**
  * Tạo DOM node thực tế tương ứng (`document.createTextNode` đối với `TEXT_ELEMENT` và `document.createElement` đối với các thẻ HTML).
  * Gắn các thuộc tính (`className`, `id`,...) và lắng nghe sự kiện (`onClick`,...) vào DOM node.
  * Đệ quy gọi `renderToDOM` cho danh sách phần tử con `children` và gắn vào node cha bằng `appendChild`.

## 4. Quy Trình Làm Việc Với AI & Quản Lý Mã Nguồn (Workflow & Git Discipline)
* **Nguyên tắc phân rã tác vụ (Anti-Monolithic Vibe Coding):** Không bao giờ đưa prompt yêu cầu AI thực hiện nhiều hơn 1 sub-task cùng một lúc.
* **Kiểm định DevTools:** Phải kiểm tra panel Elements trong Browser DevTools để xác minh cây DOM thực tế khớp chính xác với cấu trúc cây VNode và không xuất hiện node mồ côi (orphan nodes)[cite: 15].
* **Kiểm tra an toàn XSS:** Đảm bảo mã nguồn xử lý an toàn khi truyền các chuỗi độc hại dạng `'<script>alert(1)</script>'`.
* **Yêu cầu Commit Git Nguyên Tử (Mandatory Atomic Git Commits):**
  1. Commit 1: `feat(core): implement createElement factory`
  2. Commit 2: `feat(core): implement renderToDOM`