import React, { useState, useEffect } from "react";
import "../App.css";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TableSortLabel,
  Tooltip,
  Chip,
  Box,
  styled,
  alpha,
  Typography,
} from "@mui/material";
import useLoadData from "../LoadData";
import FilterSystem from "./FilterSystem";
import PreviewCard from "./PreviewCard";
import DetailModal from "./DetailModal";

// Theme colors
const PRIMARY_COLOR = "#E4FE77";
const SECONDARY_COLOR = "#333333";
const HOVER_COLOR = alpha(SECONDARY_COLOR, 0.05);

// Styled components
const StyledPaper = styled(Paper)(() => ({
  borderRadius: "12px",
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.08)",
  border: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
}));

const TableHeader = styled(TableHead)(() => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.7),
}));

const HeaderCell = styled(TableCell)(() => ({
  fontWeight: "bold",
  color: SECONDARY_COLOR,
  fontSize: "0.875rem",
  padding: "16px",
  whiteSpace: "nowrap",
  borderBottom: `2px solid ${alpha(SECONDARY_COLOR, 0.2)}`,
}));

const DataCell = styled(TableCell)(() => ({
  padding: "12px 16px",
  fontSize: "0.875rem",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.1),
  },
  "&:nth-of-type(even)": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.1),
  },
  "&:hover": {
    backgroundColor: HOVER_COLOR,
    cursor: "pointer",
  },
  "&.selected": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.2),
  },
}));

const ActionChip = styled(Chip)(() => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.8),
  color: SECONDARY_COLOR,
  fontWeight: "bold",
  "&:hover": {
    backgroundColor: PRIMARY_COLOR,
  },
}));

const StyledSortLabel = styled(TableSortLabel)(() => ({
  "&.MuiTableSortLabel-active": {
    color: SECONDARY_COLOR,
  },
  "& .MuiTableSortLabel-icon": {
    color: `${SECONDARY_COLOR} !important`,
  },
}));

const FilterBox = styled(Box)(() => ({
  padding: "16px 24px",
  backgroundColor: alpha(PRIMARY_COLOR, 0.1),
  borderBottom: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
}));

const TableTitle = styled(Typography)(() => ({
  padding: "16px 24px",
  fontWeight: "bold",
  fontSize: "1.25rem",
  color: SECONDARY_COLOR,
}));

const ChipContainer = styled(Box)(() => ({
  display: "flex",
  flexWrap: "wrap",
  gap: "4px",
}));

interface FilterOption {
  category: string;
  subcategory: string;
  operator: string;
  value: string | string[] | number;
}

interface DataRow {
  [key: string]: string | number | string[];
}

interface DataTableProps {
  globalSearchTerm: string;
}

const DataTable: React.FC<DataTableProps> = ({ globalSearchTerm }) => {
  const allData = useLoadData();
  const [data, setData] = useState(allData);
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [order, setOrder] = useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = useState<string>("");
  const [activeFilters, setActiveFilters] = useState<FilterOption[]>([]);
  const [logicalOperator, setLogicalOperator] = useState<string>("AND");

  // Preview and modal states
  const [previewData, setPreviewData] = useState<DataRow | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    // Apply filters and global search to the data
    let filteredData = allData;

    // Apply filters if any
    if (activeFilters.length > 0) {
      filteredData = filteredData.filter((item) => {
        if (logicalOperator === "AND") {
          return activeFilters.every((filter) => applyFilter(item, filter));
        } else {
          return activeFilters.some((filter) => applyFilter(item, filter));
        }
      });
    }

    // Apply global search if term exists
    if (globalSearchTerm.trim() !== "") {
      const searchTermLower = globalSearchTerm.toLowerCase();
      filteredData = filteredData.filter((item) => {
        // Search in all string and number fields
        return Object.entries(item).some(([_, value]) => {
          // Skip array values
          if (Array.isArray(value)) {
            return false;
          }

          // Convert to string and check if it contains the search term
          return String(value).toLowerCase().includes(searchTermLower);
        });
      });
    }

    setData(filteredData);
    setPage(0); // Reset to first page when filters or search changes
  }, [activeFilters, logicalOperator, allData, globalSearchTerm]);

  const applyFilter = (item: DataRow, filter: FilterOption) => {
    const { subcategory, operator, value } = filter;
    const fieldKey = subcategory.toLowerCase().replace(/\s+/g, "_");
    const itemValue = item[fieldKey];

    if (itemValue === undefined) return false;

    switch (operator) {
      case "is":
        return itemValue === value;
      case "is not":
        return itemValue !== value;
      case "contains":
        return String(itemValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      case "does not contain":
        return !String(itemValue)
          .toLowerCase()
          .includes(String(value).toLowerCase());
      case "equals":
        return Number(itemValue) === Number(value);
      case "greater than":
        return Number(itemValue) > Number(value);
      case "lesser than":
        return Number(itemValue) < Number(value);
      case "between":
        // Assuming value is an array of two numbers [min, max]
        return (
          Array.isArray(value) &&
          value.length === 2 &&
          Number(itemValue) >= Number(value[0]) &&
          Number(itemValue) <= Number(value[1])
        );
      default:
        return false;
    }
  };

  const handleRequestSort = (property: string) => {
    const isAscending = orderBy === property && order === "asc";
    setOrder(isAscending ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleApplyFilters = (filters: FilterOption[]) => {
    setActiveFilters(filters);
  };

  // Handle row click to show preview
  const handleRowClick = (row: DataRow) => {
    setPreviewData(row);
  };

  // Handle preview click to open modal
  const handlePreviewClick = () => {
    setIsModalOpen(true);
  };

  // Close preview
  const handleClosePreview = (event: React.MouseEvent) => {
    event.stopPropagation();
    setPreviewData(null);
  };

  // Close modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const sortedData = data.sort((a, b) => {
    if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
    if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  });

  // Format value for display
  const formatValue = (
    fieldName: string,
    value: string | number | string[]
  ): React.ReactNode => {
    if (Array.isArray(value)) {
      return (
        <ChipContainer>
          {value.map((val, idx) => (
            <Chip
              key={idx}
              label={val}
              size="small"
              sx={{
                backgroundColor: alpha(PRIMARY_COLOR, 0.7),
                color: SECONDARY_COLOR,
              }}
            />
          ))}
        </ChipContainer>
      );
    }

    if (fieldName === "tags" && typeof value === "string") {
      return value.length > 0 ? (
        <Tooltip title={value} placement="top">
          <ActionChip
            label={value.length > 13 ? `${value.substring(0, 13)}...` : value}
            size="small"
          />
        </Tooltip>
      ) : (
        <span>-</span>
      );
    }

    if (fieldName === "ipm" || fieldName === "ctr" || fieldName === "cpm") {
      return typeof value === "number" ? value.toFixed(2) : value;
    }

    if (fieldName === "spend") {
      return typeof value === "number" ? `$${value.toLocaleString()}` : value;
    }

    if (fieldName === "cost_per_click" || fieldName === "cost_per_install") {
      return typeof value === "number" ? `$${value.toFixed(2)}` : value;
    }

    if (
      fieldName === "impressions" ||
      fieldName === "clicks" ||
      fieldName === "installs"
    ) {
      return typeof value === "number" ? value.toLocaleString() : value;
    }

    return value;
  };

  return (
    <StyledPaper>
      <TableTitle>Campaign Performance Data</TableTitle>

      <FilterBox>
        <FilterSystem onApplyFilters={handleApplyFilters} />
      </FilterBox>

      <TableContainer>
        <Table size="medium">
          <TableHeader>
            <TableRow>
              {[
                "creative_id",
                "creative_name",
                "tags",
                "country",
                "ad_network",
                "os",
                "campaign",
                "ad_group",
                "ipm",
                "ctr",
                "spend",
                "impressions",
                "clicks",
                "cpm",
                "cost_per_click",
                "cost_per_install",
                "installs",
              ].map((column) => (
                <HeaderCell
                  key={column}
                  sx={column === "tags" ? { textAlign: "center" } : {}}
                >
                  <StyledSortLabel
                    active={orderBy === column}
                    direction={orderBy === column ? order : "asc"}
                    onClick={() => handleRequestSort(column)}
                  >
                    {column.replace(/_/g, " ").toUpperCase()}
                  </StyledSortLabel>
                </HeaderCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => (
                <StyledTableRow key={index} onClick={() => handleRowClick(row)}>
                  {Object.keys(row).map((key, idx) => (
                    <DataCell
                      key={idx}
                      sx={key === "country" ? { textAlign: "center" } : {}}
                    >
                      {formatValue(key, row[key])}
                    </DataCell>
                  ))}
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25, 50]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{
          ".MuiTablePagination-selectLabel, .MuiTablePagination-displayedRows":
            {
              margin: 0,
            },
          ".MuiTablePagination-select": {
            paddingLeft: "8px",
          },
          ".MuiTablePagination-actions": {
            marginLeft: "16px",
          },
        }}
      />

      {/* Preview Card Component */}
      {previewData && (
        <PreviewCard
          data={previewData}
          onClose={handleClosePreview}
          onClick={handlePreviewClick}
        />
      )}

      {/* Detail Modal Component */}
      <DetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        data={previewData}
      />
    </StyledPaper>
  );
};

export default DataTable;
