import { BrowserRouter, Routes, Route } from "react-router";
import { useState } from "react";
import Main from "../pages/Main";
import Log from "../pages/Log";
import MainLayout from "../layouts/MainLayout";
import { loadHistory , clearHistoryStorage} from "../utils/HistoryStorage";

const AppRoute = () => {
  const [history, setHistory] = useState(() => loadHistory());

  function handleClearHistory() {
    if (confirm("Clear all history ??")) {
      setHistory([]);
      clearHistoryStorage();
    }
  }

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            children
            element={<MainLayout history={history} setHistory={setHistory} onClear={handleClearHistory}/>}
          >
            <Route path="/" element={<Main />} />
            <Route path="/log" element={<Log />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default AppRoute;
