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
    console.log(similarityData)
  };

  useEffect(() => {
    //データの有無と空配列ではないか
    if (similarityData && similarityData.length > 0) {
      //similarityDataからidのみを抽出
      const ids = similarityData.map(id => id[0]);
      
      axios.post('/show_similarities', ids)
        .then(response => {
          const updatedRecipes = response.data.map(name => ({ name }));
          setSampleRecipes(updatedRecipes);
        })
        .catch(error => console.error('Error:', error));
    }
  }, [similarityData]);

  

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
              <RecipeCard key={index} recipe={recipe} />
            ))}
          </div>
          <NewRecipeDetails recipe={originalRecipe} imageUrl={NewRecipeImage} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
