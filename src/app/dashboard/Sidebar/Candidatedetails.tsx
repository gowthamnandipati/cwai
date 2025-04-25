'use client';
import * as React from 'react';
import { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { CandidateSide } from '../../../components/dashboard/Sidebarcomponents/CandidateSide';
import { useTranslation } from 'react-i18next'; // ⬅️ Import translation hook

export default function Candidatedetails(): React.JSX.Element {
  const [selectedTab, setSelectedTab] = useState(0);
  const { t } = useTranslation(); // ⬅️ Hook into translation

  const handleChange = (_event: React.SyntheticEvent, newValue: number): void => {
    setSelectedTab(newValue);
  };

  return (
    <>
      {/* 🧑 Greeting Title */}
      <h2 className="dashboard-title">{t('INTERVIEWS 📝')}</h2>

      {/* 🗂️ Tabs */}
      <Tabs
        value={selectedTab}
        onChange={handleChange}
        aria-label="Interview Tabs"
        sx={{
          '& .MuiTabs-indicator': { backgroundColor: '#1E88E5' },
          '& .MuiTab-root': {
            textTransform: 'none',
            fontWeight: 'bold',
            fontSize: '16px',
            color: '#555',
            '&:hover': { color: '#1E88E5' },
            '&.Mui-selected': { color: '#1E88E5' }
          }
        }}
      >
        <Tab label={t('Not Scheduled')} id="not-scheduled-tab" aria-controls="not-scheduled-panel" />
        <Tab label={t('Scheduled')} id="scheduled-tab" aria-controls="scheduled-panel" />
        <Tab label={t('In Progress')} id="inprogress-tab" aria-controls="inprogress-panel" />
        <Tab label={t('Completed')} id="completed-tab" aria-controls="completed-panel" />
        <Tab label={t('ALL')} id="all-tab" aria-controls="all-panel" />
      </Tabs>

      {/* 📦 Tab Panels */}
      <Box role="tabpanel" hidden={selectedTab !== 0} id="not-scheduled-panel" aria-labelledby="not-scheduled-tab">
        {selectedTab === 0 && <CandidateSide rowsPerPage={10} status="Not Scheduled" selectedTab={0} />}
      </Box>

      <Box role="tabpanel" hidden={selectedTab !== 1} id="scheduled-panel" aria-labelledby="scheduled-tab">
        {selectedTab === 1 && <CandidateSide rowsPerPage={10} status="Scheduled" selectedTab={1} />}
      </Box>

      <Box role="tabpanel" hidden={selectedTab !== 2} id="inprogress-panel" aria-labelledby="inprogress-tab">
        {selectedTab === 2 && <CandidateSide rowsPerPage={10} status="In Progress" selectedTab={2} />}
      </Box>

      <Box role="tabpanel" hidden={selectedTab !== 3} id="completed-panel" aria-labelledby="completed-tab">
        {selectedTab === 3 && <CandidateSide rowsPerPage={10} status="Completed" showTranscript showAnasysReport selectedTab={3} />}
      </Box>

      <Box role="tabpanel" hidden={selectedTab !== 4} id="all-panel" aria-labelledby="all-tab">
        {selectedTab === 4 && <CandidateSide rowsPerPage={10} status="ALL" selectedTab={4} />}
      </Box>
    </>
  );
}
