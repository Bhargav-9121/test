// FilterSystem.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  Button,
  Popover,
  Box,
  Typography,
  TextField,
  Tabs,
  Tab,
  InputAdornment,
  Checkbox,
  Chip,
  FormControlLabel,
  MenuItem,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  styled,
  alpha,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// Theme colors
const PRIMARY_COLOR = "#E4FE77";
const SECONDARY_COLOR = "#333333";

// Styled components
const FilterButton = styled(Button)(() => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.8),
  color: SECONDARY_COLOR,
  fontWeight: "bold",
  borderColor: alpha(PRIMARY_COLOR, 0.5),
  "&:hover": {
    backgroundColor: PRIMARY_COLOR,
    borderColor: alpha(PRIMARY_COLOR, 0.8),
  },
  textTransform: "none",
}));

const StyledPopover = styled(Popover)(() => ({
  "& .MuiPaper-root": {
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
    border: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
    overflow: "hidden",
  },
}));

const PopoverHeader = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  backgroundColor: alpha(PRIMARY_COLOR, 0.2),
  borderBottom: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
}));

const PopoverContent = styled(Box)(() => ({
  padding: "16px",
}));

const StyledTabs = styled(Tabs)(() => ({
  "& .MuiTabs-indicator": {
    backgroundColor: PRIMARY_COLOR,
  },
  "& .MuiTab-root": {
    textTransform: "none",
    fontWeight: 500,
    "&.Mui-selected": {
      color: SECONDARY_COLOR,
      fontWeight: 600,
    },
  },
}));

const FilterOption = styled(Box)(() => ({
  padding: "10px 12px",
  cursor: "pointer",
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.2),
  },
}));

const StyledTextField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(PRIMARY_COLOR, 0.8),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: PRIMARY_COLOR,
    },
  },
}));

const StyledCheckbox = styled(Checkbox)(() => ({
  color: alpha(SECONDARY_COLOR, 0.7),
  "&.Mui-checked": {
    color: PRIMARY_COLOR,
  },
}));

const ActionButton = styled(Button)(() => ({
  backgroundColor: SECONDARY_COLOR,
  color: "#FFFFFF",
  "&:hover": {
    backgroundColor: alpha(SECONDARY_COLOR, 0.9),
  },
}));

const StyledChip = styled(Chip)(() => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.6),
  color: SECONDARY_COLOR,
  fontWeight: "medium",
  borderRadius: "6px",
  "& .MuiChip-deleteIcon": {
    color: alpha(SECONDARY_COLOR, 0.7),
    "&:hover": {
      color: SECONDARY_COLOR,
    },
  },
}));

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
  "& .MuiToggleButtonGroup-grouped": {
    border: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
    "&.Mui-selected": {
      backgroundColor: alpha(PRIMARY_COLOR, 0.8),
      color: SECONDARY_COLOR,
      "&:hover": {
        backgroundColor: PRIMARY_COLOR,
      },
    },
    "&:hover": {
      backgroundColor: alpha(PRIMARY_COLOR, 0.2),
    },
  },
}));

const CategoryLabel = styled(Typography)(() => ({
  fontSize: "0.75rem",
  color: alpha(SECONDARY_COLOR, 0.7),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
}));

const CategoryValue = styled(Typography)(() => ({
  fontWeight: "medium",
  color: SECONDARY_COLOR,
  display: "flex",
  alignItems: "center",
}));

const DeleteButton = styled(IconButton)(() => ({
  color: alpha(SECONDARY_COLOR, 0.5),
  padding: "4px",
  "&:hover": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.2),
    color: SECONDARY_COLOR,
  },
}));

// Define filter categories and options based on CSV data
const FILTER_CATEGORIES = {
  columns: [
    "creative_id",
    "creative_name",
    "country",
    "ad_network",
    "os",
    "campaign",
    "ad_group",
  ],
  tags: [
    "Concept",
    "Audio - Type",
    "Audio - Language",
    "End card elements - CTA",
    "End card elements - Objects",
    "End card elements - Language",
    "End card elements - CTA Placement",
    "End card elements - Background Colour",
    "End card elements - Background setting",
    "End card elements - CTA background colour",
    "End card elements - Logo present",
  ],
  metrics: [
    "ipm",
    "ctr",
    "spend",
    "impressions",
    "clicks",
    "cpm",
    "cost_per_click",
    "cost_per_install",
    "installs",
  ],
};

// Sample values for each category based on CSV data
const SAMPLE_VALUES = {
  country: ["IN", "DE"],
  ad_network: ["meta", "tiktok"],
  os: ["unknown", "iOS", "Android"],
  campaign: [
    "App promotion campaign - New Creatives",
    "App promotion campaign - OG Creatives",
    "Test for Daga: boosting",
  ],
  ad_group: ["New Creatives", "OG Creatives – Revised", "Partnership"],
  "Audio - Language": ["English", "EN"],
  "End card elements - CTA Placement": [
    "Middle-Right",
    "Bottom-Center",
    "Middle-Center",
  ],
  "End card elements - Background Colour": [
    "Orange",
    "light blue",
    "Yellowish Orange",
    "pale green",
  ],
  "End card elements - Background setting": [
    "fantasy",
    "forest",
    "bedroom",
    "game",
    "game screen",
  ],
  "End card elements - Objects": [
    "colored bubbles",
    "wand",
    "rocks",
    "boots",
    "large brown mushrooms",
    "trees",
    "a wand",
    "game screen",
    "crystals",
    "mushrooms",
  ],
};

const OPERATORS = {
  text: ["is", "is not", "contains", "does not contain"],
  number: ["equals", "greater than", "lesser than", "between"],
};

interface FilterOption {
  category: string;
  subcategory: string;
  operator: string;
  value: string | string[] | number;
}

interface FilterSystemProps {
  onApplyFilters: (filters: FilterOption[]) => void;
}

const FilterSystem: React.FC<FilterSystemProps> = ({ onApplyFilters }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
  const [selectedOperator, setSelectedOperator] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [textInputValue, setTextInputValue] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(0);
  const [appliedFilters, setAppliedFilters] = useState<FilterOption[]>([]);
  const [logicalOperator, setLogicalOperator] = useState<string>("AND");

  const tabs = ["Columns", "Tags", "Metrics"];
  const searchRef = useRef<HTMLInputElement>(null);

  // Get sample values for the selected subcategory
  const getSampleValues = (subcategory: string): string[] => {
    if (SAMPLE_VALUES[subcategory as keyof typeof SAMPLE_VALUES]) {
      return SAMPLE_VALUES[subcategory as keyof typeof SAMPLE_VALUES];
    }

    // For tags that don't have specific sample values
    if (selectedCategory === "tags") {
      return ["UGC", "voiceover", "English", "yes"];
    }

    return ["Sample 1", "Sample 2", "Sample 3"];
  };

  // Filter values based on search term
  const filterBySearch = (items: string[], searchTerm: string): string[] => {
    if (!searchTerm) return items;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return items.filter((item) => item.toLowerCase().includes(lowerCaseSearch));
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    setStep(1);
  };

  const handleClose = () => {
    setAnchorEl(null);
    resetSelections();
  };

  const resetSelections = () => {
    setSelectedCategory("");
    setSelectedSubcategory("");
    setSelectedOperator("");
    setSearchValue("");
    setSelectedValues([]);
    setTextInputValue("");
    setStep(1);
  };

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleCategorySelect = (category: string, subcategory: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setStep(2);
  };

  const handleOperatorSelect = (operator: string) => {
    setSelectedOperator(operator);
    setStep(3);
  };

  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      setSelectedValues(selectedValues.filter((v) => v !== value));
    } else {
      setSelectedValues([...selectedValues, value]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const values = getSampleValues(selectedSubcategory);
      setSelectedValues(values);
    } else {
      setSelectedValues([]);
    }
  };

  const handleApplyFilter = () => {
    const newFilter: FilterOption = {
      category: selectedCategory,
      subcategory: selectedSubcategory,
      operator: selectedOperator,
      value:
        selectedOperator === "between"
          ? [textInputValue]
          : selectedValues.length > 0
          ? selectedValues
          : textInputValue,
    };

    setAppliedFilters([...appliedFilters, newFilter]);
    onApplyFilters([...appliedFilters, newFilter]);
    resetSelections();
    setStep(1);
  };

  const handleRemoveFilter = (index: number) => {
    const newFilters = [...appliedFilters];
    newFilters.splice(index, 1);
    setAppliedFilters(newFilters);
    onApplyFilters(newFilters);
  };

  const handleLogicalOperatorChange = (
    _event: React.MouseEvent<HTMLElement>,
    newOperator: string
  ) => {
    if (newOperator !== null) {
      setLogicalOperator(newOperator);
    }
  };

  useEffect(() => {
    if (step === 1 && searchRef.current) {
      searchRef.current.focus();
    }
  }, [step]);

  const open = Boolean(anchorEl);
  const id = open ? "filter-popover" : undefined;

  const renderFilterOptions = () => {
    const category = tabs[activeTab].toLowerCase();
    const categoryKey = category === "columns" ? "columns" : category;

    const options =
      FILTER_CATEGORIES[categoryKey as keyof typeof FILTER_CATEGORIES];
    const filteredOptions = filterBySearch(options, searchValue);

    return filteredOptions.map((subcategory, index) => (
      <FilterOption
        key={index}
        onClick={() => handleCategorySelect(category, subcategory)}
      >
        <Typography>{subcategory}</Typography>
      </FilterOption>
    ));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Box sx={{ width: 320 }}>
            <PopoverHeader>
              <Typography variant="subtitle1" fontWeight="bold">
                Add Filter
              </Typography>
              <DeleteButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </DeleteButton>
            </PopoverHeader>

            <PopoverContent>
              <StyledTextField
                placeholder="Search"
                inputRef={searchRef}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2 }}
              />

              <StyledTabs
                value={activeTab}
                onChange={handleTabChange}
                variant="fullWidth"
                sx={{ mb: 2 }}
              >
                {tabs.map((tab, index) => (
                  <Tab key={index} label={tab} />
                ))}
              </StyledTabs>

              <Box sx={{ maxHeight: 300, overflow: "auto" }}>
                {renderFilterOptions()}
              </Box>
            </PopoverContent>
          </Box>
        );
      case 2:
        return (
          <Box sx={{ width: 320 }}>
            <PopoverHeader>
              <Typography variant="subtitle1" fontWeight="bold">
                Select Operator
              </Typography>
              <DeleteButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </DeleteButton>
            </PopoverHeader>

            <PopoverContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <CategoryLabel>
                    {selectedCategory === "tags" ? "Tag" : selectedCategory}
                  </CategoryLabel>
                  <CategoryValue>
                    {selectedSubcategory}
                    <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </CategoryValue>
                </Box>
                <DeleteButton size="small" onClick={() => setStep(1)}>
                  <DeleteOutlineIcon fontSize="small" />
                </DeleteButton>
              </Box>

              <StyledTextField
                select
                label="Select Operator"
                value={selectedOperator}
                onChange={(e) => handleOperatorSelect(e.target.value)}
                fullWidth
                variant="outlined"
                size="small"
                margin="dense"
              >
                {(selectedCategory === "metrics"
                  ? OPERATORS.number
                  : OPERATORS.text
                ).map((op) => (
                  <MenuItem key={op} value={op}>
                    {op}
                  </MenuItem>
                ))}
              </StyledTextField>

              {selectedOperator && (
                <Box
                  sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}
                >
                  <ActionButton variant="contained" onClick={() => setStep(3)}>
                    Next
                  </ActionButton>
                </Box>
              )}
            </PopoverContent>
          </Box>
        );
      case 3:
        return (
          <Box sx={{ width: 320 }}>
            <PopoverHeader>
              <Typography variant="subtitle1" fontWeight="bold">
                Set Value
              </Typography>
              <DeleteButton size="small" onClick={handleClose}>
                <CloseIcon fontSize="small" />
              </DeleteButton>
            </PopoverHeader>

            <PopoverContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <CategoryLabel>
                    {selectedCategory === "tags" ? "Tag" : selectedCategory}
                  </CategoryLabel>
                  <CategoryValue>
                    {selectedSubcategory}
                    <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </CategoryValue>
                </Box>
                <DeleteButton size="small" onClick={() => setStep(1)}>
                  <DeleteOutlineIcon fontSize="small" />
                </DeleteButton>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box sx={{ flexGrow: 1 }}>
                  <CategoryLabel>Operator</CategoryLabel>
                  <CategoryValue>
                    {selectedOperator}
                    <KeyboardArrowDownIcon fontSize="small" sx={{ ml: 0.5 }} />
                  </CategoryValue>
                </Box>
                <DeleteButton size="small" onClick={() => setStep(2)}>
                  <DeleteOutlineIcon fontSize="small" />
                </DeleteButton>
              </Box>

              {selectedCategory === "metrics" ||
              ["is", "is not", "contains", "does not contain"].includes(
                selectedOperator
              ) ? (
                <StyledTextField
                  placeholder="Enter Value"
                  value={textInputValue}
                  onChange={(e) => setTextInputValue(e.target.value)}
                  fullWidth
                  variant="outlined"
                  size="small"
                  margin="dense"
                  type={selectedCategory === "metrics" ? "number" : "text"}
                />
              ) : (
                <>
                  <StyledTextField
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    margin="dense"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <FormControlLabel
                    control={
                      <StyledCheckbox
                        checked={
                          selectedValues.length ===
                          getSampleValues(selectedSubcategory).length
                        }
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        size="small"
                      />
                    }
                    label="Select all"
                  />

                  <Box sx={{ maxHeight: 200, overflow: "auto" }}>
                    {filterBySearch(
                      getSampleValues(selectedSubcategory),
                      searchValue
                    ).map((value) => (
                      <FormControlLabel
                        key={value}
                        control={
                          <StyledCheckbox
                            checked={selectedValues.includes(value)}
                            onChange={() => handleCheckboxChange(value)}
                            size="small"
                          />
                        }
                        label={value}
                      />
                    ))}
                  </Box>
                </>
              )}

              <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
                <ActionButton
                  variant="contained"
                  onClick={handleApplyFilter}
                  disabled={
                    (selectedValues.length === 0 && textInputValue === "") ||
                    (selectedOperator === "between" && !textInputValue)
                  }
                >
                  Apply
                </ActionButton>
              </Box>
            </PopoverContent>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          <FilterButton
            variant="outlined"
            startIcon={<FilterListIcon />}
            onClick={handleClick}
          >
            Filters
          </FilterButton>

          {appliedFilters.length > 0 && (
            <>
              {appliedFilters.length > 1 && (
                <StyledToggleButtonGroup
                  value={logicalOperator}
                  exclusive
                  onChange={handleLogicalOperatorChange}
                  size="small"
                >
                  <ToggleButton value="AND" sx={{ px: 1, py: 0 }}>
                    AND
                  </ToggleButton>
                  <ToggleButton value="OR" sx={{ px: 1, py: 0 }}>
                    OR
                  </ToggleButton>
                </StyledToggleButtonGroup>
              )}

              {appliedFilters.map((filter, index) => (
                <StyledChip
                  key={index}
                  label={
                    <Typography variant="body2">
                      {filter.subcategory} {filter.operator}{" "}
                      {Array.isArray(filter.value)
                        ? filter.value.join(", ")
                        : filter.value}
                    </Typography>
                  }
                  onDelete={() => handleRemoveFilter(index)}
                />
              ))}
            </>
          )}
        </Box>
      </Box>

      <StyledPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        sx={{ mt: 1 }}
      >
        {renderStep()}
      </StyledPopover>
    </>
  );
};

export default FilterSystem;
