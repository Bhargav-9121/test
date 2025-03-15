import { useEffect, useState } from "react";
import Papa from "papaparse";

interface DataRow {
  [key: string]: string | string[];
}

const useLoadData = () => {
  const [data, setData] = useState<DataRow[]>([]);

  useEffect(() => {
    fetch("/Segwise Report.csv")
      .then((response) => response.text())
      .then((csvText) => {
        const parsedData = Papa.parse<DataRow>(csvText, { header: true }).data;
        setData(parsedData);
      });
  }, []);

  return data;
};

export default useLoadData;
