import { useState } from "react";
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

export default function AddDokumentasi({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isSubmitting,
  setIsSubmitting,
  setError,
  fetchDokumentasi,
  API_BASE_URL,
}) {
  const [kategori, setKategori] = useState("");
  const [fileError, setFileError] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFileError(null); // Reset error setiap kali file berubah

    if (file) {
      const fileType = file.type;
      const fileSize = file.size;

      // Validasi Tipe dan Kategori
      if (fileType.startsWith("image/")) {
        setKategori("Foto");
        // Validasi Ukuran untuk Gambar (maks 2MB)
        if (fileSize > 2 * 1024 * 1024) {
          setFileError("Ukuran file gambar tidak boleh lebih dari 2MB!");
        }
      } else if (fileType.startsWith("video/")) {
        setKategori("Video");
        // Validasi Ukuran untuk Video (maks 100MB)
        if (fileSize > 100 * 1024 * 1024) {
          setFileError("Ukuran file video tidak boleh lebih dari 100MB!");
        }
      } else {
        setKategori("");
        setFileError("Format file tidak didukung. Harap unggah gambar atau video.");
      }
    } else {
      setKategori("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (fileError) {
      toast.error(fileError);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const loadingToast = toast.loading("Sedang mengunggah dokumentasi...");

    try {
      const formData = new FormData(e.target);
      const file = formData.get("file");

      if (!file || file.size === 0) {
        throw new Error("File dokumentasi wajib diisi!");
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json().catch(() => ({ message: `HTTP error! status: ${response.status}` }));
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        toast.success("Dokumentasi berhasil ditambahkan!", {
            id: loadingToast,
        });

        e.target.reset();
        setKategori("");
        await fetchDokumentasi();
        setIsAddDialogOpen(false);
      } else {
        throw new Error(result.message || "Gagal mengunggah dokumentasi");
      }
    } catch (err) {
      console.error("Error creating documentation:", err);
      toast.error(err.message || "Terjadi kesalahan saat menambahkan dokumentasi", {
          id: loadingToast,
      });
      setError(err.message || "Terjadi kesalahan saat menambahkan dokumentasi");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => {
        setIsAddDialogOpen(isOpen);
        if (!isOpen) {
            setFileError(null);
            setKategori("");
        }
    }}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Dokumentasi</DialogTitle>
            <DialogDescription>
              Lengkapi form di bawah ini untuk menambahkan dokumentasi baru.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="nama">Nama Kegiatan *</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama kegiatan"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="tanggalKegiatan">Tanggal Kegiatan *</Label>
              <Input
                id="tanggalKegiatan"
                name="tanggalKegiatan"
                type="date"
                required
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="file">File Dokumentasi *</Label>
              <Input
                id="file"
                name="file"
                type="file"
                required
                onChange={handleFileChange}
                accept="image/jpeg,image/jpg,image/png,video/mp4"
              />
              {fileError && <p className="text-sm text-red-500">{fileError}</p>}
              <p className="text-xs text-gray-500">
                Format: JPG, PNG (Maks 2MB) atau MP4 (Maks 100MB).
              </p>
            </div>
            
            <div className="grid gap-3">
              <Label htmlFor="kategori">Kategori</Label>
              <Input
                id="kategori"
                name="kategori"
                value={kategori}
                readOnly
                placeholder="Otomatis terisi (Foto/Video)"
                className="bg-gray-100"
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
              disabled={isSubmitting || !!fileError}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Dokumentasi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}