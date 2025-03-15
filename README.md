# Segwise - Data Visualization & Filtering Tool
Live Link - https://segwise-assignment-nine.vercel.app/

## ✨ Features

- **Advanced Filtering System**: Filter data using multiple criteria with AND/OR logic
- **Global Search**: Quickly search across all table data from the navbar
- **Interactive Data Table**: Sort columns, paginate results, and view detailed information
- **Row Preview**: Click on any row to see a detailed preview of its data
- **Modern UI**: Clean, intuitive interface with a consistent theme (#E4FE77)

## 🛠️ Technologies

- **React**: UI library for building the component-based interface
- **TypeScript**: Type-safe JavaScript for improved developer experience
- **Vite**: Fast, modern build tool for frontend development
- **Material-UI (MUI) v6**: Component library for consistent, beautiful UI elements
- **PapaParse**: CSV parsing library for handling data import
- **CSS**: Custom styling for components

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/segwise.git
   cd segwise
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 📋 Usage

### Data Import

The application automatically loads data from the CSV file located at `src/assets/Segwise Report.csv`. To use your own data:

1. Replace the CSV file with your own data
2. Ensure your CSV has headers that match the expected format
3. Restart the application

### Filtering Data

1. Click the "Filter" button to open the filter panel
2. Select a category (Dimensions, Tags, or Metrics)
3. Choose a specific field to filter on
4. Select an operator (contains, equals, greater than, etc.)
5. Enter or select filter values
6. Click "Apply" to filter the data

### Searching

Use the search bar in the navbar to quickly find data across all columns in the table.

### Viewing Details

Click on any row to see a detailed preview card with all the information for that entry.

## 🧩 Project Structure

```
segwise/
├── public/
│   └── logo.jpg
├── src/
│   ├── assets/
│   │   └── Segwise Report.csv
│   ├── components/
│   │   ├── DataTable.tsx
│   │   ├── DetailModal.tsx
│   │   ├── FilterSystem.tsx
│   │   ├── Navbar/
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.css
│   │   ├── PreviewCard.tsx
│   │   └── RowPreview.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── LoadData.tsx
│   ├── main.tsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```
