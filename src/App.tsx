import { useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import DataTable from "./components/DataTable";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <>
      <Navbar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
      <DataTable globalSearchTerm={searchTerm} />
    </>
  );
};

export default App;
