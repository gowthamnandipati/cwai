'use client';

import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  Button, Stack, Paper, Select, MenuItem, FormControl, InputLabel, TextField, Table, 
  TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, CircularProgress, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography
} from '@mui/material';
import { useTranslation } from 'react-i18next'; // ✅ Import i18n

export default function Configurationside(): React.JSX.Element {
  const { t } = useTranslation(); // ✅ Hook to use translations

  const [lovName, setLovName] = useState('');
  const [lovValue, setLovValue] = useState('');
  const [lovList, setLovList] = useState<{ id: number; value: string }[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const fetchLOVValues = useCallback(async (): Promise<void> => {
    if (!lovName) return;
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('app_access_token');
      if (!token) throw new Error('Authentication required.');

      const response = await fetch(`https://restapi.cwai.ykinnosoft.in/lov?lov_name=${lovName}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch data');

      const data = (await response.json()) as string[];

      setLovList(Array.isArray(data)
        ? data.map((item, index) => ({ id: index + 1, value: item }))
        : []);
    } catch {
      setError(t('Error fetching data'));
    } finally {
      setLoading(false);
    }
  }, [lovName, t]);

  useEffect(() => {
    void fetchLOVValues();
  }, [fetchLOVValues]);

  const handleCheckboxChange = (id: number): void => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCloseModal = (): void => {
    setOpenModal(false);
    setModalMessage('');
    setLovName('');
    setLovValue('');
    setSelectedItems([]);
  };

  const handleSave = async (): Promise<void> => {
    if (!lovName || !lovValue) {
      setModalMessage(t('LOV Name and Value are required.'));
      setOpenModal(true);
      return;
    }

    try {
      const token = localStorage.getItem("app_access_token");
      if (!token) throw new Error("Authentication required.");

      const formData = new FormData();
      formData.append("lov_name", lovName);
      formData.append("lov_value", lovValue);

      const response = await fetch("https://restapi.cwai.ykinnosoft.in/lov", {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to save.");

      setModalMessage(t('Item saved successfully'));
      setLovList([...lovList, { id: lovList.length + 1, value: lovValue }]);
      setLovValue("");
    } catch (err: unknown) {
      setModalMessage(err instanceof Error ? err.message : t("Error saving."));
    } finally {
      setOpenModal(true);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedItems.length) {
      setModalMessage(t("No items selected for deletion."));
      setOpenModal(true);
      return;
    }

    const selectedValues = lovList
      .filter((item) => selectedItems.includes(item.id))
      .map((item) => item.value);

    if (!selectedValues.length) {
      setModalMessage(t("Selected values do not exist."));
      setOpenModal(true);
      return;
    }

    try {
      const token = localStorage.getItem('app_access_token');
      if (!token) throw new Error('Authentication required.');

      const formData = new FormData();
      formData.append("lov_name", lovName);
      formData.append("lov_value", selectedValues.join(','));

      const response = await fetch("https://restapi.cwai.ykinnosoft.in/lov", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to delete.");

      setLovList(lovList.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
      setModalMessage(t("Items deleted successfully."));
    } catch {
      setModalMessage(t("Error deleting items."));
    } finally {
      setOpenModal(true);
    }
  };

  return (
    <Stack spacing={3}>
      <FormControl fullWidth>
        <InputLabel>{t('Param')}</InputLabel>
        <Select value={lovName} label={t('Param')} onChange={(e) => setLovName(e.target.value)}>
          <MenuItem value="skill">{t('Skill')}</MenuItem>
          <MenuItem value="designation">{t('Designation')}</MenuItem>
        </Select>
      </FormControl>

      <TextField
        label={t('Key')}
        value={lovValue}
        onChange={(e) => {
          const value = e.target.value;
          const sanitizedValue = value.toUpperCase().replace(/[^A-Z0-9\s]/g, '');
          setLovValue(sanitizedValue);
        }}
        fullWidth
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="contained" color="primary" onClick={handleSave} disabled={!lovName || !lovValue}>
          {t('Save')}
        </Button>
        <Button variant="outlined" onClick={() => setLovName('')}>
          {t('Reset')}
        </Button>
        <Button variant="contained" color="error" onClick={handleDelete} disabled={!selectedItems.length}>
          {t('Delete')}
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Paper variant="outlined">
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>{t('Select')}</TableCell>
                <TableCell>{t('S.No')}</TableCell>
                <TableCell>{t('Key')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : lovList.length ? (
                lovList.map(({ id, value }) => (
                  <TableRow key={id}>
                    <TableCell>
                      <Checkbox checked={selectedItems.includes(id)} onChange={() => handleCheckboxChange(id)} />
                    </TableCell>
                    <TableCell>{id}</TableCell>
                    <TableCell>{value || t('N/A')}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    {t('No Data Available')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{t('Response')}</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>{t('Close')}</Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
