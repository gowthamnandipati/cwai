import React, { useState, useEffect, useRef } from 'react';
import {
  Button, Box, MenuItem, Select, InputLabel, FormControl, Typography, Stack, IconButton,
  CircularProgress, Dialog, DialogTitle, DialogContent, DialogActions, Paper
} from '@mui/material';
import { UploadFile as UploadIcon, Download as DownloadIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next'; // ✅ i18next hook

const JdSide = () => {
  const { t } = useTranslation(); // ✅ useTranslation hook

  const [skill, setSkill] = useState('');
  const [designation, setDesignation] = useState('');
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [questionFile, setQuestionFile] = useState<File | null>(null);
  const [skillsList, setSkillsList] = useState<string[]>([]);
  const [designationsList, setDesignationsList] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingDesignations, setLoadingDesignations] = useState(true);

  const fileInputRefJD = useRef<HTMLInputElement | null>(null);
  const fileInputRefQB = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      setLoadingSkills(true);
      const token = localStorage.getItem('app_access_token');
      if (!token) return;
      try {
        const res = await fetch(`https://restapi.cwai.ykinnosoft.in/lov?lov_name=skill`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (Array.isArray(data)) setSkillsList(data);
      } catch (err) {
        console.error('Error fetching skills:', err);
      } finally {
        setLoadingSkills(false);
      }
    };
    fetchSkills();
  }, []);

  useEffect(() => {
    const fetchDesignations = async () => {
      setLoadingDesignations(true);
      const token = localStorage.getItem('app_access_token');
      if (!token) return;
      try {
        const res = await fetch(`https://restapi.cwai.ykinnosoft.in/lov?lov_name=designation`, {
          method: 'GET',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (Array.isArray(data)) setDesignationsList(data);
      } catch (err) {
        console.error('Error fetching designations:', err);
      } finally {
        setLoadingDesignations(false);
      }
    };
    fetchDesignations();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'jd' | 'qb') => {
    const file = e.target.files?.[0];
    if (file) type === 'jd' ? setJdFile(file) : setQuestionFile(file);
  };

  const handleUpload = async () => {
    if (!skill || !designation || !jdFile || !questionFile) {
      setModalMessage(t('Please select all fields and both files.'));
      setOpenModal(true);
      return;
    }

    const token = localStorage.getItem('app_access_token');
    if (!token) {
      setModalMessage(t('Authentication error. Please sign in again.'));
      setOpenModal(true);
      return;
    }

    setUploading(true);
    let responseMessage = '';

    try {
      const jdForm = new FormData();
      jdForm.append('jd', jdFile);
      jdForm.append('skill', skill);
      jdForm.append('designation', designation);

      const jdRes = await fetch(`https://restapi.cwai.ykinnosoft.in/assets/jd`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: jdForm,
      });
      const jdData = await jdRes.json();
      responseMessage += `${t('JD Upload')}: ${jdData.message || t('Success')}\n`;

      const qbForm = new FormData();
      qbForm.append('question_bank', questionFile);
      qbForm.append('skill', skill);
      qbForm.append('designation', designation);

      const qbRes = await fetch(`https://restapi.cwai.ykinnosoft.in/assets/question_bank`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: qbForm,
      });
      const qbData = await qbRes.json();
      responseMessage += `${t('Question Bank Upload')}: ${qbData.message || t('Success')}`;
    } catch {
      responseMessage = t('Error uploading files. Please try again.');
    } finally {
      setUploading(false);
      setModalMessage(responseMessage);
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setSkill('');
    setDesignation('');
    setJdFile(null);
    setQuestionFile(null);
    setModalMessage('');
    setOpenModal(false);
    fileInputRefJD.current!.value = '';
    fileInputRefQB.current!.value = '';
  };

  return (
    <Box p={3}>
      {/* Skill */}
      <FormControl fullWidth margin="normal">
        <InputLabel>{t('Skill')}</InputLabel>
        <Select value={skill} label={t('Skill')} onChange={(e) => setSkill(e.target.value)}>
          {loadingSkills ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : skillsList.map((s, idx) => (
            <MenuItem key={idx} value={s}>{s}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Designation */}
      <FormControl fullWidth margin="normal">
        <InputLabel>{t('Designation')}</InputLabel>
        <Select value={designation} label={t('Designation')} onChange={(e) => setDesignation(e.target.value)}>
          {loadingDesignations ? (
            <MenuItem value="">
              <CircularProgress size={20} />
            </MenuItem>
          ) : designationsList.map((d, idx) => (
            <MenuItem key={idx} value={d}>{d}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* JD File */}
      <Paper variant="outlined" sx={{ p: 2, mt: 2, mb: 1, border: '2px dashed #bbb' }}>
        <Typography fontWeight="bold">{t('JD File')}</Typography>
        <input ref={fileInputRefJD} type="file" accept=".docx" onChange={(e) => handleFileChange(e, 'jd')} hidden id="jd-upload" />
        <label htmlFor="jd-upload">
          <Button variant="outlined" startIcon={<UploadIcon />} component="span" sx={{ mt: 1 }}>
            {t('Choose JD File')}
          </Button>
        </label>
        {jdFile && (
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <Typography>{jdFile.name}</Typography>
            <IconButton size="small" onClick={() => {
              const url = URL.createObjectURL(jdFile);
              const a = document.createElement('a');
              a.href = url;
              a.download = jdFile.name;
              a.click();
            }}>
              <DownloadIcon />
            </IconButton>
          </Stack>
        )}
      </Paper>

      {/* QB File */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2, border: '2px dashed #bbb' }}>
        <Typography fontWeight="bold">{t('Question Bank File')}</Typography>
        <input ref={fileInputRefQB} type="file" accept=".docx" onChange={(e) => handleFileChange(e, 'qb')} hidden id="qb-upload" />
        <label htmlFor="qb-upload">
          <Button variant="outlined" startIcon={<UploadIcon />} component="span" sx={{ mt: 1 }}>
            {t('Choose QB File')}
          </Button>
        </label>
        {questionFile && (
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <Typography>{questionFile.name}</Typography>
            <IconButton size="small" onClick={() => {
              const url = URL.createObjectURL(questionFile);
              const a = document.createElement('a');
              a.href = url;
              a.download = questionFile.name;
              a.click();
            }}>
              <DownloadIcon />
            </IconButton>
          </Stack>
        )}
      </Paper>

      {/* Upload Button */}
      <Button variant="contained" fullWidth onClick={handleUpload} disabled={uploading} sx={{ mt: 2 }}>
        {uploading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : t('Submit')}
      </Button>

      {/* Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{t('Upload Result')}</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>{t('Close')}</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JdSide;
