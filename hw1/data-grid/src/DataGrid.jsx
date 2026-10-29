
import {useMemo, useState } from 'react';

function compareValues(a, b) {
  if (typeof a === 'number' && typeof b === 'number') return a - b;
  return String(a ?? '').localeCompare(String(b ?? ''));
}

/** @typedef {import('./DataGrid.types.js').DataGridProps<any>} DataGridProps */

/**
 * @param {DataGridProps} props
 */
export default function DataGrid({ data, columns, ariaLabel, getRowId }) {
    const [sort, setSort] = useState({ key: null, direction: 'ascending' });

const sortedData = useMemo(() => {
  if (sort.key === null) return data;
  const dir = sort.direction === 'ascending' ? 1 : -1;
  return [...data].sort((a, b) => dir * compareValues(a[sort.key], b[sort.key]));
}, [data, sort]);

const handleSort = (key) => {
  setSort((prev) => ({
    key,
    direction:
      prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
  }));
};
  return (
    <table role="grid" aria-label={ariaLabel}>
      <thead>
        <tr>
          {columns.map((col) => (
            <th
            key={String(col.accessorKey)}
            scope="col"
            aria-sort={sort.key === col.accessorKey ? sort.direction : undefined}
            >
            {col.sortable ? (
                <button type="button" onClick={() => handleSort(col.accessorKey)}>
                {col.header}
                </button>
            ) : (
                col.header
            )}
            </th>
          ))}
        </tr>
      </thead>
    <tbody>
    {sortedData.map((row) => (
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