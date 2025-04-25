import "./App.css";
import DoctorList from "./components/DoctorList/DoctorList";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <DoctorList />
      </div>
    </BrowserRouter>
  );
}

export default App;
