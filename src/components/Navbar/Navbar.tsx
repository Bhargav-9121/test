import React from "react";
import "./Navbar.css";
import { TextField, InputAdornment, styled, alpha } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

// Theme colors
const PRIMARY_COLOR = "#E4FE77";
const SECONDARY_COLOR = "#333333";

// Styled search field
const StyledSearchField = styled(TextField)(() => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.2),
    borderRadius: "20px",
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(PRIMARY_COLOR, 0.8),
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: PRIMARY_COLOR,
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: alpha(PRIMARY_COLOR, 0.5),
    },
  },
  "& .MuiInputBase-input": {
    padding: "10px 14px",
  },
  width: "300px",
}));

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ searchTerm, onSearchChange }) => {
  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <div className="nav-div">
      <div
        className="logo-container"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      >
        <img src="/logo.jpg" alt="img" className="logo-img" />
        <div>
          <h2 className="logo-heading">Segwise</h2>
          <p className="logo-para">Front End Test</p>
        </div>
      </div>

      <StyledSearchField
        placeholder="Search table..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: alpha(SECONDARY_COLOR, 0.7) }} />
            </InputAdornment>
          ),
        }}
        variant="outlined"
        size="small"
      />
    </div>
  );
};

export default Navbar;
