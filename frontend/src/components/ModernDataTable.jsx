import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableColumn,
  Input,
  Button,
  Dropdown,
  Pagination,
} from "@nextui-org/react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";

const ModernDataTable = ({ columns, data, searchBy = "name" }) => {
  const [sorting, setSorting] = useState([]);
  const [filters, setFilters] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [searchColumn, setSearchColumn] = useState(searchBy);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, columnFilters: filters },
    initialState: { pagination: { pageSize } },
    onSortingChange: setSorting,
    onColumnFiltersChange: setFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handleSearch = (value) => {
    table.getColumn(searchColumn)?.setFilterValue(value);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-4">
        <Input
          clearable
          placeholder={`Search by ${searchColumn}`}
          onChange={(e) => handleSearch(e.target.value)}
          aria-label="Search input"
        />
        <Dropdown>
          <Dropdown.Button flat>Search by: {searchColumn}</Dropdown.Button>
          <Dropdown.Menu
            aria-label="Search column selector"
            onAction={(key) => setSearchColumn(key)}
          >
            {table.getAllColumns().map((col) => (
              <Dropdown.Item key={col.id}>{col.id}</Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Table */}
      <Table aria-label="Modern Data Table" css={{ height: "auto" }}>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableColumn key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-2">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() && (
                        <Button
                          auto
                          size="sm"
                          onPress={() => header.column.toggleSorting()}
                          icon={
                            header.column.getIsSorted() === "desc" ? (
                              <FiArrowDown />
                            ) : header.column.getIsSorted() === "asc" ? (
                              <FiArrowUp />
                            ) : (
                              <FiChevron />
                            )
                          }
                        />
                      )}
                    </div>
                  )}
                </TableColumn>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} css={{ textAlign: "center" }}>
                No data available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <Button.Group>
            <Button
              onPress={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </Button>
            <Button
              onPress={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </Button>
          </Button.Group>
          <Pagination
            total={table.getPageCount()}
            page={table.getState().pagination.pageIndex + 1}
            onChange={(page) => table.setPageIndex(page - 1)}
          />
          <Button.Group>
            <Button
              onPress={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </Button>
            <Button
              onPress={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </Button>
          </Button.Group>
        </div>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="border rounded px-2 py-1"
          aria-label="Page size selector"
        >
          {[5, 10, 15, 20].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ModernDataTable;
