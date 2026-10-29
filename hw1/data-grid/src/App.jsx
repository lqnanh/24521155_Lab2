import DataGrid from './DataGrid.jsx';


const columns = [
  { header: 'Mã NV', accessorKey: 'id', sortable: true },
  { header: 'Họ tên', accessorKey: 'name', sortable: true },
  { header: 'Phòng ban', accessorKey: 'department', sortable: true },
  { header: 'Email', accessorKey: 'email', sortable: true },
];

const departments = ['Kỹ thuật', 'Nhân sự', 'Kế toán', 'Kinh doanh'];

const data = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  name: `Nhân viên ${i + 1}`,
  department: departments[i % departments.length],
  email: `nv${i + 1}@example.com`,
}));

export default function App() {
  return (
    <main>
      <h1>Danh sách nhân viên</h1>
      <DataGrid
        data={data}
        columns={columns}
        ariaLabel="Danh sách nhân viên"
        getRowId={(row) => row.id}
        onRowSelect={(row) => console.log('Đã chọn:', row)}
      />
    </main>
  );
}