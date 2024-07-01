import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Sigin from "./pages/Signin";
import NotFound from "./pages/NotFounc";
import LinkPage from "./pages/LinkPage";
import UserLinks from "./pages/UserLinks";

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <UserLinks />
          </PrivateRoute>
        }
      />
      <Route
        path="/signin"
        element={
          <PublicRoute>
            <Sigin />
          </PublicRoute>
        }
      />
      {/* <Route
        path="/signup"
        element={
          <PublicRoute>
            <Signup />
          </PublicRoute>
        }
      /> */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
