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

export default function UpdateDokumen({ 
  editingDoc, 
  isEditDialogOpen, 
  setIsEditDialogOpen, 
  setEditingDoc, 
  kategoriList,
  fetchDocuments,
  setError,
  API_BASE_URL
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError && setError(null);

    try {
      const formData = new FormData(e.target);
      const file = formData.get("file");
      
      let requestBody;
      let headers = {};

      if (file && file.size > 0) {
        requestBody = formData;
        formData.append('id', editingDoc.id);
      } else {
        requestBody = JSON.stringify({
          id: editingDoc.id,
          nomor: formData.get("nomor"),
          nama: formData.get("nama"),
          perihal: formData.get("perihal"),
          kategori: formData.get("kategori")
        });
        headers['Content-Type'] = 'application/json';
      }

      const response = await fetch(`${API_BASE_URL}/${editingDoc.id}`, {
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
        toast.success("Dokumen berhasil diperbarui!");
        setEditingDoc(null);
        setIsEditDialogOpen(false);
        
        if (fetchDocuments) {
          await fetchDocuments();
        }
      } else {
        throw new Error(result.message || 'Gagal memperbarui dokumen');
      }
    } catch (err) {
      console.error('Error updating document:', err);
      const errorMessage = err.message || 'Terjadi kesalahan saat memperbarui dokumen';
      if (setError) {
        setError(errorMessage);
      }
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingDoc(null);
    setIsEditDialogOpen(false);
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleEditSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Dokumen</DialogTitle>
            <DialogDescription>
              Ubah informasi dokumen di bawah ini. Klik simpan untuk menyimpan
              perubahan.
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
                required
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
                required
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
              <Label htmlFor="edit-jenis">Jenis Dokumen</Label>
              <Input
                id="edit-jenis"
                name="jenis"
                placeholder="Jenis dokumen (otomatis dari file)"
                defaultValue={editingDoc?.jenis || ""}
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
              />
              <p className="text-xs text-gray-500">
                Format yang didukung: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX
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
                className="bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-105"
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