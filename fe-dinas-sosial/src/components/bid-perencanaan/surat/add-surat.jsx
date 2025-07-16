import { MdAdd } from "react-icons/md";
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
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useState } from "react";

export default function AddSurat({ 
  kategoriList, 
  isSubmitting, 
  setIsSubmitting, 
  setError, 
  fetchLetters, 
  API_BASE_URL 
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const loadingToast = toast.loading("Sedang mengunggah surat...");

    try {
      const formData = new FormData(e.target);
      const file = formData.get("file");
      
      if (!file || file.size === 0) {
        throw new Error("File surat wajib diunggah!");
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("Ukuran file tidak boleh lebih dari 10MB!");
      }

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Surat berhasil ditambahkan!", {
          id: loadingToast,
          duration: 4000,
        });

        e.target.reset();
        await fetchLetters();
        setModalOpen(false);
      } else {
        throw new Error(result.message || 'Gagal menambahkan surat');
      }
    } catch (err) {
      console.error('Error creating surat:', err);
      
      const errorMessage = err.message || 'Terjadi kesalahan saat menambahkan surat';
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000,
      });
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button
          className="gap-2 text-white transition-transform hover:scale-105"
          style={{ backgroundColor: "#1F3A93" }}
          disabled={isSubmitting}
        >
          <MdAdd size={20} />
          {isSubmitting ? "Mengunggah..." : "Tambah"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Surat Baru</DialogTitle>
            <DialogDescription>
              Lengkapi form di bawah ini untuk menambahkan surat baru.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="nomor">Nomor Surat</Label>
              <Input
                id="nomor"
                name="nomor"
                placeholder="Masukkan nomor surat"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="nama">Nama Surat</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama surat"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="perihal">Perihal</Label>
              <Input
                id="perihal"
                name="perihal"
                placeholder="Masukkan perihal surat"
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="kategori">Kategori</Label>
              <Select name="kategori" required disabled={isSubmitting}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori surat" />
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
              <Label htmlFor="file">Upload File Surat</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Maksimal 10MB)
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="text-white transition-transform hover:scale-105"
              style={{ backgroundColor: "#1F3A93" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Mengunggah..." : "Simpan Surat"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}