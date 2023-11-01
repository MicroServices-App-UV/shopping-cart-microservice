import React from "react";
import { Stack } from "@mui/material";
import Navbar from "./components/Navbar/Navbar";
import ProductTable from "./components/ProductTable/ProductTable";

function App() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      height="100vh"
      style={{ height: "100vh" }}
    >
      <Navbar />
      <ProductTable /> {/* Utiliza el nuevo componente aquí */}
    </Stack>
  );
}

export default App;
