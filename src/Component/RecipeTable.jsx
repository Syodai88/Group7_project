import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { 
    field: 'image', 
    headerName: 'イメージ画像', 
    flex: 1, 
    renderCell: (params) => (<img src={params.value} alt="レシピ画像" style={{ height: 100, width: 100 }} />),
    sortable: false,
    filterable: false
  },
  { 
    field: 'name', 
    headerName: 'レシピ名', 
    flex: 1,
    sortable: false,
    filterable: false
  },
  { 
    field: 'instructions', 
    headerName: '作り方', 
    flex: 1,
    renderCell: () => (<Button variant="text">作り方</Button>),
    sortable: false,
    filterable: false
  },
  { 
    field: 'combinedRecipe1', 
    headerName: '組み合わせたレシピ１', 
    flex: 1,
    sortable: false,
    filterable: false
  },
  { 
    field: 'combinedRecipe2', 
    headerName: '組み合わせたレシピ２', 
    flex: 1,
    sortable: false,
    filterable: false
  },
  { 
    field: 'creationDate', 
    headerName: '作成日', 
    flex: 1,
    type: 'date',
    sortable: true,
    valueGetter: (params) => params.value ? new Date(params.value) : null,
  },
  { 
    field: 'delete', 
    headerName: '削除', 
    flex: 1, 
    renderCell: () => (<Button><DeleteIcon style={{ color: 'red' }} /></Button>),
    sortable: false,
    filterable: false
  }
];
const row={
    id: 1, 
    image: 'https://via.placeholder.com/50', 
    name: 'レシピ1', 
    instructions: '指示1', 
    combinedRecipe1: 'レシピA', 
    combinedRecipe2: 'レシピB', 
    creationDate: '2024-01-01',
    delete: ''
}
const rows = [
  row,row,row,row,row,row,row,row,row,row,row,row,row,row,row,row,row,row,row,row,row
];

const SimpleDataGrid = () => {
    //１テーブルのページサイズの設定にはautoPageSizeをtrueにしてOptionsに配列を与える
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', height: 850, width: '100%' }}>
        <DataGrid
            rowHeight={120}
            autoPageSize={true}
            rows={rows}
            columns={columns}
            disableColumnMenu
            disableRowSelectionOnClick={true}
            disableVirtualization
        />
      </Box>
    );
  }
  
  export default SimpleDataGrid;
