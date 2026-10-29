
import { useId, useMemo, useState } from 'react';

function compareValues(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a ?? '').localeCompare(String(b ?? ''));
}

/** @typedef {import('./DataGrid.types.js').DataGridProps<any>} DataGridProps */

/**
 * @param {DataGridProps} props
 */
export default function DataGrid({ data, columns, ariaLabel, getRowId, pageSize = 10 }) {
    const [sort, setSort] = useState({ key: null, direction: 'ascending' });

    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
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

    const totalPages = Math.max(1, Math.ceil(sortedData.length / pageSize));
    const currentPage = Math.min(page, totalPages);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

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
                onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                }}
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
                    {paginatedData.map((row) => (
                        <tr key={getRowId(row)}>
                            {columns.map((col) => (
                                <td key={String(col.accessorKey)}>{row[col.accessorKey]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <nav aria-label="Phân trang">
                <button
                    type="button"
                    onClick={() => setPage(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    Trang trước
                </button>
                <span aria-current="page">
                    Trang {currentPage} / {totalPages}
                </span>
                <button
                    type="button"
                    onClick={() => setPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    Trang sau
                </button>
            </nav>
        </>
    );
}