import DataGrid from './DataGrid.jsx';


const columns = [
  { header: 'Mã NV', accessorKey: 'id', sortable: true },
  { header: 'Họ tên', accessorKey: 'name', sortable: true },
  { header: 'Phòng ban', accessorKey: 'department', sortable: true },
  { header: 'Email', accessorKey: 'email',sortable: true },
];

const data = [
  { id: 1, name: 'Nguyễn Văn An', department: 'Kỹ thuật', email: 'an.nguyen@example.com' },
  { id: 2, name: 'Trần Thị Bình', department: 'Nhân sự', email: 'binh.tran@example.com' },
  { id: 3, name: 'Lê Minh Châu', department: 'Kế toán', email: 'chau.le@example.com' },
  { id: 4, name: 'Phạm Quốc Dũng', department: 'Kinh doanh', email: 'dung.pham@example.com' },
  { id: 5, name: 'Hoàng Thu Hà', department: 'Kỹ thuật', email: 'ha.hoang@example.com' },
];

export default function App() {
  return (
    <main>
      <h1>Danh sách nhân viên</h1>
      <DataGrid
        data={data}
        columns={columns}
        ariaLabel="Danh sách nhân viên"
        getRowId={(row) => row.id}
      />
    </main>
  );
}