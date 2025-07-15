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

export default function UpdateSurat({ 
  editingLetter, 
  isEditDialogOpen, 
  setIsEditDialogOpen, 
  setEditingLetter, 
  kategoriList,
  fetchLetters,
  setError,
  API_BASE_URL
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError && setError(null);

    const loadingToast = toast.loading("Memperbarui surat...");

    try {
      const formData = new FormData(e.target);
      const file = formData.get("file");
      
      let requestBody;
      let headers = {};

      if (file && file.size > 0) {
        requestBody = formData;
        formData.append('id', editingLetter.id);

        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Ukuran file tidak boleh lebih dari 10MB!");
        }
      } else {
        requestBody = JSON.stringify({
          id: editingLetter.id,
          nomor: formData.get("nomor"),
          nama: formData.get("nama"),
          perihal: formData.get("perihal"),
          kategori: formData.get("kategori")
        });
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/${editingLetter.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: headers,
        body: requestBody
      });

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;
        
        try {
          const errorResult = JSON.parse(errorText);
          errorMessage = errorResult.message || `HTTP error! status: ${response.status}`;
        } catch {
          errorMessage = `HTTP error! status: ${response.status} - ${errorText}`;
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.success("Surat berhasil diperbarui!", {
          id: loadingToast,
          duration: 4000,
        });
        
        setEditingLetter(null);
        setIsEditDialogOpen(false);
        
        if (fetchLetters) {
          await fetchLetters();
        }
      } else {
        throw new Error(result.message || 'Gagal memperbarui surat');
      }
    } catch (err) {
      console.error('Error updating letter:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat memperbarui surat';
      
      if (setError) {
        setError(errorMessage);
      }
      
      toast.error(errorMessage, {
        id: loadingToast,
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingLetter(null);
    setIsEditDialogOpen(false);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleEditSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Surat</DialogTitle>
            <DialogDescription>
              Ubah informasi surat di bawah ini. Klik simpan untuk menyimpan
              perubahan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-3">
              <Label htmlFor="edit-nomor">Nomor Surat</Label>
              <Input
                id="edit-nomor"
                name="nomor"
                placeholder="Masukkan nomor surat"
                defaultValue={editingLetter?.nomor || ""}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-nama">Nama Surat</Label>
              <Input
                id="edit-nama"
                name="nama"
                placeholder="Masukkan nama surat"
                defaultValue={editingLetter?.nama || ""}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-perihal">Perihal</Label>
              <Input
                id="edit-perihal"
                name="perihal"
                placeholder="Masukkan perihal surat"
                defaultValue={editingLetter?.perihal || ""}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-kategori">Kategori</Label>
              <Select 
                name="kategori" 
                defaultValue={editingLetter?.kategori || ""} 
                required 
                disabled={isSubmitting}
              >
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
              <Label htmlFor="edit-jenis">Jenis File</Label>
              <Input
                id="edit-jenis"
                name="jenis"
                placeholder="Jenis file (otomatis dari file)"
                defaultValue={editingLetter?.jenis || ""}
                disabled
                className="bg-gray-100"
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="edit-file">Upload File Baru (Opsional)</Label>
              <Input
                id="edit-file"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX (Maksimal 10MB)
              </p>
              <p className="text-xs text-gray-400">
                Kosongkan jika tidak ingin mengubah file
              </p>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="text-white transition-transform hover:scale-105"
              style={{ backgroundColor: "#1f77b4" }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Memperbarui..." : "Simpan Perubahan"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}