import { Toaster } from "react-hot-toast";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import BrowserRedirectPage from "./pages/BrowserRedirectPage";
import Coupons from "./pages/Coupons";
import History from "./pages/History";
import Home from "./pages/Home";
import LoginAuth from "./pages/LoginAuth";
import Notfound from "./pages/Notfound";
import PointShop from "./pages/PointShop";
import Points from "./pages/Points";
import Ranking from "./pages/Ranking";
import UnAuthorized from "./pages/UnAuthorized";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Home />} />
        <Route path="category/points" element={<Points />} />
        <Route path="category/giftbox/coupons" element={<Coupons />} />
        <Route path="category/giftbox/history" element={<History />} />
        <Route path="category/pointshop" element={<PointShop />} />
        <Route path="category/ranking" element={<Ranking />} />
        <Route path="login/auth" element={<LoginAuth />} />
        <Route path="login/redirect" element={<BrowserRedirectPage />} />
        <Route path="login/unauthorized" element={<UnAuthorized />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </AuthProvider>
  );
};

export default App;
