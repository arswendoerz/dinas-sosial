// File: src/components/bid-perencanaan/surat.jsx
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

export default function Surat() {
  const kategoriList = ["Surat Edaran", "Undangan", "Permohonan", "Lain-lain"];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKategori, setSelectedKategori] = useState("__semua__");
  const [selectedTanggal, setSelectedTanggal] = useState("");

  const uploadedDocuments = [
    {
      nomor: "001/SRT/2025",
      nama: "Surat Edaran Jam Kerja",
      jenis: "PDF",
      perihal: "Penyesuaian jam kerja ASN",
      kategori: "Surat Edaran",
      tanggalUpload: "2025-07-01",
      tanggalUpdate: "2025-07-02",
      url: "/files/001-surat-kerja.pdf",
    },
    {
      nomor: "002/SRT/2025",
      nama: "Undangan Rapat Koordinasi",
      jenis: "PDF",
      perihal: "Rapat Koordinasi Program Sosial",
      kategori: "Undangan",
      tanggalUpload: "2025-07-03",
      tanggalUpdate: null,
      url: "/files/002-undangan-rapat.pdf",
    },
    {
      nomor: "003/SRT/2025",
      nama: "Permohonan Data",
      jenis: "PDF",
      perihal: "Permintaan Data Sosial oleh DPRD",
      kategori: "Permohonan",
      tanggalUpload: "2025-07-04",
      tanggalUpdate: null,
      url: "/files/003-permohonan.pdf",
    },
  ];

  const filteredDocuments = uploadedDocuments.filter((doc) => {
    const searchMatch = doc.nama.toLowerCase().includes(searchTerm.toLowerCase()) || doc.nomor.toLowerCase().includes(searchTerm.toLowerCase());
    const kategoriMatch = selectedKategori === "__semua__" || doc.kategori === selectedKategori;
    const tanggalMatch = selectedTanggal === "" || doc.tanggalUpload.slice(0, 7) === selectedTanggal;
    return searchMatch && kategoriMatch && tanggalMatch;
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredDocuments.length / itemsPerPage);
  const paginatedDocuments = filteredDocuments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <h2 className="text-lg sm:text-xl font-bold mb-4">Daftar Surat Diupload</h2>

      <div className="flex flex-col md:flex-row gap-4 flex-wrap items-stretch mb-1">
        <Input
          placeholder="Cari nama atau nomor surat"
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
              <SelectItem key={kat} value={kat}>{kat}</SelectItem>
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
          <Button
            onClick={() => alert("Tambah surat")}
            className="gap-2 text-white transition-transform hover:scale-105"
            style={{ backgroundColor: "#ff7f0e" }}
          >
            <MdAdd size={20} />
            Tambah
          </Button>
        </div>
      </div>

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
                    Tidak ada surat ditemukan.
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
                        <button onClick={() => alert(`Edit: ${doc.nomor}`)} className="text-yellow-600 hover:text-yellow-800 p-1 rounded" title="Edit">
                          <MdEdit size={18} />
                        </button>
                        <button onClick={() => alert(`Delete: ${doc.nomor}`)} className="text-red-600 hover:text-red-800 p-1 rounded" title="Hapus">
                          <MdDelete size={18} />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

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
                <button onClick={() => alert(`Edit: ${doc.nomor}`)} className="flex items-center gap-1 text-yellow-600 hover:text-yellow-800">
                  <MdEdit size={16} /> Edit
                </button>
                <button onClick={() => alert(`Delete: ${doc.nomor}`)} className="flex items-center gap-1 text-red-600 hover:text-red-800">
                  <MdDelete size={16} /> Hapus
                </button>
              </div>
            </Card>
          ))}
          {paginatedDocuments.length === 0 && (
            <div className="text-center py-8 text-gray-500">Tidak ada surat ditemukan.</div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <PaginationComponent />
      </div>
    </div>
  );
}