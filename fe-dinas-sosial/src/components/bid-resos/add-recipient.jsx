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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function AddRecipient({
  isAddDialogOpen,
  setIsAddDialogOpen,
  isSubmitting,
  setIsSubmitting, 
  setError,
  fetchRecipients,
  API_BASE_URL
}) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setError(null);

    const loadingToast = toast.loading("Sedang menambahkan penerima...");

    try {
      const formData = new FormData(e.target);

      const foto = formData.get("foto");

      if (foto && foto.size > 0) {
        if (foto.size > 2 * 1024 * 1024) {
          throw new Error("Ukuran file foto tidak boleh lebih dari 2MB!");
        }

        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
        if (!allowedTypes.includes(foto.type)) {
          throw new Error("Format file harus JPEG, JPG, atau PNG!");
        }
      }

      const newFormData = new FormData();
      if (foto && foto.size > 0) {
        newFormData.append('file', foto);
      }
      
      newFormData.append('nama', formData.get('nama'));
      newFormData.append('alamat', formData.get('alamat'));
      newFormData.append('kota', formData.get('kota'));
      newFormData.append('usia', formData.get('usia'));
      newFormData.append('nik', formData.get('nik'));
      newFormData.append('telepon', formData.get('telepon'));
      newFormData.append('jenisAlat', formData.get('jenisAlat'));
      newFormData.append('keterangan', formData.get('keterangan') || '');

      newFormData.append('tanggalPenerimaan', formData.get('tanggalPenerimaan'));

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

      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        credentials: 'include',
        body: newFormData,
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
            errorMessage = 'Endpoint tidak ditemukan. Pastikan server backend berjalan di port 9000';
          } else if (response.status === 500) {
            errorMessage = 'Terjadi kesalahan di server. Periksa log server backend';
          }
        }

        throw new Error(errorMessage);
      }

      const result = await response.json();

      if (result.success) {
        toast.dismiss(loadingToast);
        toast.success("Data penerima berhasil ditambahkan!");

        e.target.reset();
        await fetchRecipients();
        setIsAddDialogOpen(false);
      } else {
        throw new Error(result.message || 'Gagal menambahkan penerima');
      }
    } catch (err) {
      console.error('Error creating recipient:', err);

      toast.dismiss(loadingToast);
      toast.error(err.message || 'Terjadi kesalahan saat menambahkan penerima', {
        duration: 5000,
        position: 'top-right',
      });

      setError(err.message || 'Terjadi kesalahan saat menambahkan penerima');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Tambah Penerima Bantuan</DialogTitle>
            <DialogDescription>
              Lengkapi form di bawah ini untuk menambahkan penerima bantuan baru.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {/* Nama */}
            <div className="grid gap-3">
              <Label htmlFor="nama">Nama Lengkap *</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Masukkan nama lengkap penerima"
                required
                maxLength={100}
              />
            </div>

            {/* Foto */}
            <div className="grid gap-3">
              <Label htmlFor="foto">Foto Penerima</Label> 
              <Input
                id="foto"
                name="foto"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
              />
              <p className="text-xs text-gray-500">
                Format yang didukung: JPEG, JPG, PNG (Maksimal 2MB)
              </p>
            </div>

            {/* Alamat */}
            <div className="grid gap-3">
              <Label htmlFor="alamat">Alamat Lengkap *</Label>
              <Textarea
                id="alamat"
                name="alamat"
                placeholder="Masukkan alamat lengkap penerima"
                required
                maxLength={255}
                rows={3}
              />
            </div>

            {/* Kota */}
            <div className="grid gap-3">
              <Label htmlFor="kota">Kabupaten/Kota *</Label>
              <Select name="kota" required>
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
                <Label htmlFor="usia">Usia (tahun) *</Label>
                <Input
                  id="usia"
                  name="usia"
                  type="number"
                  placeholder="Contoh: 25"
                  required
                  min="1"
                  max="150"
                />
              </div>

              <div className="grid gap-3">
                <Label htmlFor="nik">NIK *</Label>
                <Input
                  id="nik"
                  name="nik"
                  placeholder="16 digit NIK"
                  required
                  maxLength={16}
                  pattern="[0-9]{16}"
                  title="NIK harus terdiri dari 16 digit angka"
                />
              </div>
            </div>

            {/* Telepon */}
            <div className="grid gap-3">
              <Label htmlFor="telepon">Nomor Telepon *</Label>
              <Input
                id="telepon"
                name="telepon"
                placeholder="Contoh: 08123456789"
                required
                pattern="^08[0-9]{8,11}$"
                title="Nomor telepon harus dimulai dengan 08 dan memiliki 10-13 digit"
              />
            </div>

            {/* Jenis Alat dan Keterangan dalam satu baris */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Jenis Alat */}
              <div className="grid gap-3">
                <Label htmlFor="jenisAlat">Jenis Alat Bantuan *</Label>
                <Select name="jenisAlat" required>
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
                <Label htmlFor="keterangan">Keterangan</Label> {/* Removed '*' to indicate optional */}
                <Select name="keterangan"> {/* removed 'required' attribute */}
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih keterangan (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DTKS">DTKS</SelectItem>
                    <SelectItem value="Non - DTKS">Non - DTKS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tanggal Penerimaan */}
            <div className="grid gap-3">
              <Label htmlFor="tanggalPenerimaan">Tanggal Penerimaan *</Label>
              <Input
                id="tanggalPenerimaan"
                name="tanggalPenerimaan"
                type="date"
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
              >
                Batal
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-[#1F3A93] hover:bg-[#1A2E7A] text-white transition-transform hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Simpan Penerima"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}