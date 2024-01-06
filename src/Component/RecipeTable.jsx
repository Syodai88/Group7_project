import React, { useState, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
const RecipeTable = ({userId}) => {
    const columns = [
      { 
        field: 'image_path', 
        headerName: 'イメージ画像', 
        flex: 1, 
        renderCell: (params) => (<img src={params.value} alt="レシピ画像" style={{ height: 100, width: 100 }} />),
        sortable: false,
        filterable: false
      },
      { 
        field: 'newrecipe', 
        headerName: 'レシピ名', 
        flex: 1,
        sortable: false,
        filterable: false
      },
      { 
        field: 'content', 
        headerName: '作り方', 
        flex: 1,
        renderCell: () => (<Button variant="text">作り方</Button>),
        sortable: false,
        filterable: false
      },
      { 
        field: 'recipe1', 
        headerName: '組み合わせたレシピ１', 
        flex: 1,
        sortable: false,
        filterable: false
      },
      { 
        field: 'recipe2', 
        headerName: '組み合わせたレシピ２', 
        flex: 1,
        sortable: false,
        filterable: false
      },
      { 
        field: 'creation_date', 
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
        renderCell: (params) => (
          <Button onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon style={{ color: 'red' }} />
          </Button>
        ),
        sortable: false,
        filterable: false
      }
    ];
    const [rows,setRows]=useState([]);//テーブルのデータを格納
    const handleDelete = async (id) => {
      try {
          console.log(id);
          const response = await axios.delete('/db/delete_recipe', {data:{ id: id }});
          if (response.status === 200) {
              fetchRecipes();//更新後のデータを取得
              console.log("Recipe deleted successfully");
          }
      } catch (error) {
          console.error("Error deleting recipe:", error);
      }
    };
    const fetchRecipes = async () => {
        try {
            const response = await axios.get('/db/load', { params: { userId: userId } });
            if (response.status === 200) {
                console.log(response.data);
                setRows(response.data.data);
            } else {
                // エラー処理: 予期しないステータスコード
                console.error('Unexpected status code:', response.status);
            }
        } catch (error) {
            if (error.response) {
                // レスポンスがある場合のエラー処理
                console.error('Error:', error.response.status);
            } else {
                // レスポンスがない場合のエラー処理
                console.error('Error:', error.message);
            }
        }
    };
    useEffect(() => {
      if (userId) {
          fetchRecipes();
      }
    }, [userId]);
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
  
  export default RecipeTable;
