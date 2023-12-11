import React,{useState,useEffect} from 'react';
import Header from './Component/Header';
import InputRecipeForm from './Component/InputRecipeForm';
import RecipeCard from './Component/RecipeCard';
import NewRecipeDetails from './Component/NewRecipeDetails';
import Grid from '@mui/material/Grid';
import NewRecipeImage from './stable-diffusion-v1-5.jpeg'
import axios from 'axios';

const App = () => {
  const [recipeData, setRecipeData] = useState(null);
  const [similarityData, setSimilarityData] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  console.log(similarityData)
  const [sampleRecipes, setSampleRecipes] = useState([
    { name: 'レシピ1' },
    { name: 'レシピ2' },
    { name: 'レシピ3' }
  ]);

  //InputRecipeFormのonSubmitハンドラ
  const handleRecipeSubmit = (data) => {
    setRecipeData(data.recipeData);
    setSimilarityData(data.similarityData);
  };

  //類似度判定をしてidと類似度を取得する
  useEffect(() => {
    //await使用のためfetchData関数を定義
    const fetchData = async () => {
      if (similarityData && similarityData.length > 0) {
        const ids = similarityData.map(data => data.id);
        try {
          const response = await axios.post('/fetch_similarities_recipes', ids);
          console.log("fetchData_id-name"+response.data);
          setSampleRecipes(response.data);
        } catch (error) {
          console.error('Error:', error);
        }
      }
    };
    fetchData();
  }, [similarityData]);

  //gptの処理に投げるidをセットする
  const handleRecipeSelection = (selectedRecipeId)=>{
    console.log(`selectedRecipeId:${selectedRecipeId}`);
    setSelectedRecipeId(selectedRecipeId);
  }

  


  //仮のオリジナルレシピデータと画像URL
  const originalRecipe = {
    name: 'オリジナルレシピ',
    ingredients: '材料A、材料B、材料C',
    steps: '手順1、手順2、手順3'
  };
  
  //const imageUrl = 'src/stable-diffusion-v1-5.jpeg'; 
  //画像を動的に生成するならAPIを叩く必要があるので後日作成予定、とりあえず見た目のためimportで表示

  return (
    <div className="App">
      <Header />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <InputRecipeForm onSubmit={handleRecipeSubmit} />
        </Grid>
        <Grid item xs={12} md={6}>
          <div>
            {sampleRecipes.map((recipe, index) => (
              //recipeにはidとnameがある
              <RecipeCard key={index} recipe={recipe} onRecipeSelect={handleRecipeSelection} />
            ))}
          </div>
          <NewRecipeDetails recipe={originalRecipe} imageUrl={NewRecipeImage} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
