import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./pages/AppLayout";
import IrrigationControl from "./pages/IrrigationControl";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="" element={<IrrigationControl />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
