import { createLazyFileRoute } from '@tanstack/react-router'
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
  MdEdit,
  MdDelete,
  MdPerson,
  MdPhone,
  MdHome,
  MdAssignment,
  MdDateRange,
  MdPhotoCamera
} from "react-icons/md";
import { useState } from "react";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Label } from "@/components/ui/label";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/dashboard/bid-resos')({
  component: RouteComponent,
})

function RouteComponent() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const kategoriBantuan = [
    "Kursi Roda", "Tongkat", "Kruk", "Alat Bantu Dengar", 
    "Prostetik", "Walker", "Kaki Palsu", "Tangan Palsu",
    "Kacamata Khusus", "Alat Bantu Nafas", "Lainnya"
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("__semua__");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [editingData, setEditingData] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingData, setDeletingData] = useState(null);

  const penerimaBantuan = [
    {
      nomor: "RES-001",
      nama: "Budi Santoso",
      nik: "3273010101010001",
      usia: 65,
      telepon: "081234567890",
      alamat: "Duren Payung, Kampung Durian Runtuh",
      dtks: "DTKS",
      kategori: "Kursi Roda",
      tanggal: "2025-01-15",
      foto: "/placeholder-user.jpg"
    },
    {
      nomor: "RES-002",
      nama: "Siti Aminah",
      nik: "3273010202020002",
      usia: 58,
      telepon: "082345678901",
      alamat: "Duren Payung, Kampung Durian Runtuh",
      dtks: "Non-DTKS",
      kategori: "Tongkat",
      tanggal: "2025-02-20",
      foto: "/placeholder-user.jpg"
    },
    {
      nomor: "RES-003",
      nama: "Ahmad Fauzi",
      nik: "3273010303030003",
      usia: 42,
      telepon: "083456789012",
      alamat: "Duren Payung, Kampung Durian Runtuh",
      dtks: "DTKS",
      kategori: "Alat Bantu Dengar",
      tanggal: "2025-03-10",
      foto: "/placeholder-user.jpg"
    },
    {
      nomor: "RES-004",
      nama: "Dewi Lestari",
      nik: "3273010404040004",
      usia: 70,
      telepon: "084567890123",
      alamat: "Duren Payung, Kampung Durian Runtuh",
      dtks: "DTKS",
      kategori: "Walker",
      tanggal: "2025-04-05",
      foto: "/placeholder-user.jpg"
    },
    {
      nomor: "RES-005",
      nama: "Rudi Hermawan",
      nik: "3273010505050005",
      usia: 35,
      telepon: "085678901234",
      alamat: "Duren Payung, Kampung Durian Runtuh",
      dtks: "Non-DTKS",
      kategori: "Prostetik",
      tanggal: "2025-05-12",
      foto: "/placeholder-user.jpg"
    },
    {
      nomor: "RES-006",
      nama: "Linda Sari",
      nik: "3273010606060006",
      usia: 28,
      telepon: "086789012345",
      alamat: "Duren Payung, Kampung Durian Runtuh",
      dtks: "DTKS",
      kategori: "Kruk",
      tanggal: "2025-06-18",
      foto: "/placeholder-user.jpg"
    },
  ];

  const filteredData = penerimaBantuan.filter((item) => {
    const searchMatch =
      item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nik.toLowerCase().includes(searchTerm.toLowerCase());

    const kategoriMatch =
      selectedKategori === "__semua__" || item.kategori === selectedKategori;

    const tanggalMatch =
      selectedTanggal === "" || item.tanggal.slice(0, 7) === selectedTanggal;

    return searchMatch && kategoriMatch && tanggalMatch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newData = {
      nomor: `RES-${String(penerimaBantuan.length + 1).padStart(3, '0')}`,
      nama: formData.get('nama'),
      nik: formData.get('nik'),
      usia: parseInt(formData.get('usia')),
      telepon: formData.get('telepon'),
      alamat: formData.get('alamat'),
      dtks: formData.get('dtks'),
      kategori: formData.get('kategori'),
      tanggal: formData.get('tanggal'),
      foto: URL.createObjectURL(formData.get('foto')) || "/placeholder-user.jpg"
    };
    
    // Proses simpan data di sini
    console.log('Data baru:', newData);
    alert('Data penerima bantuan berhasil ditambahkan!');
    
    // Reset 
    e.target.reset();
  };

  const handleEdit = (data) => {
    setEditingData(data);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      ...editingData,
      nama: formData.get('nama'),
      nik: formData.get('nik'),
      usia: parseInt(formData.get('usia')),
      telepon: formData.get('telepon'),
      alamat: formData.get('alamat'),
      dtks: formData.get('dtks'),
      kategori: formData.get('kategori'),
      tanggal: formData.get('tanggal'),
      foto: formData.get('foto') ? URL.createObjectURL(formData.get('foto')) : editingData.foto
    };
    
    // Proses update data di sini
    console.log('Data diupdate:', updatedData);
    alert('Data penerima bantuan berhasil diperbarui!');
    
    // Reset dan tutup dialog
    setEditingData(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = (data) => {
    setDeletingData(data);
  };

  const confirmDelete = () => {
    // Proses hapus data di sini
    console.log('Data dihapus:', deletingData);
    alert(`Data penerima bantuan "${deletingData.nama}" berhasil dihapus!`);
    
    // Reset state
    setDeletingData(null);
  };

  const PaginationComponent = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} />
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
          <PaginationNext href="#" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <div data-aos="fade-up" className="w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4">
        Daftar Penerima Bantuan
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 flex-wrap items-stretch mb-1">
        <Input
          placeholder="Cari nama, nomor atau NIK"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 min-w-[200px]"
        />

        <Select value={selectedKategori} onValueChange={setSelectedKategori}>
          <SelectTrigger className="w-full md:w-64">
            <SelectValue placeholder="Pilih Kategori Bantuan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__semua__">Semua Kategori</SelectItem>
            {kategoriBantuan.map((kat) => (
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button
                className="gap-2 text-white transition-transform hover:scale-105"
                style={{ backgroundColor: "#1f77b4" }}
              >
                <MdAdd size={20} />
                Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Tambah Penerima Bantuan Baru</DialogTitle>
                  <DialogDescription>
                    Lengkapi form di bawah ini untuk menambahkan data penerima bantuan baru.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-3">
                      <Label htmlFor="nama">Nama Lengkap</Label>
                      <Input 
                        id="nama" 
                        name="nama" 
                        placeholder="Masukkan nama lengkap"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="nik">NIK</Label>
                      <Input 
                        id="nik" 
                        name="nik" 
                        placeholder="Masukkan NIK"
                        required
                        pattern="[0-9]{16}"
                        title="NIK harus 16 digit angka"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="usia">Usia</Label>
                      <Input 
                        id="usia" 
                        name="usia" 
                        type="number"
                        placeholder="Masukkan usia"
                        required
                        min="1"
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="telepon">No. Telepon</Label>
                      <Input 
                        id="telepon" 
                        name="telepon" 
                        placeholder="Masukkan nomor telepon"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="alamat">Alamat Lengkap</Label>
                      <Input 
                        id="alamat" 
                        name="alamat" 
                        placeholder="Masukkan alamat lengkap"
                        required
                      />
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="dtks">Status DTKS</Label>
                      <Select name="dtks" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih status DTKS" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DTKS">DTKS</SelectItem>
                          <SelectItem value="Non-DTKS">Non-DTKS</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="kategori">Kategori Bantuan</Label>
                      <Select name="kategori" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori bantuan" />
                        </SelectTrigger>
                        <SelectContent>
                          {kategoriBantuan.map((kat) => (
                            <SelectItem key={kat} value={kat}>
                              {kat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="tanggal">Tanggal Pemberian</Label>
                      <Input 
                        id="tanggal" 
                        name="tanggal" 
                        type="date"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="foto">Foto Penerima</Label>
                    <Input 
                      id="foto" 
                      name="foto" 
                      type="file" 
                      accept="image/*"
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button 
                      type="button" 
                      className="bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
                    >
                      Batal
                    </Button>
                  </DialogClose>
                  <Button 
                    type="submit"
                    className="text-white transition-transform hover:scale-105"
                    style={{ backgroundColor: "#1f77b4" }}
                  >
                    Simpan Data
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="bg-white rounded-lg shadow-lg border">
        <div className="hidden md:block overflow-x-auto w-full">
          <Table className="text-left text-sm border-collapse w-full">
            <TableHeader className="bg-gray-50 border-b">
              <TableRow>
                {["No", "Nama", "NIK", "Usia", "Telepon", "Alamat", "DTKS", "Kategori Bantuan", "Tanggal", "Foto", "Aksi"].map(
                  (col, i) => (
                    <TableHead
                      key={i}
                      className={`px-4 py-3 font-semibold text-gray-700 ${i < 10 ? "border-r" : ""} whitespace-nowrap ${i === 10 ? "text-center" : ""}`}
                    >
                      {col}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} className="text-center py-6 text-gray-500">
                    Tidak ada data penerima bantuan ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50 border-b">
                    <TableCell className="px-4 py-1 border-r">{item.nomor}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.nama}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.nik}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.usia} tahun</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.telepon}</TableCell>
                    <TableCell className="px-4 py-1 border-r max-w-[200px] break-words whitespace-normal" title={item.alamat}>{item.alamat}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.dtks}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.kategori}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{item.tanggal}</TableCell>
                    <TableCell className="px-4 py-1 border-r">
                      <div className="w-12 h-12 rounded-full overflow-hidden border">
                        <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-1 text-center">
                      <div className="grid grid-cols-2 gap-1 justify-center items-center">
                        <button onClick={() => handleEdit(item)} className="text-yellow-600 hover:text-yellow-800 p-1 rounded" title="Edit">
                          <MdEdit size={18} />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button 
                              onClick={() => handleDelete(item)} 
                              className="text-red-600 hover:text-red-800 p-1 rounded" 
                              title="Hapus"
                            >
                              <MdDelete size={18} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus data penerima bantuan "{item.nama}"? 
                                Tindakan ini tidak dapat dibatalkan.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={confirmDelete}
                                className="bg-red-500 hover:bg-red-600 text-white"
                              >
                                Hapus
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
        <div className="md:hidden space-y-4 px-2 pb-6">
          {paginatedData.map((item, idx) => (
            <Card key={idx} className="rounded-xl shadow border space-y-0 p-4 mt-2">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border">
                  <img src={item.foto} alt={item.nama} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-gray-900">{item.nama}</h3>
                  <p className="text-sm text-gray-600">{item.nomor} • {item.usia} tahun</p>
                  <p className="text-xs text-gray-500 mt-1">{item.nik}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3 text-xs">
                <div className="flex items-center gap-1">
                  <MdPhone size={14} className="text-gray-500" />
                  <span>{item.telepon}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdAssignment size={14} className="text-gray-500" />
                  <span>{item.dtks}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdHome size={14} className="text-gray-500" />
                  <span className="truncate" title={item.alamat}>{item.alamat}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MdDateRange size={14} className="text-gray-500" />
                  <span>{item.tanggal}</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2 border-t text-sm text-gray-700 mt-3">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {item.kategori}
                </span>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(item)} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800">
                    <MdEdit size={16} />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        onClick={() => handleDelete(item)} 
                        className="flex items-center gap-1 text-red-600 hover:text-red-800"
                      >
                        <MdDelete size={16} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Konfirmasi Hapus Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus data penerima bantuan "{item.nama}"? 
                          Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={confirmDelete}
                          className="bg-red-500 hover:bg-red-600 text-white"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </Card>
          ))}
          {paginatedData.length === 0 && (
            <div className="text-center py-8 text-gray-500">Tidak ada data penerima bantuan ditemukan.</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <PaginationComponent />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Data Penerima Bantuan</DialogTitle>
              <DialogDescription>
                Ubah informasi penerima bantuan di bawah ini. Klik simpan untuk menyimpan perubahan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="edit-nama">Nama Lengkap</Label>
                  <Input 
                    id="edit-nama" 
                    name="nama" 
                    placeholder="Masukkan nama lengkap"
                    defaultValue={editingData?.nama || ""}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-nik">NIK</Label>
                  <Input 
                    id="edit-nik" 
                    name="nik" 
                    placeholder="Masukkan NIK"
                    defaultValue={editingData?.nik || ""}
                    required
                    pattern="[0-9]{16}"
                    title="NIK harus 16 digit angka"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-usia">Usia</Label>
                  <Input 
                    id="edit-usia" 
                    name="usia" 
                    type="number"
                    placeholder="Masukkan usia"
                    defaultValue={editingData?.usia || ""}
                    required
                    min="1"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-telepon">No. Telepon</Label>
                  <Input 
                    id="edit-telepon" 
                    name="telepon" 
                    placeholder="Masukkan nomor telepon"
                    defaultValue={editingData?.telepon || ""}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-alamat">Alamat Lengkap</Label>
                  <Input 
                    id="edit-alamat" 
                    name="alamat" 
                    placeholder="Masukkan alamat lengkap"
                    defaultValue={editingData?.alamat || ""}
                    required
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-dtks">Status DTKS</Label>
                  <Select name="dtks" defaultValue={editingData?.dtks || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status DTKS" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DTKS">DTKS</SelectItem>
                      <SelectItem value="Non-DTKS">Non-DTKS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-kategori">Kategori Bantuan</Label>
                  <Select name="kategori" defaultValue={editingData?.kategori || ""} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori bantuan" />
                    </SelectTrigger>
                    <SelectContent>
                      {kategoriBantuan.map((kat) => (
                        <SelectItem key={kat} value={kat}>
                          {kat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="edit-tanggal">Tanggal Pemberian</Label>
                  <Input 
                    id="edit-tanggal" 
                    name="tanggal" 
                    type="date"
                    defaultValue={editingData?.tanggal || ""}
                    required
                  />
                </div>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-foto">Foto Penerima (Opsional)</Label>
                <Input 
                  id="edit-foto" 
                  name="foto" 
                  type="file" 
                  accept="image/*"
                />
                {editingData?.foto && (
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">Foto saat ini:</span>
                    <img src={editingData.foto} alt="Foto saat ini" className="w-8 h-8 rounded-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button 
                  type="button" 
                  className="bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
                >
                  Batal
                </Button>
              </DialogClose>
              <Button 
                type="submit"
                className="text-white transition-transform hover:scale-105"
                style={{ backgroundColor: "#1f77b4" }}
              >
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}