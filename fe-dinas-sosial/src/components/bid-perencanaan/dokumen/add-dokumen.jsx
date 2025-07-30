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

export default function AddDokumen({ 
  kategoriList, 
  isSubmitting, 
  setIsSubmitting, 
  setError, 
  fetchDocuments, 
  API_BASE_URL 
}) {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const loadingToast = toast.loading("Sedang mengunggah dokumen...");

    try {
      const formData = new FormData(e.target);
      const file = formData.get("file");
      if (!file || file.size === 0) {
        throw new Error("File dokumen wajib diunggah!");
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
        toast.dismiss(loadingToast);
        toast.success("Dokumen berhasil ditambahkan!");
 
        e.target.reset();
        await fetchDocuments();

        setModalOpen(false);
      } else {
        throw new Error(result.message || 'Gagal menambahkan dokumen');
      }
    } catch (err) {
      console.error('Error creating document:', err);
      
      toast.dismiss(loadingToast);
      toast.error(err.message || 'Terjadi kesalahan saat menambahkan dokumen', {
        duration: 5000,
        position: 'top-right',
      });
      
      setError(err.message || 'Terjadi kesalahan saat menambahkan dokumen');
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
          onClick={() => setModalOpen(true)}
        >
          <MdAdd size={20} />
          {isSubmitting ? "Mengunggah..." : "Tambah"}
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
                required
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
                required
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
              <Label htmlFor="file">Upload File</Label>
              <Input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                required
              />
              <p className="text-xs text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
                disabled={isSubmitting}
                onClick={() => setModalOpen(false)}
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
              {isSubmitting ? "Mengunggah..." : "Simpan Dokumen"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}