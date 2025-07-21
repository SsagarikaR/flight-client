// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Status from "./pages/Status";
import StatusDetail from "./pages/StatusDetail";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/status" element={<Status />} />
        <Route path="/status/:id" element={<StatusDetail />} />

        {/* Redirect for all unmatched routes */}
        <Route path="/" element={<Navigate to="/status" />} />

        {/* Fallback for any other undefined route */}
        <Route path="*" element={<Navigate to="/status" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
