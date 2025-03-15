// DetailModal.tsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  IconButton,
  Button,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip,
  Stack,
  styled,
  alpha,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

// Theme colors
const PRIMARY_COLOR = "#E4FE77";
const SECONDARY_COLOR = "#333333";

// Styled components
const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    borderRadius: "12px",
    maxWidth: "800px",
    width: "100%",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(() => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.7),
  padding: "16px 24px",
}));

const StyledDialogContent = styled(DialogContent)(() => ({
  padding: "24px",
}));

const StyledDialogActions = styled(DialogActions)(() => ({
  padding: "16px 24px",
  borderTop: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
}));

const CloseButton = styled(IconButton)(() => ({
  color: SECONDARY_COLOR,
  "&:hover": {
    backgroundColor: alpha(SECONDARY_COLOR, 0.1),
  },
}));

const ActionButton = styled(Button)(() => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.8),
  color: SECONDARY_COLOR,
  fontWeight: "bold",
  padding: "8px 16px",
  borderRadius: "8px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: PRIMARY_COLOR,
  },
}));

const StyledTableContainer = styled(TableContainer)(() => ({
  marginBottom: "16px",
  border: `1px solid ${alpha(PRIMARY_COLOR, 0.3)}`,
  borderRadius: "8px",
}));

const HeaderCell = styled(TableCell)(() => ({
  fontWeight: "bold",
  backgroundColor: alpha(PRIMARY_COLOR, 0.2),
  color: SECONDARY_COLOR,
}));

const ValueCell = styled(TableCell)(() => ({
  color: SECONDARY_COLOR,
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
}));

const TagChip = styled(Chip)(({ theme }) => ({
  backgroundColor: alpha(PRIMARY_COLOR, 0.6),
  color: SECONDARY_COLOR,
  fontWeight: "medium",
  margin: "2px",
  "&:hover": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.8),
  },
}));

const TitleText = styled(Typography)(() => ({
  fontWeight: "bold",
  color: SECONDARY_COLOR,
  fontSize: "1.25rem",
}));

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose, data }) => {
  if (!data) return null;

  // Function to render tags as separate chips
  const renderTags = (tagsString: string) => {
    if (!tagsString || tagsString.length === 0) return <span>-</span>;

    const tagsArray = tagsString
      .split(";")
      .filter((tag) => tag.trim().length > 0);

    if (tagsArray.length === 0) return <span>-</span>;

    return (
      <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
        {tagsArray.map((tag, index) => (
          <TagChip key={index} label={tag.trim()} size="small" />
        ))}
      </Stack>
    );
  };

  // Format value for display
  const formatValue = (key: string, value: any) => {
    if (key === "tags" && typeof value === "string") {
      return renderTags(value);
    }

    if (key === "ipm" || key === "ctr" || key === "cpm") {
      return typeof value === "number" ? value.toFixed(2) : value;
    }

    if (key === "spend") {
      return typeof value === "number" ? `$${value.toLocaleString()}` : value;
    }

    if (key === "cost_per_click" || key === "cost_per_install") {
      return typeof value === "number" ? `$${value.toFixed(2)}` : value;
    }

    if (key === "impressions" || key === "clicks" || key === "installs") {
      return typeof value === "number" ? value.toLocaleString() : value;
    }

    return value;
  };

  return (
    <StyledDialog open={isOpen} onClose={onClose} maxWidth="md" fullWidth>
      <StyledDialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <TitleText>Creative Details: {data.creative_id}</TitleText>
          <CloseButton onClick={onClose} size="small">
            <CloseIcon />
          </CloseButton>
        </Box>
      </StyledDialogTitle>
      <StyledDialogContent dividers>
        <StyledTableContainer>
          <Table>
            <TableBody>
              {Object.entries(data).map(([key, value]: [string, any]) => (
                <TableRow key={key} hover>
                  <HeaderCell component="th" scope="row" sx={{ width: "30%" }}>
                    {key.replace(/_/g, " ")}
                  </HeaderCell>
                  <ValueCell>{formatValue(key, value)}</ValueCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledDialogContent>
      <StyledDialogActions>
        <ActionButton onClick={onClose} variant="contained" disableElevation>
          Close
        </ActionButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

export default DetailModal;
