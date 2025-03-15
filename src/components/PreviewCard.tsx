// PreviewCard.tsx
import React from "react";
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  styled,
  alpha,
  Divider,
  Badge,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";

// Theme colors
const PRIMARY_COLOR = "#E4FE77";
const SECONDARY_COLOR = "#333333";

// Styled components
const StyledCard = styled(Card)(() => ({
  position: "fixed",
  bottom: 16,
  right: 16,
  width: 320,
  zIndex: 1000,
  borderRadius: "12px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.15)",
  cursor: "pointer",
  border: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
  transition: "transform 0.2s ease, box-shadow 0.2s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
  },
}));

const CardHeader = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 16px",
  backgroundColor: alpha(PRIMARY_COLOR, 0.2),
  borderBottom: `1px solid ${alpha(PRIMARY_COLOR, 0.5)}`,
}));

const StyledCardContent = styled(CardContent)(() => ({
  padding: "16px",
  "&:last-child": {
    paddingBottom: "16px",
  },
}));

const CloseButton = styled(IconButton)(() => ({
  color: SECONDARY_COLOR,
  padding: 4,
  "&:hover": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.4),
  },
}));

const DataField = styled(Box)(() => ({
  marginBottom: "12px",
}));

const FieldLabel = styled(Typography)(() => ({
  fontSize: "0.75rem",
  fontWeight: "medium",
  color: alpha(SECONDARY_COLOR, 0.7),
  textTransform: "uppercase",
  letterSpacing: "0.5px",
  marginBottom: "2px",
}));

const FieldValue = styled(Typography)(() => ({
  fontSize: "0.9rem",
  fontWeight: "medium",
  color: SECONDARY_COLOR,
}));

const ExpandPrompt = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "6px",
  padding: "8px 0",
  marginTop: "8px",
  backgroundColor: alpha(PRIMARY_COLOR, 0.1),
  borderRadius: "8px",
  "&:hover": {
    backgroundColor: alpha(PRIMARY_COLOR, 0.3),
  },
}));

const StyledDivider = styled(Divider)(() => ({
  margin: "12px 0",
  backgroundColor: alpha(PRIMARY_COLOR, 0.3),
}));

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: PRIMARY_COLOR,
    color: SECONDARY_COLOR,
    fontWeight: "bold",
  },
}));

interface PreviewCardProps {
  data: any;
  onClose: (event: React.MouseEvent) => void;
  onClick: () => void;
}

const PreviewCard: React.FC<PreviewCardProps> = ({
  data,
  onClose,
  onClick,
}) => {
  // Format currency values
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <StyledCard onClick={onClick}>
      <CardHeader>
        <StyledBadge>
          <VisibilityIcon
            sx={{ fontSize: 20, mr: 1, color: SECONDARY_COLOR }}
          />
        </StyledBadge>
        <CloseButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </CloseButton>
      </CardHeader>

      <StyledCardContent>
        <DataField>
          <FieldLabel>Creative ID</FieldLabel>
          <FieldValue fontWeight="bold">{data.creative_id}</FieldValue>
        </DataField>

        <DataField>
          <FieldLabel>Creative Name</FieldLabel>
          <FieldValue noWrap title={data.creative_name}>
            {data.creative_name}
          </FieldValue>
        </DataField>

        <StyledDivider />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DataField sx={{ width: "48%" }}>
            <FieldLabel>Country</FieldLabel>
            <FieldValue>{data.country}</FieldValue>
          </DataField>

          <DataField sx={{ width: "48%" }}>
            <FieldLabel>Ad Network</FieldLabel>
            <FieldValue>{data.ad_network}</FieldValue>
          </DataField>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <DataField sx={{ width: "48%" }}>
            <FieldLabel>Impressions</FieldLabel>
            <FieldValue>
              {typeof data.impressions === "number"
                ? data.impressions.toLocaleString()
                : data.impressions}
            </FieldValue>
          </DataField>

          <DataField sx={{ width: "48%" }}>
            <FieldLabel>Spend</FieldLabel>
            <FieldValue>
              {typeof data.spend === "number"
                ? formatCurrency(data.spend)
                : data.spend}
            </FieldValue>
          </DataField>
        </Box>

        <ExpandPrompt>
          <ExpandMoreIcon sx={{ color: SECONDARY_COLOR, fontSize: 20 }} />
          <Typography
            variant="body2"
            sx={{ color: SECONDARY_COLOR, fontWeight: "medium" }}
          >
            View Complete Details
          </Typography>
        </ExpandPrompt>
      </StyledCardContent>
    </StyledCard>
  );
};

export default PreviewCard;
