import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login/Login";
import { UserAuthContextProvider } from "./context/userAuthContext";
import { DrawerContextProvider } from "./context/drawerContext";

import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";
import Chat from "./pages/Chat/Chat";
import PairKeys from "./pages/PairKeys/PairKeys";

function App() {
  //Login is the "home" route, next is Chat, and then PairKeys (for getting certificate for encryption)
  return (
    <Router>
      <UserAuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} /> 
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <DrawerContextProvider>
                  <Chat />
                </DrawerContextProvider>
              </ProtectedRoute>
            }
          />
          <Route path="/chat/pairkeys" element={<PairKeys />} />
          */
          {/* <Route path='*' element={<PageNotFound />} /> */}
        </Routes>
        <Toaster />
      </UserAuthContextProvider>
    </Router>
  );
}

export default App;
