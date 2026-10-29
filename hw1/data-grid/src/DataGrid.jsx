
import { useId, useMemo, useState } from 'react';

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

    const [query, setQuery] = useState('');
    const searchId = useId();

    const filteredData = useMemo(() => {
        const keyword = query.trim().toLowerCase();
        if (keyword === '') return data;
        return data.filter((row) =>
            columns.some((col) =>
                String(row[col.accessorKey] ?? '').toLowerCase().includes(keyword)
            )
        );
    }, [data, columns, query]);

    const sortedData = useMemo(() => {
        if (sort.key === null) return filteredData;
        const dir = sort.direction === 'ascending' ? 1 : -1;
        return [...filteredData].sort((a, b) => dir * compareValues(a[sort.key], b[sort.key]));
    }, [filteredData, sort]);

    const handleSort = (key) => {
        setSort((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === 'ascending' ? 'descending' : 'ascending',
        }));
    };
    return (
        <>
            <label htmlFor={searchId}>Tìm kiếm</label>
            <input
                id={searchId}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            <p role="status" aria-live="polite">
                Tìm thấy {filteredData.length} kết quả
            </p>
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
        </>
    );
}