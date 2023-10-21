import { BrowserRouter, Routes, Route } from "react-router-dom";
import Irrigations from "./pages/Irrigations";
import AppLayout from "./pages/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="" element={<Irrigations />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
