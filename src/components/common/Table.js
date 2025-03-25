import React from 'react';

const Table = ({ columns, data, actions }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
            {actions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id || index}>
              {columns.map((column) => (
                <td key={`${row.id || index}-${column.key}`}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="action-buttons">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        className={`action-button ${action.className || ''}`}
                        onClick={() => action.onClick(row)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table; 