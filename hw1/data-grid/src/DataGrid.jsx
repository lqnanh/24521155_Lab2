
/** @typedef {import('./DataGrid.types.js').DataGridProps<any>} DataGridProps */

/**
 * @param {DataGridProps} props
 */
export default function DataGrid({ data, columns, ariaLabel, getRowId }) {
  return (
    <table role="grid" aria-label={ariaLabel}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th key={String(col.accessorKey)} scope="col">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={getRowId(row)}>
            {columns.map((col) => (
              <td key={String(col.accessorKey)}>{row[col.accessorKey]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}