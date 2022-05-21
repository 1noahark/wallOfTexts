import './App.css';
import { InputBox } from './components/InputBox';
import { TextCards } from './components/TextCards';
import { useEffect, useState} from 'react';

let initContent = [];

function App() {  
  const [content, setContent] = useState([]);

  useEffect(()=>{
    fetch('https://dagmawibabi.com/wot/getNotes') //http://localhost:5000 
    .then((response) => response.json())
    .then((responseJSON) => {setContent(responseJSON); initContent = responseJSON;})
    .catch((e) => console.log("error"))
  }, []); 

  async function addNote(){
    let newTitle = document.getElementById("titleInputBox").value;
    let newContent = document.getElementById("contentInputBox").value;
    let newObj = {
      title: newTitle,
      content: newContent,
    };
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
    fetch('https://dagmawibabi.com/wot/getNotes') //http://localhost:5000 
    .then((response) => response.json())
    .then((responseJSON) => {setContent(responseJSON); initContent = responseJSON;})
    .catch((e) => console.log("error"))

    // Refresh
    setContent([...initContent]);
  }

  useEffect(() => {
    console.log(content);
  }, [content]);


  return (
    <div>
      <div className="App">
        <h1 style={{padding: "60px 0px 30px 0px", fontSize: "40px"}}> Words of Strangers </h1>
        <div style={{display: "flex", justifyContent: "center"}}>
          <InputBox btnFunc={addNote} />
        </div>

        <div className='gridView'>
          {
            content.length > 0 ? content.map((content, index) => {return <TextCards key={index} title={content['title']} content={content['content']} date={content['date']} time={content['time']} />}) : null
          }
        </div>
      </div>

      <p style={{padding: "30px 0px 30px 0px", color: "#61b59f", borderTop: "1px solid #61b59f", backgroundColor: "#0c1a2f", fontSize: "15px", justifyContent: "center", textAlign: "center"}}> Made with 💙 by <a href="https://t.me/dagmawi_babi" style={{color: "#61b59f"}}> DagmawiBabi </a> </p>

    </div>
  );
}

export default App;
