// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Status from "./pages/Status";
import StatusDetail from "./pages/StatusDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/status" element={<Status />} />
        <Route path="/status/:id" element={<StatusDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
