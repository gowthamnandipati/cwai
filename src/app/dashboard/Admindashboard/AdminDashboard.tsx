import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

const AdminDashboard = () => {
  const theme = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs')); // Checks if the screen size is extra small (xs)

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        flexDirection: isSmallScreen ? 'column' : 'row', // Stack elements for xs screens
      }}
    >
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Navbar with toggle */}
        <Navbar onSidebarToggle={toggleSidebar} />

        {/* Main Title */}
        <h2 className="dashboard-title">Hi, Welcome back 👋</h2>

        {/* Scrollable Content Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px',
            paddingTop: '16px',
          }}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
