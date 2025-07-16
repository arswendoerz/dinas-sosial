import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  MdAdd,
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
} from "@/components/ui/pagination";
import { Card } from "@/components/ui/card";
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

export default function Dokumen() {
  const kategoriList = [
    "Term of Refference (TOR)",
    "Petunjuk Operasional Kegiatan (POK)",
    "Laporan Tahunan",
    "LPPD (Laporan Penyelenggaraan Pemerintahan Daerah)",
    "LKPJ (Laporan Keterangan Pertanggungjawaban)",
    "RENJA dan RENJA Perubahan",
    "Perjanjian Kinerja (PK)",
    "Indikator Kinerja Individu",
    "Indikator Kinerja Utama",
    "Manajemen Risiko",
    "Data Statistik BPS dan Walidata",
    "RENSTRA (Rencana Strategis)",
    "Laporan SPM (Standar Pelayanan Minimal)",
    "Rencana Aksi dan Evaluasi Rencana Aksi",
    "KUA-PPAS (Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara)",
    "RKA (Rencana Kerja dan Anggaran)",
    "DPA (Dokumen Pelaksanaan Anggaran)",
    "CASCADING",
    "Pohon Kinerja",
    "SPIP (Sistem Pengendalian Intern Pemerintah)",
    "LKJ (Laporan Kinerja)",
    "Evaluasi Renja / SIMONEV",
    "Inovasi Daerah",
    "Bahan Hearing / Rapat Dengar Pendapat",
    "Gender Aanalysis Pathway",
    "Gender Budgeting Statement",
    "Lain-lain",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("__semua__");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingDocument, setDeletingDocument] = useState(null);
  
  // State untuk data dari API
  const [uploadedDocuments, setUploadedDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = "http://localhost:9000/api/docs";

  // Fetch documents dari API
  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
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
          tanggalUpload: document.tanggalUpload,
          tanggalUpdate: document.tanggalUpdate,
          url: document.url,
          userId: document.userId,
          role: document.role,
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

  // Function untuk mengirim file ke WhatsApp
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
    fetchDocuments();
  }, []);

  // Filter documents
  const filteredDocuments = uploadedDocuments.filter((document) => {
    const searchMatch =
      document.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      document.perihal.toLowerCase().includes(searchTerm.toLowerCase());

    const kategoriMatch =
      selectedKategori === "__semua__" || document.kategori === selectedKategori;

    const tanggalMatch =
      selectedTanggal === "" ||
      document.tanggalUpload.slice(3, 10) === selectedTanggal.split('-').reverse().join('/');

    return searchMatch && kategoriMatch && tanggalMatch;
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
        
        await fetchDocuments();
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

  const PaginationComponent = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          />
        </PaginationItem>
        {[...Array(totalPages)].map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={currentPage === i + 1}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
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

      {isLoading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="mt-2 text-gray-600">Memuat data dokumen...</p>
        </div>
      )}

      {/* Filters */}
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
            fetchDocuments={fetchDocuments}
            API_BASE_URL={API_BASE_URL}
          />
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="hidden md:block overflow-x-auto w-full">
          <Table className="text-left text-sm border-collapse w-full">
            <TableHeader className="bg-gray-50 border-b">
              <TableRow>
                {[
                  "Nomor",
                  "Nama",
                  "Perihal",
                  "Kategori",
                  "Jenis",
                  "Tgl Upload",
                  "Tgl Update",
                  "Aksi",
                ].map((col, i) => (
                  <TableHead
                    key={i}
                    className={`px-4 py-3 font-semibold text-gray-700 ${i < 7 ? "border-r" : ""} whitespace-nowrap ${i === 7 ? "text-center" : ""}`}
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
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    {isLoading ? "Memuat data..." : "Tidak ada dokumen ditemukan."}
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
                    <TableCell className="px-4 py-1 border-r">
                      {document.tanggalUpload}
                    </TableCell>
                    <TableCell className="px-4 py-1 border-r">
                      {document.tanggalUpdate || "-"}
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
        </div>

        {/* Mobile Card */}
        <div className="md:hidden space-y-4 p-4">
          {paginatedDocuments.map((document) => (
            <Card
              key={document.id}
              className="rounded-xl shadow border p-4"
            >
              <div className="space-y-2">
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
              {isLoading ? "Memuat data..." : "Tidak ada dokumen ditemukan."}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <PaginationComponent />
      </div>

      {/* Update Dialog */}
      <UpdateDokumen 
        editingDoc={editingDoc}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setEditingDoc={setEditingDoc}
        kategoriList={kategoriList}
        fetchDocuments={fetchDocuments}
        setError={setError}
        API_BASE_URL={API_BASE_URL}
      />
    </div>
  );
}