import LoginPage from "./app/auth/LoginPage"
import { AppThemeProvider } from './app/dashboard/Navbar/Theme/ThemeContext';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminDashboard from "./app/dashboard/Admindashboard/AdminDashboard";
import Dashboard from "./app/dashboard/Admindashboard/dashboard";
import Configuration from "./app/dashboard/Sidebar/Configuration";
import ProfileUpload from "./app/dashboard/Sidebar/ProfileUpload";
import Candidatedetails from "./app/dashboard/Sidebar/Candidatedetails";
import Jd from "./app/dashboard/Sidebar/Jd";
import { LanguageProvider } from './contexts/LanguageContext';



const App = () => {
  return (
    <LanguageProvider>
<AppThemeProvider>
<Router>
  <Routes>
    <Route path="/" element={<LoginPage/>}/>
    <Route path="/admin" element={<AdminDashboard/>}>
    <Route index element={<Dashboard/>} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="candiadate" element={<Candidatedetails />} />
    <Route path="profileupload" element={<ProfileUpload/>} />
    <Route path="Jd" element={<Jd/>} />
    <Route path="Configuration" element={<Configuration/>} />
  </Route>
  </Routes>
</Router>
</AppThemeProvider>
</LanguageProvider>

  )
}

export default App