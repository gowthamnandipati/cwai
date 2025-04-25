import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import logo from '../../../assets/logo.png';
import { Icon } from '@iconify/react';

import AnalyticsIcon from '../../../assets/icons/sidebar/ic-analytics.svg';
import User from '../../../assets/icons/Sidebar/ic-user.svg';

import i18n from '../../../i18n';
import "../../../styles/sidebar.css";

const drawerWidth = 240;

const navItems = [
  {
    title: 'Dashboard',
    path: 'dashboard',
    icon: <img src={AnalyticsIcon} alt="Dashboard" style={{ width: 22, height: 22 }} />,
  },
  {
    title: 'Candidate Info',
    path: 'candiadate',
    icon: <img src={User} alt="Candidate Info" style={{ width: 22, height: 22 }} />,
  },
  {
    title: 'JD Upload',
    path: 'Jd',
    icon: <Icon icon="mdi:cloud-upload" width={22} />,
  },
  {
    title: 'Configurations',
    path: 'Configuration',
    icon: <Icon icon="mdi:cog" width={22} />,
  },
  {
    title: 'Logout',
    path: '/',
    icon: <Icon icon="mdi:logout" width={20} style={{ marginRight: 8 }} />,
  },
];

type SidebarProps = {
  open: boolean;
  onClose: () => void;
};

export function Sidebar({ open, onClose }: SidebarProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [logoutOpen, setLogoutOpen] = useState(false);

  const handleLogoutConfirm = () => {
    localStorage.clear();
    i18n.changeLanguage('en'); // Reset language
    navigate('/');
    setLogoutOpen(false);
  };

  useEffect(() => {
    if (!isDesktop) {
      onClose();
    }
  }, [location.pathname]);

  const drawer = (
    <Box
      sx={{
        width: drawerWidth,
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        px: 2,
        boxSizing: 'border-box',
      }}
    >
      {/* Logo */}
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
        <img src={logo} alt="Logo" style={{ width: 170, height: 'auto',marginTop:'10%' }} />
      </Box>

      {/* Navigation Items */}
      <List>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;

          const handleClick = () => {
            if (item.title === 'Logout') {
              setLogoutOpen(true);
            } else {
              navigate(item.path);
            }
          };

          return (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={handleClick}
                sx={{
                  borderRadius: 1,
                  color: isActive ? 'primary.main' : 'text.secondary',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'inherit' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={t(item.title)} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout Confirmation Dialog */}
      <Dialog open={logoutOpen} onClose={() => setLogoutOpen(false)}>
        <DialogTitle>{t('Are you sure you want to logout?')}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setLogoutOpen(false)}>{t('Cancel')}</Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error">
            {t('Logout')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );

  return isDesktop ? (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      }}
    >
      {drawer}
    </Drawer>
  ) : (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          overflowY: 'auto',
          overflowX: 'hidden',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
}
