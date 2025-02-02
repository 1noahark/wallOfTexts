import './App.css';
import { InputBox } from './components/InputBox';
import { TextCards } from './components/TextCards';
import { useEffect, useState} from 'react';

let initContent = [];

function App() {  
  const [content, setContent] = useState([]);
  const [numOfPosts, setNumOfPosts] = useState(0);
  const [sort, setSort] = useState("time");
  const [order, setOrder] = useState(-1);

  useEffect(()=>{
    fetch('https://dagmawibabi.com/wot/getNotes/' + sort + '/' + order) //http://localhost:5000 //https://dagmawibabi.com
    .then((response) => response.json())
    .then((responseJSON) => {setContent(responseJSON); initContent = responseJSON; setNumOfPosts(responseJSON.length)})
    .catch((e) => console.log("error"))
  }, [sort, order]); 

  async function addNote(){
    let newTitle = document.getElementById("titleInputBox").value;
    let newContent = document.getElementById("contentInputBox").value;
    let newObj = {
      title: newTitle,
      content: newContent,
    };
    document.getElementById("titleInputBox").value = "";
    document.getElementById("contentInputBox").value = "";
    initContent.push(newObj);
    //initContent.reverse();

    //copy
    //navigator.clipboard.writeText(`${newTitle} \n ${newContent}`); 

    // add to db
    fetch(`https://dagmawibabi.com/wot/sendNote/${newTitle}/${newContent}`) 
    .then((response) => console.log(response))
    .catch((e) => console.log("error"))

    // Refresh
    setContent([...initContent]);

    // Update
    fetch('https://dagmawibabi.com/wot/getNotes' + sort + '/' + order) //http://localhost:5000  //https://dagmawibabi.com
    .then((response) => response.json())
    .then((responseJSON) => {setContent(responseJSON); initContent = responseJSON; setNumOfPosts(responseJSON.length)})
    .catch((e) => console.log("error"))

    // Refresh
    setContent([...initContent]);
  }

  async function likeNote(title, content){
    fetch(`https://dagmawibabi.com/wot/likeNote/${title}/${content}`)
    .then(()=> {
      initContent.forEach((obj)=>{
        if(obj.title === title && obj.content === content){
          obj.likes++;
        }
      })})
    .then(()=>{setContent([...initContent]);})
    .catch((e) => console.log("error"));
  }

  async function dislikeNote(title, content){
    fetch(`https://dagmawibabi.com/wot/dislikeNote/${title}/${content}`)
    .then(()=> {
      initContent.forEach((obj)=>{
        if(obj.title === title && obj.content === content){
          obj.dislikes--;
        }
      })})
    .then(()=>{setContent([...initContent]);})
    .catch((e) => console.log("error"));
  }

  return (
    <div>
      <div className="App">
        <h1 className='appName'> Words of Strangers </h1>
        <div style={{display: "flex", justifyContent: "center"}}>
          <InputBox btnFunc={addNote} numOfPosts={numOfPosts} />
        </div>
        <div className='navBar'>
            <select className='optionBtn' style={{marginRight: '10px'}} value={sort} onChange={(e)=>{setSort(e.target.value);}}>
                <option value="likes" > Likes </option>
                <option value="dislikes"> Dislikes </option>
                <option value="time"> Chronological </option>
            </select>
            <select className='optionBtn' value={order} onChange={(e)=>{setOrder(e.target.value);}}>
                <option value="1"> Ascending </option>
                <option value="-1"> Descending </option>
            </select>
        </div>

        <div className='gridView'>
          {
            content.length > 0 ? content.map((content, index) => {return <TextCards key={index} likeFunc={likeNote} dislikeFunc={dislikeNote} title={content['title']} content={content['content']} date={content['date']} time={content['time']} likes={content['likes']} dislikes={content['dislikes']} />}) : null
          }
        </div>
      </div>

      <p style={{padding: "30px 0px 30px 0px", color: "#61b59f", borderTop: "1px solid #61b59f", backgroundColor: "#0c1a2f", fontSize: "15px", justifyContent: "center", textAlign: "center"}}> Made with 💙 by <a href="https://t.me/dagmawi_babi" style={{color: "#61b59f"}}> DagmawiBabi </a> </p>

    </div>
  );
}

export default App;
