import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";

export default function UpdateDokumentasi({
  isUpdateDialogOpen,
  setIsUpdateDialogOpen,
  editingDokumentasi,
  setEditingDokumentasi,
  fetchDokumentasi,
  API_BASE_URL,
}) {
  const [nama, setNama] = useState("");
  const [tanggalKegiatan, setTanggalKegiatan] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Efek ini akan berjalan setiap kali `editingDokumentasi` berubah.
  // Ini digunakan untuk mengisi form dengan data yang sudah ada saat dialog dibuka.
  useEffect(() => {
    if (editingDokumentasi) {
      setNama(editingDokumentasi.nama || "");
      // Format tanggal ke YYYY-MM-DD yang diterima oleh input type="date"
      if (editingDokumentasi.tanggalKegiatan) {
        const date = new Date(editingDokumentasi.tanggalKegiatan);
        // Menangani timezone agar tanggal tidak bergeser
        const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000 ))
                              .toISOString()
                              .split("T")[0];
        setTanggalKegiatan(formattedDate);
      } else {
        setTanggalKegiatan("");
      }
    }
  }, [editingDokumentasi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!editingDokumentasi) return;

    setIsSubmitting(true);
    const loadingToast = toast.loading("Sedang memperbarui dokumentasi...");

    try {
      const payload = {
        nama,
        tanggalKegiatan,
      };

      const response = await fetch(`${API_BASE_URL}/${editingDokumentasi.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Dokumentasi berhasil diperbarui!", {
          id: loadingToast,
        });
        await fetchDokumentasi(); // Muat ulang data di halaman utama
        setIsUpdateDialogOpen(false); // Tutup dialog
      } else {
        throw new Error(result.message || "Gagal memperbarui dokumentasi");
      }
    } catch (err) {
      console.error("Error updating documentation:", err);
      toast.error(err.message || "Terjadi kesalahan saat memperbarui data.", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Fungsi untuk membersihkan state ketika dialog ditutup
  const handleCloseDialog = (isOpen) => {
    setIsUpdateDialogOpen(isOpen);
    if (!isOpen) {
      setEditingDokumentasi(null);
    }
  };

  return (
    <Dialog open={isUpdateDialogOpen} onOpenChange={handleCloseDialog}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Dokumentasi</DialogTitle>
            <DialogDescription>
              Ubah nama atau tanggal kegiatan. Perubahan akan tersimpan setelah
              Anda menekan tombol "Simpan Perubahan".
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="nama-update">Nama Kegiatan *</Label>
              <Input
                id="nama-update"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Masukkan nama kegiatan"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="tanggalKegiatan-update">Tanggal Kegiatan *</Label>
              <Input
                id="tanggalKegiatan-update"
                type="date"
                value={tanggalKegiatan}
                onChange={(e) => setTanggalKegiatan(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 transition-all hover:scale-105"
                  disabled={isSubmitting}
                >
                  Batal
                </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#1F3A93] hover:bg-[#1A2E7A] text-white transition-transform hover:scale-105"
              disabled={isSubmitting || !nama || !tanggalKegiatan}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}