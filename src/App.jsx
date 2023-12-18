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
  const [newRecipe, setNewRecipe] = useState("");
  const [imagePrompt, setImagePrompt] = useState(null);
  const [isInputButtonDisabled,setIsInputButtonDisabled] = useState(false);//ボタンの活性/非活性
  //InputRecipeFormのonSubmitハンドラ
  const handleRecipeSubmit = (data) => {
    setRecipeData(data.recipeData);
    setSimilarityData(data.similarityData);
  };
  //InputRecipeFormでsetSampleRecipesを使うため、関数化してpropsに渡す
  const setSampleRecipesState = (data) =>{
    setSampleRecipes(data);
  }
  //InputRecipeFormでsetSampleRecipesを使うため、関数化してpropsに渡す、一応デフォルトをtureにして無引数でも実行
  const setIsInputButtonDisabledState = (bool=true) =>{
    setIsInputButtonDisabled(bool);
  }

  //高類似度料理のidを受け取ってその情報を返す、RecipeCard、RecipeModalにも情報を渡す
  useEffect(() => {
    //await使用のためfetchData関数を定義
    const fetchData = async () => {
      if (similarityData && similarityData.length > 0) {
        //dataからidの配列を抽出
        const ids = similarityData.map(data => data.id);
        try {
          //検索中であることを明示
          setSampleRecipes([{name:"混ぜる料理の候補を探しています..."},{name:"もう少しです！！"}]);
          const response = await axios.post('/fetch_similarities_recipes', ids);
          //id,name,ingredients,stepsを要素とするオブジェクト
          setSampleRecipes(response.data);
          setIsInputButtonDisabled(false);
        } catch (error) {
          console.error('Error_FetchSimilarityRecipe:', error);
        }
      }
    };
    fetchData();
  }, [similarityData]);

  //gptの処理に投げるidをセットする
  const handleRecipeSelection = (selectedRecipeId)=>{
    setSelectedRecipeId(selectedRecipeId);
  }
  //gptに投げるための処理、setSelectedRecipeIdの変更があれば動くようにする
  useEffect(() => {
    const fetchData = async () =>{
      if (selectedRecipeId ){//データチェック
        try {
          const postData={id:selectedRecipeId,recipe:recipeData};//データをオブジェクトにする
          const response = await axios.post('/fetch_newrecipe', postData);//バックエンド処理
          setNewRecipe(response.data["newRecipe"]);
          console.log("レシピ:",response.data["newRecipe"]);
          setImagePrompt(response.data["prompt"]);
          console.log("プロンプト:",response.data["prompt"]);
        } catch (error){
          console.error('Error_NewRecipeGenerate:',error);
        }
      }
    };
    fetchData();
  }, [selectedRecipeId]);
  
  //const imageUrl = 'src/stable-diffusion-v1-5.jpeg'; 
  //画像を動的に生成するならAPIを叩く必要があるので後日作成予定、とりあえず見た目のためimportで表示

  return (
    <div className="App">
      <Header />
      <Grid container spacing={3}>
        <Grid item xs={4} md={4}>
          <InputRecipeForm onSubmit={handleRecipeSubmit} setRecipeState={setSampleRecipesState} setButtonState={setIsInputButtonDisabledState} isInputButtonDisabled={isInputButtonDisabled}/>
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
          <NewRecipeDetails recipe={newRecipe} imageUrl={NewRecipeImage} />
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
