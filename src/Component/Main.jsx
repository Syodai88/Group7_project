import React,{useState,useEffect} from 'react';
import InputRecipeForm from './InputRecipeForm';
import RecipeCard from './RecipeCard';
import NewRecipeDetails from './NewRecipeDetails';
import Grid from '@mui/material/Grid';
import hungryImage from './../picture/hungry.png';
import shoppingImage from './../picture/shopping.gif';//gptでレシピ生成中に表示する羊のGIF画像
import makingImage from './../picture/chef.gif';//StableDiffusionで画像生成中に表示するパンダのGIF画像
import axios from 'axios';
import { Button } from '@mui/base';


const Main = ({userId}) => {
  const [recipeData, setRecipeData] = useState(null);
  const [similarityData, setSimilarityData] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [sampleRecipes, setSampleRecipes] = useState([
    { name: 'レシピ1' },
    { name: 'レシピ2' },
    { name: 'レシピ3' }
  ]);
  const [newRecipe, setNewRecipe] = useState("");//新しいレシピのテキスト
  const [imagePrompt, setImagePrompt] = useState(null);//新しいレシピを生成するプロンプト
  const [newRecipeImage ,setNewRecipeImage] = useState(hungryImage);
  const [isInputButtonDisabled,setIsInputButtonDisabled] = useState(false);//ボタンの活性/非活性
  const [showNewRecipeMpdal,setShowNewRecipeModal]=useState(false);//オリジナルレシピのモーダル
  const [backEndError, setBackEndError] = useState("");//後でバックエンド通信のエラーを全て入れる、エラーがあれば画面中央にエラーモーダル表示
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
  //新しいレシピモーダル表示用の関数
  const handleShowNewRecipeModal = () =>{
    setShowNewRecipeModal(true);
  }
  //新しいレシピモーダル非表示用の関数
  const handleCloseNewRecipeModal = () =>{
    setShowNewRecipeModal(false);
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
          setNewRecipeImage(shoppingImage);
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
  }, [selectedRecipeId,recipeData]);
  
  //画像生成機能
  useEffect(()=>{
    const fetchData = async () =>{
      if(imagePrompt){
        try{
          setNewRecipeImage(makingImage);
          const postData = {prompt:imagePrompt};
          const response = await axios.post('/fetch_newimage',postData);
          const base64Image = response.data["image"];
          setNewRecipeImage(`data:image/jpeg;base64,${base64Image}`)
        }catch (error){
          console.error('Error_newImageGenerate',error);
        }
      }
    };
    fetchData();
  }, [imagePrompt]);

  const handleSave = async () =>{
    if(newRecipe){
      try{
        const postData ={
          userId:userId,
          image:newRecipeImage,//デコード済みなのでレコード必須
          newRecipe:newRecipe,//レシピ名のみを抜き取る必要あり
          inputRecipe:recipeData.name,
          confusionRecipeId:selectedRecipeId//Idを使ってアクセスしてnameを引っ張る
        };
        console.log(postData);
        await axios.post('/db/save',postData);//レシピデータを保存、エンコードや日付の追加はpython
      }catch(error){
        alert("レシピの保存に失敗しました。");
        //エラー処理を記述
      }
    }
  };

  return (
    <div className="App">
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
          <NewRecipeDetails recipe={newRecipe} imageUrl={newRecipeImage} open={showNewRecipeMpdal} onClose={handleCloseNewRecipeModal} onSave={handleSave}/>
          {(newRecipeImage !== hungryImage) && (newRecipeImage !== shoppingImage) && (newRecipeImage !== makingImage) &&
            <Button
              variant="contained"
              style={{
                fontSize: '18px',
                padding: '12px 24px',
                backgroundColor: 'orange',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                width: '100%',
              }}
              onClick={handleShowNewRecipeModal}
            >
              作り方を見る！
            </Button>
          }
        </Grid>
      </Grid>
    </div>
  );
}

export default Main;
//現状はレシピ生成はできるけどモーダルを作成してからは画像が表示できなくなった。まずは画像の表示を行えるようにしてからモーダルの確認をする