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
  MdDownload,
  MdEdit,
  MdDelete,
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

export default function Dokumen() {
  const kategoriList = [
    "Term Of Reference (TOR)", "Petunjuk Operasional Kegiatan (POK)", "Laporan Tahunan",
    "LPPD (Laporan Penyelenggaraan Pemerintahan Daerah)", "LKPJ (Laporan Keterangan Pertanggungjawaban)",
    "RENJA dan RENJA Perubahan", "Perjanjian Kinerja (PK)", "Indikator Kinerja Individu",
    "Indikator Kinerja Utama", "Manajemen Risiko", "Data Statistik BPS dan Walidata",
    "RENSTRA (Rencana Strategis)", "Laporan SPM (Standar Pelayanan Minimal)", "Rencana Aksi dan Evaluasi Rencana Aksi",
    "KUA-PPAS (Kebijakan Umum Anggaran dan Prioritas Plafon Anggaran Sementara)", "RKA (Rencana Kerja dan Anggaran)",
    "DPA (Dokumen Pelaksanaan Anggaran)", "CASCADING", "Pohon Kinerja",
    "SPIP (Sistem Pengendalian Intern Pemerintah)", "LKJ (Laporan Kinerja)", "Evaluasi Renja / SIMONEV",
    "Inovasi Daerah", "Bahan Hearing / Rapat Dengar Pendapat", "Gender Aanalysis Pathway",
    "Gender Budgeting Statement", "Lain-lain",
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("__semua__");
  const [selectedTanggal, setSelectedTanggal] = useState("");
  const [editingDoc, setEditingDoc] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deletingDoc, setDeletingDoc] = useState(null);

  const uploadedDocuments = [
    {
        nomor: "001/TOR/2025",
        nama: "Penyusunan TOR Kegiatan Sosialisasi",
        perihal: "TOR untuk kegiatan sosialisasi program kerja 2025",
        kategori: "Term Of Reference (TOR)",
        jenis: "PDF",
        tanggalUpload: "2025-06-10",
        tanggalUpdate: "2025-06-12",
        url: "#",
    },
    {
        nomor: "002/POK/2025",
        nama: "Petunjuk Operasional Kegiatan Pelatihan",
        perihal: "POK pelatihan peningkatan kapasitas SDM",
        kategori: "Petunjuk Operasional Kegiatan (POK)",
        jenis: "DOCX",
        tanggalUpload: "2025-06-11",
        tanggalUpdate: "2025-06-15",
        url: "#",
    },
    {
        nomor: "003/LAPTAH/2024",
        nama: "Laporan Tahunan 2024",
        perihal: "Ringkasan kinerja tahunan 2024",
        kategori: "Laporan Tahunan",
        jenis: "PDF",
        tanggalUpload: "2025-01-05",
        tanggalUpdate: "2025-01-10",
        url: "#",
    },
    {
        nomor: "004/LKPJ/2024",
        nama: "LKPJ Wali Kota 2024",
        perihal: "Laporan Keterangan Pertanggungjawaban akhir tahun",
        kategori: "LKPJ (Laporan Keterangan Pertanggungjawaban)",
        jenis: "PDF",
        tanggalUpload: "2025-03-20",
        tanggalUpdate: "",
        url: "#",
    },
    {
        nomor: "005/RENJA/2025",
        nama: "Rencana Kerja Tahun 2025",
        perihal: "RENJA Dinas Perencanaan Pembangunan Daerah",
        kategori: "RENJA dan RENJA Perubahan",
        jenis: "PDF",
        tanggalUpload: "2025-05-01",
        tanggalUpdate: "2025-05-03",
        url: "#",
    },
    {
        nomor: "006/SPIP/2025",
        nama: "Sistem Pengendalian Intern Pemerintah 2025",
        perihal: "Dokumen pengendalian intern tahunan",
        kategori: "SPIP (Sistem Pengendalian Intern Pemerintah)",
        jenis: "PDF",
        tanggalUpload: "2025-06-20",
        tanggalUpdate: "",
        url: "#",
    },
    ];

  const filteredDocuments = uploadedDocuments.filter((doc) => {
    const searchMatch =
      doc.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.nomor.toLowerCase().includes(searchTerm.toLowerCase());

    const kategoriMatch =
      selectedKategori === "__semua__" || doc.kategori === selectedKategori;

    const tanggalMatch =
      selectedTanggal === "" || doc.tanggalUpload.slice(0, 7) === selectedTanggal;

    return searchMatch && kategoriMatch && tanggalMatch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const dokumen = {
      nomor: formData.get('nomor'),
      nama: formData.get('nama'),
      perihal: formData.get('perihal'),
      kategori: formData.get('kategori'),
      jenis: formData.get('jenis'),
      file: formData.get('file'),
    };
    
    // Proses simpan dokumen di sini
    console.log('Dokumen baru:', dokumen);
    alert('Dokumen berhasil ditambahkan!');
    
    // Reset form
    e.target.reset();
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedDoc = {
      ...editingDoc,
      nomor: formData.get('nomor'),
      nama: formData.get('nama'),
      perihal: formData.get('perihal'),
      kategori: formData.get('kategori'),
      jenis: formData.get('jenis'),
      file: formData.get('file'),
    };
    
    // Proses update dokumen di sini
    console.log('Dokumen diupdate:', updatedDoc);
    alert('Dokumen berhasil diperbarui!');
    
    // Reset dan tutup dialog
    setEditingDoc(null);
    setIsEditDialogOpen(false);
  };

  const handleDelete = (doc) => {
    setDeletingDoc(doc);
  };

  const confirmDelete = () => {
    // Proses hapus dokumen di sini
    console.log('Dokumen dihapus:', deletingDoc);
    alert(`Dokumen "${deletingDoc.nama}" berhasil dihapus!`);
    
    // Reset state
    setDeletingDoc(null);
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
        Daftar Dokumen Diupload
      </h2>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 flex-wrap items-stretch mb-1">
        <Input
          placeholder="Cari nama atau nomor dokumen"
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
            <DialogContent className="sm:max-w-[500px]">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Tambah Dokumen Baru</DialogTitle>
                  <DialogDescription>
                    Lengkapi form di bawah ini untuk menambahkan dokumen baru.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-3">
                    <Label htmlFor="nomor">Nomor Dokumen</Label>
                    <Input 
                      id="nomor" 
                      name="nomor" 
                      placeholder="Masukkan nomor dokumen"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="nama">Nama Dokumen</Label>
                    <Input 
                      id="nama" 
                      name="nama" 
                      placeholder="Masukkan nama dokumen"
                      required
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="perihal">Perihal</Label>
                    <Input 
                      id="perihal" 
                      name="perihal" 
                      placeholder="Masukkan perihal dokumen"
                    />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="kategori">Kategori</Label>
                    <Select name="kategori" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori dokumen" />
                      </SelectTrigger>
                      <SelectContent>
                        {kategoriList.map((kat) => (
                          <SelectItem key={kat} value={kat}>
                            {kat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="jenis">Jenis File</Label>
                    <Select name="jenis" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih jenis file" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PDF">PDF</SelectItem>
                        <SelectItem value="DOCX">DOCX</SelectItem>
                        <SelectItem value="DOC">DOC</SelectItem>
                        <SelectItem value="XLS">XLS</SelectItem>
                        <SelectItem value="XLSX">XLSX</SelectItem>
                        <SelectItem value="PPT">PPT</SelectItem>
                        <SelectItem value="PPTX">PPTX</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="file">Upload File</Label>
                    <Input 
                      id="file" 
                      name="file" 
                      type="file" 
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
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
                    Simpan Dokumen
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
                {["Nomor", "Nama", "Perihal", "Kategori", "Jenis", "Tgl Upload", "Tgl Update", "Aksi"].map(
                  (col, i) => (
                    <TableHead
                      key={i}
                      className={`px-4 py-3 font-semibold text-gray-700 ${i < 7 ? "border-r" : ""} whitespace-nowrap ${i === 7 ? "text-center" : ""}`}
                    >
                      {col}
                    </TableHead>
                  )
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedDocuments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                    Tidak ada dokumen ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedDocuments.map((doc, idx) => (
                  <TableRow key={idx} className="hover:bg-gray-50 border-b">
                    <TableCell className="px-4 py-1 border-r">{doc.nomor}</TableCell>
                    <TableCell className="px-4 py-1 border-r max-w-[200px] break-words whitespace-normal" title={doc.nama}>{doc.nama}</TableCell>
                    <TableCell className="px-4 py-1 border-r max-w-[200px] break-words whitespace-normal" title={doc.perihal}>{doc.perihal}</TableCell>
                    <TableCell className="px-4 py-1 border-r max-w-[180px] break-words whitespace-normal" title={doc.kategori}>{doc.kategori}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{doc.jenis}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{doc.tanggalUpload}</TableCell>
                    <TableCell className="px-4 py-1 border-r">{doc.tanggalUpdate || "-"}</TableCell>
                    <TableCell className="px-4 py-1 text-center">
                      <div className="grid grid-cols-2 gap-1 justify-center items-center">
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 p-1 rounded" title="Lihat">
                          <MdVisibility size={18} />
                        </a>
                        <a href={doc.url} download className="text-green-600 hover:text-green-800 p-1 rounded" title="Download">
                          <MdDownload size={18} />
                        </a>
                        <button onClick={() => handleEdit(doc)} className="text-yellow-600 hover:text-yellow-800 p-1 rounded" title="Edit">
                          <MdEdit size={18} />
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button 
                              onClick={() => handleDelete(doc)} 
                              className="text-red-600 hover:text-red-800 p-1 rounded" 
                              title="Hapus"
                            >
                              <MdDelete size={18} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Konfirmasi Hapus Dokumen</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus dokumen "{doc.nama}"? 
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
          {paginatedDocuments.map((doc, idx) => (
            <Card key={idx} className="rounded-xl shadow border space-y-0 p-4 mt-2">
              <div>
                <h3 className="font-semibold text-base text-gray-900">{doc.nomor}</h3>
                <p className="text-sm font-medium text-gray-800 truncate">{doc.nama}</p>
                <p className="text-xs text-gray-600">{doc.perihal}</p>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{doc.kategori}</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{doc.jenis}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Upload: {doc.tanggalUpload}</span>
                <span>Update: {doc.tanggalUpdate || "-"}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t text-sm text-gray-700">
                <a href={doc.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-blue-600 hover:text-blue-800">
                  <MdVisibility size={16} /> Lihat
                </a>
                <a href={doc.url} download className="flex items-center gap-1 text-green-600 hover:text-green-800">
                  <MdDownload size={16} /> Unduh
                </a>
                <button onClick={() => handleEdit(doc)} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800">
                  <MdEdit size={16} /> Edit
                </button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button 
                      onClick={() => handleDelete(doc)} 
                      className="flex items-center gap-1 text-red-600 hover:text-red-800"
                    >
                      <MdDelete size={16} /> Hapus
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Hapus Dokumen</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin menghapus dokumen "{doc.nama}"? 
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
            </Card>
          ))}
          {paginatedDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">Tidak ada dokumen ditemukan.</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <PaginationComponent />
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Dokumen</DialogTitle>
              <DialogDescription>
                Ubah informasi dokumen di bawah ini. Klik simpan untuk menyimpan perubahan.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-nomor">Nomor Dokumen</Label>
                <Input 
                  id="edit-nomor" 
                  name="nomor" 
                  placeholder="Masukkan nomor dokumen"
                  defaultValue={editingDoc?.nomor || ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-nama">Nama Dokumen</Label>
                <Input 
                  id="edit-nama" 
                  name="nama" 
                  placeholder="Masukkan nama dokumen"
                  defaultValue={editingDoc?.nama || ""}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-perihal">Perihal</Label>
                <Input 
                  id="edit-perihal" 
                  name="perihal" 
                  placeholder="Masukkan perihal dokumen"
                  defaultValue={editingDoc?.perihal || ""}
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-kategori">Kategori</Label>
                <Select name="kategori" defaultValue={editingDoc?.kategori || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori dokumen" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriList.map((kat) => (
                      <SelectItem key={kat} value={kat}>
                        {kat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-jenis">Jenis File</Label>
                <Select name="jenis" defaultValue={editingDoc?.jenis || ""} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis file" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PDF">PDF</SelectItem>
                    <SelectItem value="DOCX">DOCX</SelectItem>
                    <SelectItem value="DOC">DOC</SelectItem>
                    <SelectItem value="XLS">XLS</SelectItem>
                    <SelectItem value="XLSX">XLSX</SelectItem>
                    <SelectItem value="PPT">PPT</SelectItem>
                    <SelectItem value="PPTX">PPTX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="edit-file">Upload File Baru (Opsional)</Label>
                <Input 
                  id="edit-file" 
                  name="file" 
                  type="file" 
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                />
                <p className="text-xs text-gray-500">Biarkan kosong jika tidak ingin mengganti file</p>
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