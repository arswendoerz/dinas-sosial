import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Skeleton generik untuk tampilan tabel.
 * @param {object} props
 * @param {string[]} props.headers - Array dari string untuk header kolom.
 * @param {number} [props.rowCount=5] - Jumlah baris skeleton yang akan ditampilkan.
 * @param {React.ReactNode} [props.actionSkeleton] - Komponen skeleton kustom untuk kolom aksi.
 */
export const GenericTableSkeleton = ({ headers, rowCount = 5, actionSkeleton = null }) => {
  return (
    <Table className="text-left text-sm border-collapse w-full">
      <TableHeader className="bg-gray-50 border-b">
        <TableRow>
          {headers.map((col, i) => (
            <TableHead
              key={i}
              className={`px-4 py-3 font-semibold text-gray-700 ${i < headers.length - 1 ? "border-r" : ""} whitespace-nowrap`}
            >
              {col}
            </TableHead>
          ))}
          {actionSkeleton && (
            <TableHead className="px-4 py-3 font-semibold text-gray-700 text-center whitespace-nowrap">Aksi</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <TableRow key={rowIndex} className="hover:bg-gray-50 border-b">
            {headers.map((_, colIndex) => (
              <TableCell key={colIndex} className="px-4 py-3 border-r">
                <Skeleton className="h-4 w-full" />
              </TableCell>
            ))}
            {actionSkeleton && (
              <TableCell className="px-4 py-3 text-center">
                {actionSkeleton}
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

/**
 * Skeleton generik untuk tampilan kartu.
 * @param {object} props
 * @param {boolean} [props.hasTags=true] - Apakah akan menampilkan placeholder untuk tag.
 * @param {React.ReactNode} [props.actionSkeleton] - Komponen skeleton kustom untuk area aksi.
 */
export const GenericCardSkeleton = ({ hasTags = true, actionSkeleton = null }) => (
  <Card className="rounded-xl shadow border p-4">
    <div className="space-y-2">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-full" />
    </div>
    {hasTags && (
      <div className="flex flex-wrap gap-2 mt-3">
        <Skeleton className="h-6 w-20 rounded" />
        <Skeleton className="h-6 w-16 rounded" />
      </div>
    )}
    <div className="flex justify-between mt-3">
      <Skeleton className="h-3 w-20" />
      <Skeleton className="h-3 w-20" />
    </div>
    {actionSkeleton && (
      <div className="flex justify-center items-center gap-4 pt-3 mt-3 border-t">
        {actionSkeleton}
      </div>
    )}
  </Card>
);