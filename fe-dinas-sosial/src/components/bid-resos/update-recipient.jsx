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
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function UpdateRecipient({ 
  editingRecipient, 
  isEditDialogOpen, 
  setIsEditDialogOpen, 
  setEditingRecipient, 
  fetchRecipients,
  setError,
  API_BASE_URL
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFileId = (url) => {
    if (!url) return "";
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : "";
  };
  
  const kotaListLampung = [
    "Bandar Lampung", "Metro", "Lampung Selatan", "Lampung Utara",
    "Lampung Tengah", "Lampung Timur", "Lampung Barat", "Tanggamus",
    "Way Kanan", "Pesawaran", "Pringsewu", "Mesuji",
    "Tulang Bawang", "Tulang Bawang Barat", "Pesisir Barat"
  ];

  const jenisAlatList = [
    "Kursi roda regular",
    "Kursi roda Cerebral Palsy (CP)",
    "Kruk", 
    "Tripod",
    "Kaki Palsu",
    "Alat bantu dengar",
  ];

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError && setError(null);

    const loadingToast = toast.loading("Sedang memperbarui penerima...");

    try {
      const formData = new FormData(e.target);
      const file = formData.get("file");
      
      let requestBody;
      let headers = {};

      if (file && file.size > 0) {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
          throw new Error("Format file harus JPEG, JPG, atau PNG!");
        }

        if (file.size > 5 * 1024 * 1024) {
          throw new Error("Ukuran file foto tidak boleh lebih dari 5MB!");
        }

        requestBody = new FormData();
        requestBody.append('file', file);
        requestBody.append('id', editingRecipient.id);
        requestBody.append('nama', formData.get("nama"));
        requestBody.append('alamat', formData.get("alamat"));
        requestBody.append('kota', formData.get("kota"));
        requestBody.append('usia', formData.get("usia"));
        requestBody.append('nik', formData.get("nik"));
        requestBody.append('telepon', formData.get("telepon"));
        requestBody.append('jenisAlat', formData.get("jenisAlat"));
        requestBody.append('keterangan', formData.get("keterangan") || '');
        requestBody.append('tanggalPenerimaan', formData.get("tanggalPenerimaan"));
      } else {
        requestBody = JSON.stringify({
          id: editingRecipient.id,
          nama: formData.get("nama"),
          alamat: formData.get("alamat"),
          kota: formData.get("kota"),
          usia: parseInt(formData.get("usia")),
          nik: formData.get("nik"),
          telepon: formData.get("telepon"),
          jenisAlat: formData.get("jenisAlat"),
          keterangan: formData.get("keterangan") || '',
          tanggalPenerimaan: formData.get("tanggalPenerimaan")
        });
        headers['Content-Type'] = 'application/json';
      }

      const nik = formData.get("nik");
      if (nik.length !== 16 || !/^\d+$/.test(nik)) {
        throw new Error("NIK harus terdiri dari 16 digit angka!");
      }

      const telepon = formData.get("telepon");
      if (!/^08\d{8,11}$/.test(telepon)) {
        throw new Error("Nomor telepon harus dimulai dengan 08 dan memiliki 10-13 digit!");
      }

      const usia = parseInt(formData.get("usia"));
      if (usia < 1 || usia > 150) {
        throw new Error("Usia harus antara 1-150 tahun!");
      }

      const response = await fetch(`${API_BASE_URL}/${editingRecipient.id}`, {
        method: 'PUT',
        credentials: 'include',
        headers: headers,
        body: requestBody
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorResult = await response.json();
            errorMessage = errorResult.message || errorMessage;
          } catch (e) {
            console.error('Failed to parse error JSON:', e);
          }
        } else {
          const errorText = await response.text();
          console.error('Server error response:', errorText);
          
          if (response.status === 404) {
            errorMessage = 'Penerima tidak ditemukan atau endpoint tidak tersedia';
          } else if (response.status === 500) {
            errorMessage = 'Terjadi kesalahan di server. Periksa log server backend';
          }
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      
      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success(`Penerima "${formData.get('nama')}" berhasil diperbarui!`);
        
        setEditingRecipient(null);
        setIsEditDialogOpen(false);
        
        if (fetchRecipients) {
          await fetchRecipients();
        }
      } else {
        throw new Error(result.message || 'Gagal memperbarui penerima');
      }
    } catch (err) {
      console.error('Error updating recipient:', err);
      
      toast.dismiss(loadingToast);
      const errorMessage = err.message || 'Terjadi kesalahan saat memperbarui penerima';
      
      if (setError) {
        setError(errorMessage);
      }
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-right',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setEditingRecipient(null);
    setIsEditDialogOpen(false);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    if (dateString.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch {
      return '';
    }
  };

  return (
    <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleEditSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Penerima Bantuan</DialogTitle>
            <DialogDescription>
              Ubah informasi penerima bantuan di bawah ini. Klik simpan untuk menyimpan perubahan.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Nama */}
            <div className="grid gap-3">
              <Label htmlFor="edit-nama">Nama Lengkap *</Label>
              <Input
                id="edit-nama"
                name="nama"
                placeholder="Masukkan nama lengkap penerima"
                defaultValue={editingRecipient?.nama || ""}
                required
                maxLength={100}
              />
            </div>

            {/* Foto */}
            <div className="grid gap-3">
              <Label htmlFor="edit-file">Upload Foto Baru (Opsional)</Label>
              <Input
                id="edit-file"
                name="file"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
              />
              <p className="text-xs text-gray-500">
                Format yang didukung: JPEG, JPG, PNG (Maksimal 5MB)
              </p>
              <p className="text-xs text-gray-400">
                Kosongkan jika tidak ingin mengubah foto
              </p>
              {editingRecipient?.fotoUrl && (
                <div className="flex items-center gap-2">
                  <img
                    src={
                      editingRecipient.fotoUrl?.includes("drive.google.com")
                        ? `${API_BASE_URL.replace('/api/recipi', '')}/proxy/image/${getFileId(editingRecipient.fotoUrl)}`
                        : editingRecipient.fotoUrl
                    }
                    alt="Foto saat ini"
                    className="w-12 h-12 object-cover rounded-lg"
                    onError={(e) => {
                      e.target.src = '/default-profile.png';
                    }}
                  />
                  <span className="text-xs text-gray-600">Foto saat ini</span>
                </div>
              )}
            </div>

            {/* Alamat */}
            <div className="grid gap-3">
              <Label htmlFor="edit-alamat">Alamat Lengkap *</Label>
              <Textarea
                id="edit-alamat"
                name="alamat"
                placeholder="Masukkan alamat lengkap penerima"
                defaultValue={editingRecipient?.alamat || ""}
                required
                maxLength={255}
                rows={3}
              />
            </div>

            {/* Kota */}
            <div className="grid gap-3">
              <Label htmlFor="edit-kota">Kabupaten/Kota *</Label>
              <Select name="kota" defaultValue={editingRecipient?.kota || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kabupaten/kota" />
                </SelectTrigger>
                <SelectContent>
                  {kotaListLampung.map((kota) => (
                    <SelectItem key={kota} value={kota}>
                      {kota}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Usia dan NIK dalam satu baris */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-3">
                <Label htmlFor="edit-usia">Usia (tahun) *</Label>
                <Input
                  id="edit-usia"
                  name="usia"
                  type="number"
                  placeholder="Contoh: 25"
                  defaultValue={editingRecipient?.usia || ""}
                  required
                  min="1"
                  max="150"
                />
              </div>
              
              <div className="grid gap-3">
                <Label htmlFor="edit-nik">NIK *</Label>
                <Input
                  id="edit-nik"
                  name="nik"
                  placeholder="16 digit NIK"
                  defaultValue={editingRecipient?.nik || ""}
                  required
                  maxLength={16}
                  pattern="[0-9]{16}"
                  title="NIK harus terdiri dari 16 digit angka"
                />
              </div>
            </div>

            {/* Telepon */}
            <div className="grid gap-3">
              <Label htmlFor="edit-telepon">Nomor Telepon *</Label>
              <Input
                id="edit-telepon"
                name="telepon"
                placeholder="Contoh: 08123456789"
                defaultValue={editingRecipient?.telepon || ""}
                required
                pattern="^08[0-9]{8,11}$"
                title="Nomor telepon harus dimulai dengan 08 dan memiliki 10-13 digit"
              />
            </div>

            {/* Jenis Alat */}
            <div className="grid gap-3">
              <Label htmlFor="edit-jenisAlat">Jenis Alat Bantuan *</Label>
              <Select name="jenisAlat" defaultValue={editingRecipient?.jenisAlat || ""} required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis alat bantuan" />
                </SelectTrigger>
                <SelectContent>
                  {jenisAlatList.map((alat) => (
                    <SelectItem key={alat} value={alat}>
                      {alat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Keterangan */}
            <div className="grid gap-3">
              <Label htmlFor="edit-keterangan">Keterangan</Label>
              <Select name="keterangan" defaultValue={editingRecipient?.keterangan || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih keterangan (opsional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DTKS">DTKS</SelectItem>
                  <SelectItem value="Non - DTKS">Non - DTKS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tanggal Penerimaan */}
            <div className="grid gap-3">
              <Label htmlFor="edit-tanggalPenerimaan">Tanggal Penerimaan *</Label>
              <Input
                id="edit-tanggalPenerimaan"
                name="tanggalPenerimaan"
                type="date"
                defaultValue={formatDateForInput(editingRecipient?.tanggalPenerimaan)}
                required
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white border-red-500 hover:border-red-600 transition-all hover:scale-105"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#1F3A93] hover:bg-[#1A2E7A] text-white transition-transform hover:scale-105"
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