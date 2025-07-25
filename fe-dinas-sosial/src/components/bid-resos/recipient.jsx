/* eslint-disable no-unused-vars */
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
  MdEdit,
  MdDelete,
  MdClose,
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import toast from 'react-hot-toast';
import AddRecipient from "./add-recipient";
import UpdateRecipient from "./update-recipient";

export default function Recipient({ selectedJenisAlat }) {
  const kotaListLampung = [
    "Bandar Lampung", "Metro", "Lampung Selatan", "Lampung Utara",
    "Lampung Tengah", "Lampung Timur", "Lampung Barat", "Tanggamus",
    "Way Kanan", "Pesawaran", "Pringsewu", "Mesuji",
    "Tulang Bawang", "Tulang Bawang Barat", "Pesisir Barat"
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKota, setSelectedKota] = useState("__semua__");
  const [selectedYear, setSelectedYear] = useState("__semua__");
  const [editingRecipient, setEditingRecipient] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingRecipient, setDeletingRecipient] = useState(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const [uploadedRecipients, setUploadedRecipients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userRole, setUserRole] = useState(null); // State for user role
  const API_BASE_URL = "http://localhost:9000/api/recipi";

  const handleImageClick = (imageUrl, recipientName) => {
    setSelectedImage({ url: imageUrl, name: recipientName });
    setIsImageModalOpen(true);
  };

  const handleExportData = async () => {
    toast.loading('Mengekspor data penerima bantuan...', { id: 'exportToast' });
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      if (selectedKota !== "__semua__") {
        queryParams.append('kota', selectedKota);
      }
      if (selectedYear !== "__semua__") {
        queryParams.append('year', selectedYear);
      }

      if (selectedJenisAlat) {
        queryParams.append('jenisAlat', selectedJenisAlat);
      }

      const exportUrl = `${API_BASE_URL}/export?${queryParams.toString()}`;

      const response = await fetch(exportUrl, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage = `Gagal mengekspor data: HTTP error! status: ${response.status}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || errorMessage;
        } catch (e) {
          errorMessage = errorText || errorMessage;
        }
        throw new Error(errorMessage);
      }

      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `data_penerima_bantuan_filtered_${new Date().toISOString().split('T')[0]}.csv`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Data penerima bantuan berhasil diekspor!', { id: 'exportToast' });
    } catch (err) {
      console.error('Error exporting data:', err);
      toast.error(`Gagal mengekspor data: ${err.message}`, { id: 'exportToast' });
    }
  };

  const TableSkeleton = () => {
    const skeletonHeaders = [
      "Nama", "Foto", "Alamat", "Kab/Kota", "Usia", "NIK", "No.Telp", "Jenis Alat", "Keterangan", "Tgl Penerimaan"
    ];
    if (userRole === 'rehabilitasi sosial') {
      skeletonHeaders.push("Aksi");
    }

    return (
      <Table className="text-left text-sm border-collapse w-full">
        <TableHeader className="bg-gray-50 border-b">
          <TableRow>
            {skeletonHeaders.map((col, i, arr) => (
              <TableHead
                key={i}
                className={`px-4 py-3 font-semibold text-gray-700 ${i < arr.length - 1 ? "border-r" : ""} whitespace-nowrap ${i === arr.length - 1 && userRole === 'rehabilitasi sosial' ? "text-center" : ""}`}
              >
                {col}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-gray-50 border-b">
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-10 w-10 rounded-full" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-10" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-20" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-28" /></TableCell>
              <TableCell className="px-4 py-3 border-r"><Skeleton className="h-4 w-20" /></TableCell>
              {userRole === 'rehabilitasi sosial' && (
                <TableCell className="px-4 py-3 text-center">
                  <div className="flex gap-2 justify-center">
                    <Skeleton className="h-6 w-6 rounded" />
                    <Skeleton className="h-6 w-6 rounded" />
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  const CardSkeleton = () => (
    <Card className="rounded-xl shadow border p-4">
      <div className="space-y-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
      </div>

      <div className="flex flex-wrap gap-2 mt-3">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>

      <div className="flex justify-between mt-3">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-3 w-20" />
      </div>

      {userRole === 'rehabilitasi sosial' && (
        <div className="flex justify-center items-center gap-4 pt-3 mt-3 border-t">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
      )}
    </Card>
  );

  const fetchUserProfile = async () => {
    try {
      const response = await fetch("http://localhost:9000/api/user/profile", {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        console.error("Gagal mengambil profil pengguna, melanjutkan dengan akses terbatas.");
        return;
      }
      const result = await response.json();
      if (result.success && result.data.role) {
        setUserRole(result.data.role);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      toast.error('Gagal memverifikasi peran pengguna.');
    }
  };

  const fetchRecipients = async () => {
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
        setUploadedRecipients(result.data);
      } else {
        throw new Error(result.message || 'Gagal mengambil data penerima');
      }
    } catch (err) {
      console.error('Error fetching recipients:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat mengambil data penerima';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
    fetchRecipients();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedJenisAlat]);

  const filteredRecipients = uploadedRecipients.filter((recipient) => {
    const searchMatch =
      recipient.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.alamat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.telepon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.jenisAlat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (recipient.keterangan && recipient.keterangan.toLowerCase().includes(searchTerm.toLowerCase()));

    const kotaMatch =
      selectedKota === "__semua__" || recipient.kota === selectedKota;

    const yearMatch =
      selectedYear === "__semua__" ||
      (recipient.tanggalPenerimaan && recipient.tanggalPenerimaan.includes(selectedYear));

    const jenisAlatMatch = !selectedJenisAlat ||
      recipient.jenisAlat.toLowerCase() === selectedJenisAlat.toLowerCase();

    return searchMatch && kotaMatch && yearMatch && jenisAlatMatch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredRecipients.length / itemsPerPage);
  const paginatedRecipients = filteredRecipients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (recipient) => {
    setEditingRecipient(recipient);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (recipient) => {
    setDeletingRecipient(recipient);
  };

  const confirmDelete = async () => {
    if (!deletingRecipient) return;

    setIsSubmitting(true);

    const loadingToast = toast.loading('Menghapus penerima...');

    try {
      const response = await fetch(`${API_BASE_URL}/${deletingRecipient.id}`, {
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
        toast.success(`Data penerima "${deletingRecipient.nama}" berhasil dihapus!`, {
          id: loadingToast,
          duration: 4000,
        });

        await fetchRecipients();
      } else {
        throw new Error(result.message || 'Gagal menghapus penerima');
      }
    } catch (err) {
      console.error('Error deleting recipient:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat menghapus penerima';
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
      setDeletingRecipient(null);
    }
  };

  const getFileId = (url) => {
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const PaginationComponent = () => (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          href="#"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        />
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

  const getUniqueYears = () => {
    const years = new Set();
    uploadedRecipients.forEach(recipient => {
      if (recipient.tanggalPenerimaan) {
        const yearMatch = recipient.tanggalPenerimaan.match(/\d{4}$/);
        if (yearMatch) {
          years.add(yearMatch[0]);
        } else {
          const yearMatchStart = recipient.tanggalPenerimaan.match(/^\d{4}/);
          if (yearMatchStart) {
            years.add(yearMatchStart[0]);
          }
        }
      }
    });
    return Array.from(years).sort((a, b) => parseInt(b) - parseInt(a));
  };

  const uniqueYears = getUniqueYears();

  const ClickableImage = ({ src, alt, recipientName, className }) => (
    <img
      src={src}
      alt={alt}
      className={`${className} cursor-pointer hover:opacity-80 transition-opacity`}
      onClick={() => handleImageClick(src, recipientName)}
      onError={(e) => {
        e.target.src = '/default-profile.png';
      }}
      title="Klik untuk memperbesar gambar"
    />
  );

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredRecipients.length);

  const desktopTableHeaders = [
    "Nama", "Foto", "Alamat", "Kab/Kota", "Usia", "NIK", "No.Telp", "Jenis Alat", "Keterangan", "Tgl Penerimaan"
  ];
  if (userRole === 'rehabilitasi sosial') {
    desktopTableHeaders.push("Aksi");
  }

  return (
    <div data-aos="fade-up" className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Daftar Penerima Bantuan {selectedJenisAlat ? `- ${selectedJenisAlat}` : ''}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 flex-wrap items-stretch mb-1">
        <Input
          placeholder="Cari nama, alamat, NIK, atau jenis alat"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />

        {/* Filters and Buttons adjusted for mobile */}
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={selectedKota} onValueChange={setSelectedKota}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Pilih Kabupaten/Kota" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__semua__">Semua Kabupaten/Kota</SelectItem>
              {kotaListLampung.map((kota) => (
                <SelectItem key={kota} value={kota}>
                  {kota}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Pilih Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__semua__">Semua Tahun</SelectItem>
              {uniqueYears.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex w-full sm:w-auto gap-2">
          <Button
            onClick={handleExportData}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-transform hover:scale-105 flex-1"
          >
            Ekspor Data
          </Button>
          {userRole === 'rehabilitasi sosial' && (
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2 bg-[#1F3A93] hover:bg-[#1A2E7A] text-white transition-transform hover:scale-105 flex-1"
            >
              <MdAdd size={20} /> Tambah Penerima
            </Button>
          )}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="hidden md:block overflow-x-auto w-full">
          {isLoading ? (
            <TableSkeleton />
          ) : (
            <Table className="text-left text-sm border-collapse w-full">
              <TableHeader className="bg-gray-50 border-b">
                <TableRow>
                  {desktopTableHeaders.map((col, i) => (
                    <TableHead
                      key={i}
                      className={`px-4 py-3 font-semibold text-gray-700 ${i < desktopTableHeaders.length - 1 ? "border-r" : ""} whitespace-nowrap ${i === desktopTableHeaders.length - 1 && userRole === 'rehabilitasi sosial' ? "text-center" : ""}`}
                    >
                      {col}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedRecipients.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={desktopTableHeaders.length}
                      className="text-center py-6 text-gray-500"
                    >
                      {selectedJenisAlat
                        ? `Tidak ada penerima ditemukan untuk jenis alat "${selectedJenisAlat}".`
                        : "Tidak ada penerima ditemukan."
                      }
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedRecipients.map((recipient) => (
                    <TableRow key={recipient.id} className="hover:bg-gray-50 border-b">
                      <TableCell className="px-4 py-1 border-r max-w-[150px] break-words whitespace-normal" title={recipient.nama}>
                        {recipient.nama}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r">
                        {recipient.fotoUrl ? (
                          <ClickableImage
                            src={
                              recipient.fotoUrl?.includes("drive.google.com")
                                ? `${API_BASE_URL.replace('/api/recipi', '')}/proxy/image/${getFileId(recipient.fotoUrl)}`
                                : recipient.fotoUrl
                            }
                            alt="Foto Penerima"
                            recipientName={recipient.nama}
                            className="w-10 h-10 object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r max-w-[200px] break-words whitespace-normal" title={recipient.alamat}>
                        {recipient.alamat}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r max-w-[150px] break-words whitespace-normal" title={recipient.kota}>
                        {recipient.kota}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r">
                        {recipient.usia}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r">
                        {recipient.nik}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r">
                        {recipient.telepon}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r max-w-[150px] break-words whitespace-normal" title={recipient.jenisAlat}>
                        {recipient.jenisAlat}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r max-w-[180px] break-words whitespace-normal" title={recipient.keterangan}>
                        {recipient.keterangan || "-"}
                      </TableCell>
                      <TableCell className="px-4 py-1 border-r">
                        {recipient.tanggalPenerimaan || "-"}
                      </TableCell>
                      {userRole === 'rehabilitasi sosial' && (
                        <TableCell className="px-4 py-1 text-center">
                          <div className="flex gap-1 justify-center items-center">
                            <button
                              onClick={() => handleEdit(recipient)}
                              className="text-yellow-600 hover:text-yellow-800 p-1 rounded"
                              title="Edit"
                              disabled={isSubmitting}
                            >
                              <MdEdit size={18} />
                            </button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button
                                  onClick={() => handleDelete(recipient)}
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
                                    Konfirmasi Hapus Penerima
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus penerima "{recipient.nama}"?
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
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Mobile Card */}
        <div className="md:hidden space-y-4 p-4">
          {isLoading ? (
            <CardSkeleton />
          ) : (
            <>
              {paginatedRecipients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {selectedJenisAlat
                    ? `Tidak ada penerima ditemukan untuk jenis alat "${selectedJenisAlat}".`
                    : "Tidak ada penerima ditemukan."
                  }
                </div>
              ) : (
                paginatedRecipients.map((recipient) => (
                  <Card
                    key={recipient.id}
                    className="rounded-xl shadow border p-4"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      {recipient.fotoUrl ? (
                        <ClickableImage
                          src={
                            recipient.fotoUrl?.includes("drive.google.com")
                              ? `${API_BASE_URL.replace('/api/recipi', '')}/proxy/image/${getFileId(recipient.fotoUrl)}`
                              : recipient.fotoUrl
                          }
                          alt="Foto Penerima"
                          recipientName={recipient.nama}
                          className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0 text-gray-500 text-3xl font-bold">
                          -
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-lg">{recipient.nama} ({recipient.usia || '-'}th)</p>
                        <p className="text-gray-600 text-sm">{recipient.nik || '-'}</p>
                      </div>
                    </div>

                    <div className="space-y-1 text-sm text-gray-700">
                      <p><span className="font-medium">Jenis Alat:</span> {recipient.jenisAlat}</p>
                      <p><span className="font-medium">Telp:</span> {recipient.telepon}</p>
                      <p><span className="font-medium">Alamat:</span> {recipient.alamat}, {recipient.kota}</p>
                      <p><span className="font-medium">Keterangan:</span> {recipient.keterangan || "-"}</p>
                      <p><span className="font-medium">Tgl Penerimaan:</span> {recipient.tanggalPenerimaan || "-"}</p>
                    </div>
                    {userRole === 'rehabilitasi sosial' && (
                      <div className="flex justify-center items-center gap-4 pt-3 mt-3 border-t text-sm">
                        <button
                          onClick={() => handleEdit(recipient)}
                          className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800"
                          disabled={isSubmitting}
                        >
                          <MdEdit size={16} /> Edit
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() => handleDelete(recipient)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-800"
                              disabled={isSubmitting}
                            >
                              <MdDelete size={16} /> Hapus
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Konfirmasi Hapus Penerima
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus penerima "{recipient.nama}"?
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
                    )}
                  </Card>
                ))
              )}
            </>
          )}
        </div>
      </div>

      {totalPages > 0 && (
        <div className="mt-4 flex flex-col sm:flex-row items-center sm:justify-center sm:relative">
          <PaginationComponent />
          <div className="w-full text-center text-sm text-muted-foreground mt-3 sm:absolute sm:left-0 sm:w-auto sm:text-left sm:mt-0">
            Menampilkan {startIndex}-{endIndex} dari {filteredRecipients.length} data
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-7xl w-[95vw] max-h-[95vh] p-0">
          <DialogHeader className="px-6 py-4">
            <DialogTitle>
              Foto {selectedImage?.name || 'Penerima'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-6 pt-0">
            {selectedImage && (
              <img
                src={
                  selectedImage.url?.includes("drive.google.com")
                    ? `${API_BASE_URL.replace('/api/recipi', '')}/proxy/image/${getFileId(selectedImage.url)}`
                    : selectedImage.url
                }
                alt={`Foto ${selectedImage.name}`}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-lg"
                onError={(e) => {
                  e.target.src = '/default-profile.png';
                }}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AddRecipient
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        setError={setError}
        fetchRecipients={fetchRecipients}
        API_BASE_URL={API_BASE_URL}
      />

      <UpdateRecipient
        editingRecipient={editingRecipient}
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        setEditingRecipient={setEditingRecipient}
        fetchRecipients={fetchRecipients}
        setError={setError}
        API_BASE_URL={API_BASE_URL}
      />
    </div>
  );
}