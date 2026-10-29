/**
 * @template T
 * @typedef {Object} ColumnDef
 * @property {string} header
 * @property {keyof T} accessorKey
 * @property {boolean} [sortable]
 */

/**
 * @template T
 * @typedef {Object} DataGridProps
 * @property {T[]} data
 * @property {ColumnDef<T>[]} columns
 * @property {(item: T) => void} [onRowSelect]
 * @property {string} ariaLabel
 * @property {(item: T) => string | number} getRowId
 * @property {number} [pageSize]
 */

export {};