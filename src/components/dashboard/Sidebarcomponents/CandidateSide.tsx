"use client";

import * as React from "react";
import {
  Box, Card, Checkbox, Table, TableBody, TableCell, TableHead, TablePagination, TableRow,
  LinearProgress, Button, Divider, Typography, Dialog, DialogTitle, DialogContent,
  DialogActions, Tooltip, TableSortLabel, Autocomplete, TextField, CircularProgress
} from "@mui/material";
import { Upload as UploadIcon, Download as DownloadIcon } from "@mui/icons-material";
import { MagnifyingGlass as MagnifyingGlassIcon } from "@phosphor-icons/react/dist/ssr/MagnifyingGlass";
import { useTranslation } from "react-i18next"; // 🔁 Import useTranslation
import { saveAs } from "file-saver";
import { debounce } from '@mui/material/utils';
import { useSelection } from "../../../hooks/use-selection";

interface CandidateResponseInfo {
  id: number;
  resume: number;
  skill_id: number;
  name: string;
  grade: string;
  location: string;
  department: string;
  email: string;
  interview_status: string;
}

interface CandidatesTableProps {
  initialPage?: number;
  rowsPerPage?: number;
  status?: string;
  showTranscript?: boolean;
  showAnasysReport?: boolean;
  selectedTab: number;
}

export function CandidateSide({
  initialPage = 0,
  showTranscript = false,
  showAnasysReport = false,
  selectedTab,
  status = "ALL"
}: CandidatesTableProps): React.JSX.Element {

  const { t } = useTranslation(); // 🟢 Initialize translation hook

  const [candidates, setCandidates] = React.useState<CandidateResponseInfo[]>([]);
  const [totalCandidates, setTotalCandidates] = React.useState<number>(0);
  const [page, setPage] = React.useState<number>(initialPage);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [modalMessage, setModalMessage] = React.useState<string>("");
  const [rowsPerPage, setRowsPerPage] = React.useState<number>(10);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<keyof CandidateResponseInfo>("id");
  const [downloading, setDownloading] = React.useState<boolean>(false);

  const rowIds = React.useMemo(() => candidates.map((c) => c.id.toString()), [candidates]);
  const { selected, selectAll, deselectAll, toggleSelection } = useSelection(rowIds);

  const selectedSome = selected.size > 0 && selected.size < candidates.length;
  const selectedAll = candidates.length > 0 && selected.size === candidates.length;

  const debouncedFetch = debounce(async (query: string | string[]) => {
    if (query.length < 1) {
      setCandidates([]);
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem("app_access_token");
      const response = await fetch(`https://restapi.cwai.ykinnosoft.in/search?search_text=${query}`, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      setCandidates(data);
    } catch {
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, 300);

  React.useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("app_access_token");
        const res = await fetch(`https://restapi.cwai.ykinnosoft.in/candidates?page_num=${page + 1}&results_per_page=${rowsPerPage}&interview_status=${status}`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        const data = await res.json();
        setCandidates(data.data || []);
        setTotalCandidates(data.count || 0);
      } catch (err) {
        setError(t("Failed to fetch candidates"));
      } finally {
        setLoading(false);
      }
    })();
  }, [page, rowsPerPage, status]);

  const handleSort = (property: keyof CandidateResponseInfo) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedCandidates = React.useMemo(() => {
    return [...candidates].sort((a, b) => {
      const aVal = a[orderBy], bVal = b[orderBy];
      if (typeof aVal === "number" && typeof bVal === "number") return order === "asc" ? aVal - bVal : bVal - aVal;
      return order === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [candidates, order, orderBy]);

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
          {t("Selected")}: {selected.size}/{totalCandidates}
        </Typography>

        <Box display="flex" gap={2} flexWrap="wrap">
          <Autocomplete
            freeSolo
            options={candidates}
            getOptionLabel={(option) => typeof option === "string" ? option : option.name}
            onInputChange={(_, value) => debouncedFetch(value)}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={t("Search candidate")}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <>
                      <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                      {params.InputProps.startAdornment}
                    </>
                  ),
                  endAdornment: loading ? <CircularProgress size={15} /> : null,
                }}
              />
            )}
            sx={{ maxWidth: 400 }}
          />

          <Button
            variant="contained"
            onClick={() => {}} // your handler
            disabled={selected.size === 0}
          >
            {t("Schedule Interview")}
          </Button>

          <Button variant="outlined" onClick={() => {}}>
            {t("Download Excel")}
          </Button>
        </Box>

        {loading && <LinearProgress sx={{ mt: 2 }} />}
        {error && <Typography color="error">{error}</Typography>}

        <Box sx={{ overflowX: "auto", mt: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selectedAll}
                    indeterminate={selectedSome}
                    onChange={(e) => (e.target.checked ? selectAll() : deselectAll())}
                  />
                </TableCell>
                {["id", "name", "email", "location", "department", "grade", "interview_status"].map((key) => (
                  <TableCell key={key}>
                    <TableSortLabel
                      active={orderBy === key}
                      direction={orderBy === key ? order : "asc"}
                      onClick={() => handleSort(key as keyof CandidateResponseInfo)}
                    >
                      {t(key.charAt(0).toUpperCase() + key.slice(1))}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>{t("Resume")}</TableCell>
                {showAnasysReport && <TableCell>{t("Report")}</TableCell>}
                {showTranscript && <TableCell>{t("Transcript")}</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedCandidates.map((row) => (
                <TableRow key={row.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.has(row.id.toString())}
                      onChange={() => toggleSelection(row.id.toString())}
                    />
                  </TableCell>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.location}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>{row.grade}</TableCell>
                  <TableCell>{row.interview_status}</TableCell>
                  <TableCell>{row.resume ? t("Download") : t("Upload")}</TableCell>
                  {showAnasysReport && <TableCell>{t("Download")}</TableCell>}
                  {showTranscript && <TableCell>{t("Download")}</TableCell>}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>

        <Divider />
        <TablePagination
          component="div"
          count={totalCandidates}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value));
            setPage(0);
          }}
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} of ${count}`}
        />
      </Card>

      {/* Modal */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>{t("Response")}</DialogTitle>
        <DialogContent>
          <Typography>{modalMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>{t("Close")}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
