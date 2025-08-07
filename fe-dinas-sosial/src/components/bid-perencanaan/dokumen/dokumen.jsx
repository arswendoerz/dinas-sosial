import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  MdVisibility,
  MdSend,
  MdEdit,
  MdDelete,
} from "react-icons/md";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from 'react-hot-toast';
import AddDokumen from "./add-dokumen";
import UpdateDokumen from "./update-dokumen";
import { GenericTableSkeleton, GenericCardSkeleton } from "../../skeleton";

export default function Dokumen() {
  const kategoriList = [
    "Term of Refference (TOR)", "Petunjuk Operasional Kegiatan (POK)", "Laporan Tahunan",
    "LPPD (Laporan Penyelenggaraan Pemerintahan Daerah)", "LKPJ (Laporan Keterangan Pertanggungjawaban)",
    "RENJA dan RENJA Perubahan", "Perjanjian Kinerja (PK)", "Indikator Kinerja Individu",
    "Indikator Kinerja Utama", "Manajemen Risiko", "Data Statistik BPS dan Walidata",
    "RENSTRA (Rencana Strategis)", "Laporan SPM (Standar Pelayanan Minimal)",
    "Rencana Aksi dan Evaluasi Rencana Aksi", "KUA-PPAS (Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara)",
    "RKA (Rencana Kerja dan Anggaran)", "DPA (Dokumen Pelaksanaan Anggaran)", "CASCADING",
    "Pohon Kinerja", "SPIP (Sistem Pengendalian Intern Pemerintah)", "LKJ (Laporan Kinerja)",
    "Evaluasi Renja / SIMONEV", "Inovasi Daerah", "Bahan Hearing / Rapat Dengar Pendapat",
    "Gender Aanalysis Pathway", "Gender Budgeting Statement", "Lain-lain",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("__semua__");
  const [selectedSort, setSelectedSort] = useState("__terbaru__");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);

  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = "https://archive-sos-drive.et.r.appspot.com/api/docs";

  const formatFirestoreTimestamp = (timestamp) => {
    if (!timestamp) return null;

    const formatRegex = /^\d{2}\/\d{2}\/\d{4}, \d{2}\.\d{2}\.\d{2}$/;
    if (typeof timestamp === 'string' && formatRegex.test(timestamp)) {
      return timestamp;
    }

    let date;
    if (typeof timestamp === 'object' && timestamp._seconds !== undefined) {
      date = new Date(timestamp._seconds * 1000 + timestamp._nanoseconds / 1000000);
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) {
      console.error('Could not parse date timestamp:', timestamp);
      return timestamp;
    }

    const dateString = date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const timeString = date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).replace(/:/g, '.');

    return `${dateString}, ${timeString}`;
  };

  const fetchDocuments = async (searchQuery = "", kategori = "__semua__", tanggal = "") => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `${API_BASE_URL}/`;
      if (searchQuery) {
        url = `${API_BASE_URL}/search?query=${encodeURIComponent(searchQuery)}`;
      } else {
        const params = new URLSearchParams();
        if (kategori !== "__semua__") {
          params.append("kategori", kategori);
        }
        if (tanggal) {
          params.append("tanggal", tanggal);
        }
        if (params.toString()) {
          url = `${API_BASE_URL}/?${params.toString()}`;
        }
      }
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        const transformedData = result.data.map(document => ({
          id: document.id,
          nomor: document.nomor,
          nama: document.nama,
          perihal: document.perihal,
          kategori: document.kategori,
          jenis: getFileTypeFromMimeType(document.jenis),
          tanggalUpload: formatFirestoreTimestamp(document.tanggalUpload),
          tanggalUpdate: document.tanggalUpdate ? formatFirestoreTimestamp(document.tanggalUpdate) : null,
          url: document.url,
          userId: document.userId,
          role: document.role,
          updatedBy: document.updatedBy,
        }));
        setUploadedDocuments(transformedData);
      } else {
        throw new Error(result.message || 'Gagal mengambil data dokumen');
      }
    } catch (err) {
      console.error('Error fetching documents:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat mengambil data dokumen';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getFileTypeFromMimeType = (mimeType) => {
    const mimeToType = {
      'application/pdf': 'PDF',
      'application/msword': 'DOC',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
      'application/vnd.ms-excel': 'XLS',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
      'application/vnd.ms-powerpoint': 'PPT',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    };
    return mimeToType[mimeType] || 'OTHER';
  };

  const sendToWhatsApp = async (document) => {
    try {
      toast.loading('Menyiapkan file untuk WhatsApp...', { id: 'whatsapp-send' });
      const message = `*Dokumen: ${document.nama}*\n\n` +
        `*Nomor:* ${document.nomor}\n` +
        `*Perihal:* ${document.perihal}\n` +
        `*Kategori:* ${document.kategori}\n` +
        `*Tanggal Upload:* ${document.tanggalUpload}\n` +
        `*Link:* ${document.url}`;
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      toast.success('File berhasil disiapkan untuk WhatsApp!', { id: 'whatsapp-send' });
    } catch (error) {
      console.error('Error sending to WhatsApp:', error);
      toast.error('Gagal mengirim ke WhatsApp!', { id: 'whatsapp-send' });
    }
  };

  useEffect(() => {
    fetchDocuments(searchTerm, selectedKategori, selectedTanggal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setCurrentPage(1);
      fetchDocuments(searchTerm, selectedKategori, selectedTanggal);
    }, 500);
    return () => {
      clearTimeout(handler);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedKategori, selectedTanggal]);

  const parseCustomDate = (dateString) => {
    if (!dateString) return new Date(0);
    const [datePart, timePart] = dateString.split(', ');
    if (!datePart || !timePart) return new Date(0);
    const [day, month, year] = datePart.split('/');
    const [hour, minute, second] = timePart.split('.');
    return new Date(year, month - 1, day, hour, minute, second);
  };

  const filteredDocuments = uploadedDocuments
    .filter((document) => {
      const searchMatch =
        document.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        document.perihal.toLowerCase().includes(searchTerm.toLowerCase());
      const kategoriMatch =
        selectedKategori === "__semua__" || document.kategori === selectedKategori;
      const tanggalMatch =
        selectedTanggal === "" ||
        (document.tanggalUpload && document.tanggalUpload.slice(3, 10) === selectedTanggal.split('-').reverse().join('/'));
      return searchMatch && kategoriMatch && tanggalMatch;
    })
    .sort((a, b) => {
      if (selectedSort === "__terbaru__") {
        const dateA = a.tanggalUpdate ? parseCustomDate(a.tanggalUpdate) : parseCustomDate(a.tanggalUpload);
        const dateB = b.tanggalUpdate ? parseCustomDate(b.tanggalUpdate) : parseCustomDate(b.tanggalUpload);
        return dateB.getTime() - dateA.getTime();
      } else if (selectedSort === "__terlama__") {
        const dateA = a.tanggalUpdate ? parseCustomDate(a.tanggalUpdate) : parseCustomDate(a.tanggalUpload);
        const dateB = b.tanggalUpdate ? parseCustomDate(b.tanggalUpdate) : parseCustomDate(b.tanggalUpload);
        return dateA.getTime() - dateB.getTime();
      } else if (selectedSort === "__a_z__") {
        return a.nama.localeCompare(b.nama);
      } else if (selectedSort === "__z_a__") {
        return b.nama.localeCompare(a.nama);
      }
      return 0;
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (document) => {
    setEditingDoc(document);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (document) => {
    setDeletingDocument(document);
  };

  const confirmDelete = async () => {
    if (!deletingDocument) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Menghapus dokumen...');
    try {
      const response = await fetch(`${API_BASE_URL}/${deletingDocument.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      if (result.success) {
        toast.success(`Dokumen "${deletingDocument.nama}" berhasil dihapus!`, {
          id: loadingToast,
          duration: 4000,
        });
        await fetchDocuments(searchTerm, selectedKategori, selectedTanggal);
      } else {
        throw new Error(result.message || 'Gagal menghapus dokumen');
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat menghapus dokumen';
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
      setDeletingDocument(null);
    }
  };

  const getPageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  const PaginationComponent = () => {
    const pageNumbers = getPageNumbers(totalPages, currentPage);
    return (
      <Pagination>
        <PaginationContent className="flex flex-wrap justify-center gap-2">
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
          {pageNumbers.map((page, i) => (
            <PaginationItem key={i}>
              {page === "..." ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredDocuments.length);

  const tableHeaders = [
    "Nomor", "Nama", "Perihal", "Kategori", "Jenis", "Tgl Upload", "Tgl Update"
  ];

  const tableActionSkeleton = (
    <div className="grid grid-cols-2 gap-1 justify-center items-center">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-6 w-6 rounded" />
    </div>
  );

  const cardActionSkeleton = (
    <>
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-12" />
      <Skeleton className="h-4 w-12" />
    </>
  );

  return (
    <div data-aos="fade-up" className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Daftar Dokumen Diupload
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 flex-wrap items-stretch mb-1">
        <Input
          placeholder="Cari nama, nomor, atau perihal dokumen"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <Select value={selectedKategori} onValueChange={setSelectedKategori}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__semua__">Semua Kategori</SelectItem>
            {kategoriList.map((kat) => (
              <SelectItem key={kat} value={kat}>
                {kat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedSort} onValueChange={setSelectedSort}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Urutkan Dokumen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__terbaru__">Terbaru</SelectItem>
            <SelectItem value="__terlama__">Terlama</SelectItem>
            <SelectItem value="__a_z__">Nama (A-Z)</SelectItem>
            <SelectItem value="__z_a__">Nama (Z-A)</SelectItem>
          </SelectContent>
        </Select>
        <div className="flex w-full md:w-auto gap-2">
          <Input
            type="month"
            value={selectedTanggal}
            onChange={(e) => setSelectedTanggal(e.target.value)}
            className="flex-1 min-w-[100px]"
          />
          <AddDokumen
            kategoriList={kategoriList}
            isSubmitting={isSubmitting}
            setIsSubmitting={setIsSubmitting}
            setError={setError}
            fetchDocuments={() => fetchDocuments(searchTerm, selectedKategori, selectedTanggal)}
            API_BASE_URL={API_BASE_URL}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg border">
        <div className="hidden md:block overflow-x-auto w-full">
          {isLoading ? (
            <GenericTableSkeleton
              headers={tableHeaders}
              actionSkeleton={tableActionSkeleton}
              rowCount={5}
            />
          ) : (
            <Table className="text-left text-sm border-collapse w-full">
              <TableHeader className="bg-gray-50 border-b">
                <TableRow>
                  {[...tableHeaders, "Aksi"].map((col, i) => (
                    <TableHead
                      key={i}
                      className={`px-4 py-3 font-semibold text-gray-700 ${i < tableHeaders.length ? "border-r" : ""} whitespace-nowrap ${i === tableHeaders.length ? "text-center" : ""}`}
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDocuments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={tableHeaders.length + 1}
                      className="text-center py-6 text-gray-500"
                    >
                      Tidak ada dokumen ditemukan.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDocuments.map((document) => (
                    <TableRow key={document.id} className="hover:bg-gray-50 border-b">
                      <TableCell className="px-4 py-1 border-r">
                        {document.nomor}
                      </TableCell>
                      <TableCell
                        className="px-4 py-1 border-r max-w-[200px] break-words whitespace-normal"
                        title={document.nama}
                      >
                        {document.nama}
                      </TableCell>
                      <TableCell
                        className="px-4 py-1 border-r max-w-[200px] break-words whitespace-normal"
                        title={document.perihal}
                      >
                        {document.perihal}
                      </TableCell>
                      <TableCell
                        className="px-4 py-1 border-r max-w-[180px] break-words whitespace-normal"
                        title={document.kategori}
                      >
                        {document.kategori}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r">
                        {document.jenis}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r whitespace-normal">
                        {document.tanggalUpload}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r whitespace-normal">
                        {document.tanggalUpdate || "-"}
                        {document.updatedBy && (
                          <div
                            className="text-xs text-gray-500"
                            title={document.updatedBy}
                          >
                            Oleh: {document.updatedBy.split(' ').slice(0, 2).join(' ')}{document.updatedBy.split(' ').length > 2 ? '...' : ''}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-1 text-center">
                        <div className="grid grid-cols-2 gap-1 justify-center items-center">
                          <a
                            href={document.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 p-1 rounded"
                            title="Lihat"
                          >
                            <MdVisibility size={18} />
                          </a>
                          <button
                            onClick={() => sendToWhatsApp(document)}
                            className="text-green-600 hover:text-green-800 p-1 rounded"
                            title="Kirim ke WhatsApp"
                            disabled={isSubmitting}
                          >
                            <MdSend size={18} />
                          </button>
                          <button
                            onClick={() => handleEdit(document)}
                            className="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                            title="Edit"
                            disabled={isSubmitting}
                          >
                            <MdEdit size={18} />
                          </button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                onClick={() => handleDelete(document)}
                                className="text-red-600 hover:text-red-800 p-1 rounded"
                                title="Hapus"
                                disabled={isSubmitting}
                              >
                                <MdDelete size={18} />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Konfirmasi Hapus Dokumen
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus dokumen "
                                  {document.nama}"? Tindakan ini tidak dapat
                                  dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isSubmitting}>
                                  Batal
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={confirmDelete}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                  disabled={isSubmitting}
                                >
                                  {isSubmitting ? "Menghapus..." : "Hapus"}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <div className="md:hidden space-y-4 p-4">
          {isLoading ? (
            <>
              {Array.from({ length: 5 }).map((_, index) => (
                <GenericCardSkeleton
                  key={index}
                  actionSkeleton={cardActionSkeleton}
                />
              ))}
            </>
          ) : (
            <>
              {paginatedDocuments.map((document) => (
                <Card
                  key={document.id}
                  className="rounded-xl shadow border p-4"
                >
                  <div className="space-y-0">
                    <h3 className="font-semibold text-base text-gray-900">
                      {document.nomor}
                    </h3>
                    <p className="text-sm font-medium text-gray-800">
                      {document.nama}
                    </p>
                    <p className="text-xs text-gray-600">{document.perihal}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs mt-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {document.kategori}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded">
                      {document.jenis}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-3">
                    <span>Upload: {document.tanggalUpload}</span>
                    <span>Update: {document.tanggalUpdate || "-"}</span>
                  </div>
                  <div className="flex justify-center items-center gap-4 pt-3 mt-3 border-t text-sm">
                    <a
                      href={document.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                    >
                      <MdVisibility size={16} /> Lihat
                    </a>
                    <button
                      onClick={() => sendToWhatsApp(document)}
                      className="flex items-center gap-1 text-green-600 hover:text-green-800"
                      disabled={isSubmitting}
                    >
                      <MdSend size={16} /> Kirim
                    </button>
                    <button
                      onClick={() => handleEdit(document)}
                      className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                      disabled={isSubmitting}
                    >
                      <MdEdit size={16} /> Edit
                    </button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          onClick={() => handleDelete(document)}
                          className="flex items-center gap-1 text-red-600 hover:text-red-800"
                          disabled={isSubmitting}
                        >
                          <MdDelete size={16} /> Hapus
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Konfirmasi Hapus Dokumen
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus dokumen "{document.nama}"?
                            Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel disabled={isSubmitting}>
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Menghapus..." : "Hapus"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
              {paginatedDocuments.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Tidak ada dokumen ditemukan.
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {totalPages > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center sm:justify-center sm:relative">
          <PaginationComponent />
          <div className="w-full text-center text-sm text-muted-foreground mt-3 sm:absolute sm:left-0 sm:w-auto sm:text-left sm:mt-0">
            Menampilkan {startIndex}-{endIndex} dari {filteredDocuments.length} data
          </div>
        </div>
      )}

      <UpdateDokumen
        editingDoc={editingDoc}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setEditingDoc={setEditingDoc}
        kategoriList={kategoriList}
        fetchDocuments={() => fetchDocuments(searchTerm, selectedKategori, selectedTanggal)}
        setError={setError}
        API_BASE_URL={API_BASE_URL}
      />
    </div>
  );
}