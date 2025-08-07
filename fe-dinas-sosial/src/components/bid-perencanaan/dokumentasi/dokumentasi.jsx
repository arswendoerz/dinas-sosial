import {
  MdAdd,
  MdDelete,
  MdClose,
  MdEdit,
  MdDownload,
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
import AddDokumentasi from "./add-dokumentasi";
import UpdateDokumentasi from "./update-dokumentasi";
import { GenericCardSkeleton } from "../../skeleton";

export default function Dokumentasi() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("__semua__");
  const [selectedSort, setSelectedSort] = useState("__terbaru__");
  const [selectedDate, setSelectedDate] = useState("");

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [editingDokumentasi, setEditingDokumentasi] = useState(null);
  const [deletingDokumentasi, setDeletingDokumentasi] = useState(null);

  const [selectedMedia, setSelectedMedia] = useState(null);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const [uploadedDokumentasi, setUploadedDokumentasi] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_BASE_URL = "https://archive-sos-drive.et.r.appspot.com/api/documentation";
 
  const handleMediaClick = (mediaUrl, nama, type) => {
    setSelectedMedia({ url: mediaUrl, name: nama, type: type });
    setIsMediaModalOpen(true);
  };
  
  const fetchDokumentasi = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/`, {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) {
        setUploadedDokumentasi(result.data);
      } else {
        throw new Error(result.message || 'Gagal mengambil data dokumentasi');
      }
    } catch (err) {
      const errorMessage = err.message || 'Terjadi kesalahan saat mengambil data';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDokumentasi();
  }, []);
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedKategori, selectedSort, selectedDate]);

  const parseDate = (dateString) => {
    if (!dateString) return new Date(0);
    const monthsMap = { januari: 0, februari: 1, maret: 2, april: 3, mei: 4, juni: 5, juli: 6, agustus: 7, september: 8, oktober: 9, november: 10, desember: 11 };
    const parts = dateString.toLowerCase().split(' ');
    if (parts.length < 3) return new Date(0);
    const day = parseInt(parts[0], 10);
    const month = monthsMap[parts[1]];
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || month === undefined || isNaN(year)) return new Date(0);
    return new Date(year, month, day);
  };
  
  const filteredAndSortedDokumentasi = uploadedDokumentasi
    .filter((doc) => {
      const searchMatch = doc.nama.toLowerCase().includes(searchTerm.toLowerCase());
      const kategoriMatch = selectedKategori === "__semua__" || doc.kategori.toLowerCase() === selectedKategori;
      
      const dateMatch = (() => {
        if (!selectedDate) return true;
        if (!doc.tanggalKegiatan) return false;
        try {
          const docDateObj = parseDate(doc.tanggalKegiatan);
          if (isNaN(docDateObj.getTime())) return false;
          const docYear = docDateObj.getFullYear();
          const docMonth = (docDateObj.getMonth() + 1).toString().padStart(2, '0');
          const docDateFormatted = `${docYear}-${docMonth}`;
          return docDateFormatted === selectedDate;
        } catch {
          return false;
        }
      })();

      return searchMatch && kategoriMatch && dateMatch;
    })
    .sort((a, b) => {
      switch (selectedSort) {
        case "__terlama__":
          return parseDate(a.tanggalKegiatan) - parseDate(b.tanggalKegiatan);
        case "__a_z__":
          return a.nama.localeCompare(b.nama);
        case "__z_a__":
          return b.nama.localeCompare(a.nama);
        case "__terbaru__":
        default:
          return parseDate(b.tanggalKegiatan) - parseDate(a.tanggalKegiatan);
      }
    });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(filteredAndSortedDokumentasi.length / itemsPerPage);
  const paginatedDokumentasi = filteredAndSortedDokumentasi.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (doc) => {
    setEditingDokumentasi(doc);
    setIsUpdateDialogOpen(true);
  };
  
  const handleDelete = (doc) => {
    setDeletingDokumentasi(doc);
  };

  const confirmDelete = async () => {
    if (!deletingDokumentasi) return;
    setIsSubmitting(true);
    const loadingToast = toast.loading('Menghapus dokumentasi...');
    try {
      const response = await fetch(`${API_BASE_URL}/${deletingDokumentasi.id}`, {
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
        toast.success(`Dokumentasi "${deletingDokumentasi.nama}" berhasil dihapus!`, {
          id: loadingToast,
          duration: 4000,
        });
        await fetchDokumentasi();
      } else {
        throw new Error(result.message || 'Gagal menghapus dokumentasi');
      }
    } catch (err) {
      console.error('Error deleting documentation:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat menghapus dokumentasi';
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 4000,
      });
    } finally {
      setIsSubmitting(false);
      setDeletingDokumentasi(null);
    }
  };
  
  const handleDownload = async (url, filename, category) => {
    const toastId = toast.loading('Mengunduh file...');
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Gagal mengunduh file.');
      
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      
      const fileExtension = filename.split('.').pop().toLowerCase();
      // let downloadFilename = filename;

      if (category === 'video') {
        const validExtensions = ['mp4', 'webm', 'mov', 'avi', 'mkv'];
        a.download = validExtensions.includes(fileExtension) ? filename : `${filename}.mp4`;
      } else {
        const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        a.download = validExtensions.includes(fileExtension) ? filename : `${filename}.jpg`;
      }
      
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
      toast.success('File berhasil diunduh!', { id: toastId });
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengunduh.', { id: toastId });
    }
  };

  const getFileId = (url) => {
    if (!url) return "";
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };

  const getPageNumbers = (totalPages, currentPage) => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        if (startPage > 1) pageNumbers.push(1);
        if (startPage > 2) pageNumbers.push("...");
        for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);
        if (endPage < totalPages - 1) pageNumbers.push("...");
        if (endPage < totalPages) pageNumbers.push(totalPages);
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
  const endIndex = Math.min(currentPage * itemsPerPage, filteredAndSortedDokumentasi.length);

  return (
    <div data-aos="fade-up" className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Dokumentasi Kegiatan Bidang Perencanaan
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 flex-wrap items-stretch mb-4">
        <Input
          placeholder="Cari nama kegiatan"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Select value={selectedKategori} onValueChange={setSelectedKategori}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Pilih Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__semua__">Semua Kategori</SelectItem>
              <SelectItem value="foto">Foto</SelectItem>
              <SelectItem value="video">Video</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__terbaru__">Terbaru</SelectItem>
              <SelectItem value="__terlama__">Terlama</SelectItem>
              <SelectItem value="__a_z__">Nama (A-Z)</SelectItem>
              <SelectItem value="__z_a__">Nama (Z-A)</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            type="month"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full sm:w-[180px]"
          />
        </div>

        <div className="flex w-full sm:w-auto">
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="flex items-center gap-2 bg-[#1F3A93] hover:bg-[#1A2E7A] text-white transition-transform hover:scale-105 flex-1"
            >
              <MdAdd size={20} /> Tambah 
            </Button>
        </div>
      </div>

      <div>
        {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: itemsPerPage }).map((_, index) => (
                    <GenericCardSkeleton key={index} />
                ))}
            </div>
        ) : (
          <>
            {paginatedDokumentasi.length === 0 ? (
              <div className="text-center py-16 text-gray-500 bg-white rounded-lg shadow-md border">
                Tidak ada dokumentasi ditemukan.
              </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {paginatedDokumentasi.map((doc) => {
                        const isVideo = doc.kategori?.toLowerCase() === 'video';
                        const fileId = getFileId(doc.citraUrl);
                        const mediaUrl = doc.citraUrl?.includes("drive.google.com") && fileId
                                    ? `https://archive-sos-drive.et.r.appspot.com/proxy/${isVideo ? 'video' : 'image'}/${fileId}`
                                    : doc.citraUrl;
                        return (
                        <Card
                            key={doc.id}
                            className="rounded-xl shadow-lg border p-0 flex flex-col overflow-hidden transition-all hover:shadow-2xl"
                        >
                            <div className="mt-auto">
                              {isVideo ? (
                                <video
                                    src={mediaUrl}
                                    controls
                                    className="w-full h-45 object-cover cursor-pointer bg-black"
                                    onClick={() => handleMediaClick(mediaUrl, doc.nama, 'video')}
                                    title="Klik untuk memutar video"
                                >
                                  Browser Anda tidak mendukung tag video.
                                </video>
                            ) : (
                                <img
                                    src={mediaUrl}
                                    alt={`Dokumentasi ${doc.nama}`}
                                    className="w-full h-50 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => handleMediaClick(mediaUrl, doc.nama, 'foto')}
                                    onError={(e) => { e.target.src = '/default-profile.png'; }}
                                    title="Klik untuk memperbesar gambar"
                                />
                            )}
                          
                                <div className="pl-4 pr-4 pb-2 pt-2">
                                    <p className="font-semibold text-gray-800 leading-tight line-clamp-2" title={doc.nama}>
                                      {doc.nama}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {doc.tanggalKegiatan}
                                    </p>
                                </div>

                                <div className="flex justify-around items-center p-2 border-t text-sm font-medium">
                                    <button
                                        onClick={() => handleDownload(mediaUrl, doc.nama, doc.kategori?.toLowerCase())}
                                        className="flex items-center gap-1 text-green-600 hover:text-green-800 transition-colors"
                                        title="Unduh File"
                                    >
                                        <MdDownload size={16} /> Unduh
                                    </button>
                                    <button
                                        onClick={() => handleEdit(doc)}
                                        className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800 transition-colors"
                                        title="Edit"
                                        disabled={isSubmitting}
                                    >
                                        <MdEdit size={16} /> Edit
                                    </button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <button
                                                onClick={() => handleDelete(doc)}
                                                className="flex items-center gap-1 text-red-600 hover:text-red-800 transition-colors"
                                                title="Hapus"
                                                disabled={isSubmitting}
                                            >
                                                <MdDelete size={16} /> Hapus
                                            </button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Konfirmasi Hapus Dokumentasi</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                Apakah Anda yakin ingin menghapus "{doc.nama}"? Tindakan ini tidak dapat dibatalkan.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel disabled={isSubmitting}>Batal</AlertDialogCancel>
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
                            </div>
                        </Card>
                       );
                    })}
              </div>
            )}
          </>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-6 flex flex-col sm:flex-row items-center sm:justify-center sm:relative">
          <PaginationComponent />
           <div className="w-full text-center text-sm text-muted-foreground mt-3 sm:absolute sm:left-0 sm:w-auto sm:text-left sm:mt-0">
            Menampilkan {startIndex}-{endIndex} dari {filteredAndSortedDokumentasi.length} data
          </div>
        </div>
      )}

      <Dialog open={isMediaModalOpen} onOpenChange={setIsMediaModalOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[95vh] p-0 flex flex-col">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle>
              {selectedMedia?.name || 'Dokumentasi'}
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center items-center p-4 flex-1 bg-black">
            {selectedMedia && (
                selectedMedia.type === 'video' ? (
                  <video
                    src={selectedMedia.url}
                    controls
                    autoPlay
                    className="max-w-full max-h-[80vh] object-contain"
                  >
                    Browser Anda tidak mendukung tag video.
                  </video>
                ) : (
                  <img
                    src={selectedMedia.url}
                    alt={`Pratinjau ${selectedMedia.name}`}
                    className="max-w-full max-h-[80vh] object-contain rounded-lg"
                    onError={(e) => {
                      e.target.style.display = 'none'; // Sembunyikan jika gambar gagal dimuat
                    }}
                  />
                )
            )}
          </div>
        </DialogContent>
      </Dialog>
      
      <AddDokumentasi
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        setError={setError}
        fetchDokumentasi={fetchDokumentasi}
        API_BASE_URL={API_BASE_URL}
      />

      <UpdateDokumentasi
        isUpdateDialogOpen={isUpdateDialogOpen}
        setIsUpdateDialogOpen={setIsUpdateDialogOpen}
        editingDokumentasi={editingDokumentasi}
        setEditingDokumentasi={setEditingDokumentasi}
        fetchDokumentasi={fetchDokumentasi}
        API_BASE_URL={API_BASE_URL}
      />

    </div>
  );
}