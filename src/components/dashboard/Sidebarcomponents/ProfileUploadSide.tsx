import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  Typography,
  Input,
  styled,
  CircularProgress,
  
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const UploadCard = styled(Box)(({ theme }) => ({
  border: '2px dashed #ccc',
  borderRadius: '20px',
  padding: theme.spacing(5),
  width: '100%',
  maxWidth: 500,
  minHeight: 250,
  background: '#fff',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(2),
}));

const ProfileUploadSide = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.xlsx')) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      alert('Only .xlsx files are allowed');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setModalMessage('Please select a file first.');
      setModalOpen(true);
      return;
    }

    const token = localStorage.getItem('app_access_token');
    if (!token) {
      setModalMessage('Authentication error. Please sign in again.');
      setModalOpen(true);
      return;
    }

    const formData = new FormData();
    formData.append('bulk_profile', selectedFile);

    setLoading(true);
    try {
      const response = await fetch("https://restapi.cwai.ykinnosoft.in/assets/bulk_profile", {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `Server error: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch {}
        throw new Error(errorMessage);
      }

      const result = await response.json();

      let message = `Upload Summary:\n- Errors: ${result.errored_records ?? 0}\n- Skipped: ${result.existing_candidates_skipped ?? 0}\n- Added: ${result.new_candidates_added ?? 0}`;
      setModalMessage(message);
    } catch (error: any) {
      console.error('Upload error:', error);
      setModalMessage(error.message || 'An unknown error occurred.');
    } finally {
      setLoading(false);
      setModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalMessage('');
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <Box sx={{ display: 'flex', gap: 5, background: '#e6f0fa', p: 5, justifyContent: 'center', flexWrap: 'wrap' }}>
      {/* Single Profile */}
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="bold" mb={1}>Single Profile</Typography>
        <UploadCard>
          <Typography variant="body1">Update Single Profile</Typography>
          <Button variant="contained" sx={{ background: '#6c5ce7' }}>
            Single Profile Data
          </Button>
        </UploadCard>
      </Box>

      {/* Bulk Profile Upload */}
      <Box textAlign="center">
        <Typography variant="h6" fontWeight="bold" mb={1}>Bulk Profile Upload</Typography>
        <UploadCard>
          <CloudUploadIcon sx={{ fontSize: 40, color: '#1976d2' }} />
          <Typography variant="body1">Upload Bulk Profiles</Typography>

          <Button variant="contained" component="label" sx={{ background: '#6c5ce7' }}>
            Choose File
            <Input
              type="file"
              accept=".xlsx"
              sx={{ display: 'none' }}
              inputRef={fileInputRef}
              onChange={handleFileChange}
            />
          </Button>

          <Typography variant="caption" color="textSecondary">
            Allowed formats: <strong>.xlsx</strong>
          </Typography>

          {selectedFile && (
            <Typography variant="body2" color="textSecondary">
              Selected file: {selectedFile.name}
            </Typography>
          )}

          <Button
            variant="contained"
            disabled={!selectedFile || loading}
            onClick={handleUpload}
            sx={{
              mt: 1,
              background: selectedFile ? '#1976d2' : '#ccc',
              color: '#fff',
              cursor: selectedFile ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Upload'}
          </Button>
        </UploadCard>
      </Box>

      {/* Modal Dialog */}
      <Dialog open={modalOpen} onClose={handleCloseModal}>
        <DialogTitle>Upload Response</DialogTitle>
        <DialogContent>
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProfileUploadSide;
