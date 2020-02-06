import React, { useState }from 'react';
// import logo from './logo.svg';
// import './App.css';

import Header from './component/header';
import Topics from './component/topics';
import Content from './component/content';

function App() {

  const [topicId, setTopicId] = useState(0);
  const [title, setTitle] = useState("React");
  const [topics, setTopics] = useState([
    {
      id: 0,
      value: "HTML",
      decs: "HTML is ...."
    },
    {
      id: 1,
      value: "CSS",
      decs: "CSS is ...."
    },
    {
      id: 2,
      value: "JavaScript",
      decs: "JavaScript is ...."
    }
  ]);

  return (
    <div className="App">
      <Header title={title}></Header>
      <Topics 
        topics={topics} 
        changeContent={function(id){
          setTopicId(Number(id));
        }}></Topics>
      <Content 
        title={topics[topicId].value}
        decs={topics[topicId].decs}></Content>
    </div>
  );
}

export default App;