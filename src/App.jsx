import { Routes, Route } from "react-router-dom";

import WorkPad from "./pages/WorkPad";
import Admin from "./pages/Admin";

function App() {
  return (
    <Routes>
      <Route path="/" element={<WorkPad />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

export default App;