import styles from "./SortableTable.module.scss";
import React, { useState } from "react";

interface Column {
    label: string;
    accessor: string;
}

interface SortableTableProps {
    className?: string
    columns: Column[];
    data: any;
    onDelete: (id: number) => void;
    onUpdate: (id: number) => void;
    idProperty: string;
}


const SortableTable: React.FC<SortableTableProps> = ({ className = styles.sortableTable, data, columns, onDelete, onUpdate, idProperty }) => {
    const [sortField, setSortField] = useState(columns[0].accessor);
    const [sortOrder, setSortOrder] = useState("desc");

    const handleSort = (field: string) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
        return 0;
    });

    return (
        <table className={`${styles.sortableTable} ${className}`}>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th className={`${styles.field} ${styles.headerField}`} key={column.accessor} onClick={() => handleSort(column.accessor)}>
                        {column.label}
                    </th>
                ))}
                <th className={`${styles.field} ${styles.headerField}`}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {sortedData.map((item, index) => (
                <tr className={styles.row} key={index}>
                    {columns.map((column) => {
                        const value = item[column.accessor];
                        return <td className={styles.field} key={column.accessor}>{value}</td>;
                    })}
                    <td className={styles.field}>
                        <button onClick={() => onDelete(item[idProperty])}>Delete</button>
                        <button onClick={() => onUpdate(item[idProperty])}>Update</button>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default SortableTable;
