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

  //高類似度料理のidを受け取ってその情報を返す、RecipeCard、RecipeModalにも情報を渡す
  useEffect(() => {
    //await使用のためfetchData関数を定義
    const fetchData = async () => {
      if (similarityData && similarityData.length > 0) {
        //dataからidの配列を抽出
        const ids = similarityData.map(data => data.id);
        try {
          const response = await axios.post('/fetch_similarities_recipes', ids);
          console.log("fetchData_id-name"+response.data[0]);
          //id,name,ingredients,stepsを要素とするオブジェクト
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
    ingredients: '食材：',
    steps: '調理方法：'
  };
  
  //const imageUrl = 'src/stable-diffusion-v1-5.jpeg'; 
  //画像を動的に生成するならAPIを叩く必要があるので後日作成予定、とりあえず見た目のためimportで表示

  return (
    <div className="App">
      <Header />
      <Grid container spacing={3}>
        <Grid item xs={4} md={4}>
          <InputRecipeForm onSubmit={handleRecipeSubmit} />
        </Grid>
        <Grid item xs={4} md={4}>
          <div>
            {sampleRecipes.map((recipe, index) => (
              //recipeにはid,name,ingredients,stepsがある
              <RecipeCard key={index} recipe={recipe} onRecipeSelect={handleRecipeSelection} />
            ))}
          </div>
        </Grid>
        <Grid item xs={4} md={4}>
          <NewRecipeDetails recipe={originalRecipe} imageUrl={NewRecipeImage} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
