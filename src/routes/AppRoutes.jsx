import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Auth/Login"; // Login boleh langsung karena ringan

const HomePages = lazy(() => import("../pages/Dashboard/Home"));
const IndexMemberManagement = lazy(() => import("../pages/MemberManagement/IndexMemberManagement"));
const Deposit = lazy(() => import("../pages/Transactions/Deposit"));
const Withdrawal = lazy(() => import("../pages/Transactions/Withdrawal"));
const IndexReferralProgram = lazy(() => import("../pages/ReferralProgram/IndexReferralProgram"));
const MemberListReferral = lazy(() => import("../pages/ReferralProgram/MemberListReferral"));
const IndexBankManagement = lazy(() => import("../pages/BankManagement/IndexBankManagement"));
const DailyReports = lazy(() => import("../pages/Reports/DailyReports"));
const TransactionReports = lazy(() => import("../pages/Reports/TransactionReports"));
const PromotionsReports = lazy(() => import("../pages/Reports/PromotionReports"));
const WinLoseReports = lazy(() => import("../pages/Reports/WinLoseReports"));
const UserWinLose = lazy(() => import("../pages/Reports/UserWinLose"));
const PromotionDeposit = lazy(() => import("../pages/Promotions/PromotionDeposit"));
const ShareBonus = lazy(() => import("../pages/Promotions/ShareBonus"));
const Profile = lazy(() => import("../pages/Auth/Profile"));
const General = lazy(() => import("../pages/Settings/General"));
const SocialMedia = lazy(() => import("../pages/Settings/SocialMedia"));
const PopupSlider = lazy(() => import("../pages/Settings/PopupSlider"));
const Promotion = lazy(() => import("../pages/Settings/Promotion"));
const SeoManagement = lazy(() => import("../pages/Settings/SeoManagement"));
const Theme = lazy(() => import("../pages/Settings/Theme"));
const APIManagement = lazy(() => import("../pages/Settings/APIManagement"));
const DomainManagement = lazy(() => import("../pages/Settings/DomainManagement"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><HomePages /></PrivateRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><HomePages /></PrivateRoute>} />
        <Route path="/member-management" element={<PrivateRoute><IndexMemberManagement /></PrivateRoute>} />
        <Route path="/transactions/deposit" element={<PrivateRoute><Deposit /></PrivateRoute>} />
        <Route path="/transactions/withdrawal" element={<PrivateRoute><Withdrawal /></PrivateRoute>} />
        <Route path="/referral-program" element={<PrivateRoute><IndexReferralProgram /></PrivateRoute>} />
        <Route path="/referral-program/member-list" element={<PrivateRoute><MemberListReferral /></PrivateRoute>} />
        <Route path="/bank-management" element={<PrivateRoute><IndexBankManagement /></PrivateRoute>} />
        <Route path="/reports/daily" element={<PrivateRoute><DailyReports /></PrivateRoute>} />
        <Route path="/reports/transactions" element={<PrivateRoute><TransactionReports /></PrivateRoute>} />
        <Route path="/reports/promotions" element={<PrivateRoute><PromotionsReports /></PrivateRoute>} />
        <Route path="/reports/win-lose" element={<PrivateRoute><WinLoseReports /></PrivateRoute>} />
        <Route path="/reports/user-win-lose" element={<PrivateRoute><UserWinLose /></PrivateRoute>} />
        <Route path="/promotions/bonus-deposit" element={<PrivateRoute><PromotionDeposit /></PrivateRoute>} />
        <Route path="/promotions/share-bonus" element={<PrivateRoute><ShareBonus /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/settings/general" element={<PrivateRoute><General /></PrivateRoute>} />
        <Route path="/settings/social-media" element={<PrivateRoute><SocialMedia /></PrivateRoute>} />
        <Route path="/settings/popup-sliders" element={<PrivateRoute><PopupSlider /></PrivateRoute>} />
        <Route path="/settings/promotion" element={<PrivateRoute><Promotion /></PrivateRoute>} />
        <Route path="/settings/seo-management" element={<PrivateRoute><SeoManagement /></PrivateRoute>} />
        <Route path="/settings/theme-website" element={<PrivateRoute><Theme /></PrivateRoute>} />
        <Route path="/settings/api" element={<PrivateRoute><APIManagement /></PrivateRoute>} />
        <Route path="/settings/domain-meta" element={<PrivateRoute><DomainManagement /></PrivateRoute>} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;