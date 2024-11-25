import React, { useEffect } from "react";
import logo from './logo.svg';
import './App.css';
import Chatbody from './Components/Chatbody/chatbody';
// import Header from './Components/Header/header';

function App() {

  useEffect(() => {
    // Check if the device is mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(window.navigator.userAgent);

    if (isMobile) {
      alert("This app is not built for Mobile devices. Kindly switch to a computer.");
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* <Header></Header> */}
        <Chatbody></Chatbody>
      </header>
    </div>
  );
}

export default App;
