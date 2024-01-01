import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';

const columns = [
  { 
    field: 'image', 
    headerName: 'イメージ画像', 
    width: 150, 
    renderCell: (params) => (<img src={params.value} alt="レシピ画像" style={{ height: 50, width: 50 }} />),
    sortable: false,
    filterable: false
  },
  { 
    field: 'name', 
    headerName: 'レシピ名', 
    width: 200,
    sortable: false,
    filterable: false
  },
  { 
    field: 'instructions', 
    headerName: '作り方', 
    width: 130, 
    renderCell: () => (<Button variant="text">作り方</Button>),
    sortable: false,
    filterable: false
  },
  { 
    field: 'combinedRecipe1', 
    headerName: '組み合わせたレシピ１', 
    width: 200,
    sortable: false,
    filterable: false
  },
  { 
    field: 'combinedRecipe2', 
    headerName: '組み合わせたレシピ２', 
    width: 200,
    sortable: false,
    filterable: false
  },
  { 
    field: 'creationDate', 
    headerName: '作成日', 
    width: 110,
    type: 'date',
    sortable: true,
    valueGetter: (params) => params.value ? new Date(params.value) : null,
  },
  { 
    field: 'delete', 
    headerName: '削除', 
    width: 80, 
    renderCell: () => (<Button><DeleteIcon style={{ color: 'red' }} /></Button>),
    sortable: false,
    filterable: false
  }
];

const rows = [
  {
    id: 1, 
    image: 'https://via.placeholder.com/50', 
    name: 'レシピ1', 
    instructions: '指示1', 
    combinedRecipe1: 'レシピA', 
    combinedRecipe2: 'レシピB', 
    creationDate: '2024-01-01',
    delete: ''
  },
  // 他の行データをここに追加...
];

const SimpleDataGrid = () => {
    //１テーブルのページサイズの設定にはautoPageSizeをtrueにしてOptionsに配列を与える
    return (
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          autoPageSize={true}
          rows={rows}
          columns={columns}
          pageSize={5}
          pageSizeOptions={[5, 10, 15]}
          disableColumnMenu
          disableSelectionOnClick
          
        />
      </Box>
    );
  }
  
  export default SimpleDataGrid;
