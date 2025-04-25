import {
  AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography,
  Avatar, Tooltip, useMediaQuery, useTheme, Dialog, DialogTitle,
  DialogActions, Button, Divider
} from '@mui/material';
import { useEffect, useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import FlagEN from '../../../assets/icons/flags/ic-flag-en.svg';
import india from '../../../assets/icons/flags/india.png';

import IconSun from '../../../assets/icons/flags/IconSun.png';
import IconMoon from '../../../assets/icons/flags/Iconmoon.png';
import Avatar25 from '../../../assets/icons/avatar/avatar-25.webp';
import { useAppTheme } from '../../dashboard/Navbar/Theme/ThemeContext';

type NavbarProps = {
  onSidebarToggle: () => void;
};

const languageFlags = [
  { code: 'en', label: 'English', flag: FlagEN },
  { code: 'hi', label: 'हिंदी', flag: india },
  { code: 'te', label: 'తెలుగు', flag: india },
];

export function Navbar({ onSidebarToggle }: NavbarProps) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mode, toggleTheme } = useAppTheme();
  const { i18n, t } = useTranslation();
  const navigate = useNavigate();

  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [userAnchorEl, setUserAnchorEl] = useState<null | HTMLElement>(null);
  const [fontSizeAnchorEl, setFontSizeAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [fontSize, setFontSize] = useState<string>(localStorage.getItem('app_font_size') || 'medium');

  const userName = localStorage.getItem('user_name') || 'Guest';
  const userEmail = localStorage.getItem('user_email') || 'guest@example.com';

  const currentLang = i18n.language;
  const currentLanguage = languageFlags.find((l) => l.code === currentLang);

  // Apply font size to root html
  useEffect(() => {
    document.documentElement.setAttribute('data-font-size', fontSize);
    localStorage.setItem('app_font_size', fontSize);
  }, [fontSize]);

  const handleLangMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangSelect = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    setLangAnchorEl(null);
  };

  const handleFontSizeMenu = (event: React.MouseEvent<HTMLElement>) => {
    setFontSizeAnchorEl(event.currentTarget);
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    setFontSizeAnchorEl(null);
  };

  const handleUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => setUserAnchorEl(null);

  const handleLogoutConfirm = () => {
    setLogoutOpen(true);
    handleUserMenuClose();
  };

  const handleLogout = () => {
    localStorage.clear();
    i18n.changeLanguage('en');
    document.documentElement.setAttribute('data-font-size', 'medium');
    localStorage.setItem('app_font_size', 'medium');
    navigate('/');
  };


  const handleLogoutCancel = () => setLogoutOpen(false);

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - 240px)` },
        ml: { md: `240px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar>
        {!isDesktop && (
          <IconButton color="inherit" edge="start" onClick={onSidebarToggle} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {/* 🌐 Language Switcher */}
        <IconButton onClick={handleLangMenu}>
          <img
            src={currentLanguage?.flag}
            alt={currentLanguage?.label}
            style={{ width: 24, height: 24, borderRadius: '50%' }}
          />
        </IconButton>
        <Menu anchorEl={langAnchorEl} open={Boolean(langAnchorEl)} onClose={() => setLangAnchorEl(null)}>
          {languageFlags.map((lang) => (
            <MenuItem key={lang.code} onClick={() => handleLangSelect(lang.code)}>
              <img src={lang.flag} alt={lang.label} style={{ width: 20, height: 20, marginRight: 8 }} />
              {lang.label}
            </MenuItem>
          ))}
        </Menu>

        {/* 🔤 Font Size Selector */}
        <Tooltip title={t('Select Text Size')}>
          <IconButton onClick={handleFontSizeMenu}>
          <Icon icon="ph:text-aa-bold" width={22} />
          </IconButton>
        </Tooltip>
    <Menu
      anchorEl={fontSizeAnchorEl}
      open={Boolean(fontSizeAnchorEl)}
      onClose={() => setFontSizeAnchorEl(null)}
    >
      <MenuItem onClick={() => handleFontSizeChange('small')}>{t('Small')}</MenuItem>
      <MenuItem onClick={() => handleFontSizeChange('medium')}>{t('Medium')}</MenuItem>
      <MenuItem onClick={() => handleFontSizeChange('large')}>{t('Large')}</MenuItem>
      </Menu>
        {/* 🌙 Theme Switch */}
        <Tooltip title={mode === 'dark' ? t('Switch to light mode') : t('Switch to dark mode')}>
          <IconButton onClick={toggleTheme} color="inherit">
            <img src={mode === 'dark' ? IconSun : IconMoon} alt="toggle theme" style={{ width: 24, height: 24 }} />
          </IconButton>
        </Tooltip>

        {/* 👤 Avatar */}
        <Tooltip title="Account settings">
          <IconButton onClick={handleUserMenu} sx={{ p: 0, ml: 1 }}>
            <Avatar src={Avatar25} alt="User" sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Tooltip>

        {/* 👇 User Menu */}
        <Menu anchorEl={userAnchorEl} open={Boolean(userAnchorEl)} onClose={handleUserMenuClose}>
          {/* ✅ Dynamic user info */}
          <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="subtitle1">{t('Username')}: {userName}</Typography>
          <Typography variant="body2" color="text.secondary">{t('Email')}: {userEmail}</Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleUserMenuClose}>
            <Icon icon="solar:home-angle-bold-duotone" width={20} style={{ marginRight: 8 }} />
            {t('Home')}
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <Icon icon="solar:shield-keyhole-bold-duotone" width={20} style={{ marginRight: 8 }} />
            {t('Profile')}
          </MenuItem>
          <MenuItem onClick={handleUserMenuClose}>
            <Icon icon="solar:settings-bold-duotone" width={20} style={{ marginRight: 8 }} />
            {t('Settings')}
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogoutConfirm} sx={{ color: 'error.main', fontWeight: 600 }}>
            <Icon icon="solar:logout-3-bold-duotone" width={20} style={{ marginRight: 8 }} />
            {t('Logout')}
          </MenuItem>
        </Menu>


        {/* 🔐 Logout Dialog */}
        <Dialog open={logoutOpen} onClose={handleLogoutCancel}>
          <DialogTitle>{t('Are you sure you want to logout?')}</DialogTitle>
          <DialogActions>
            <Button onClick={handleLogoutCancel}>{t('Cancel')}</Button>
            <Button onClick={handleLogout} variant="contained" color="error">{t('Logout')}</Button>
          </DialogActions>
        </Dialog>
      </Toolbar>
    </AppBar>
  );
}
