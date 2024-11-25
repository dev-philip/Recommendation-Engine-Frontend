import { useState, useRef, useEffect } from 'react';
import './chatbody.css';
import TypeIt from "typeit-react";
import axios from 'axios';
import Modal from '../Modal/Modal';
import Header from '../Header/header';
import BarIcon from '../Chatbody/BarIcon';
import FemaleSpeakers from "../../configs/femaleSpeakers";
import apiBaseUrl from "../../configs/apiBaseUrl";


import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

import Aibot from '../AI-bot/Aibot';


// *******************
// import FemaleSpeakers from "../configs/femaleSpeakers";
// import FemaleSpeakers from "../../config.json";

const config = require("../../config.json");
var visemes_arr = []; 

function Chatbody(props) {

  const [isLoading, setIsLoading] = useState(false); // Manage spinner visibility
  const [chatMessage, setChatMessage] = useState('');
  const [company, setSetCompany] = useState('');
  const [chatMessageTrack, setChatMessageTrack] = useState('');
  const [aiMessage, setAiMessage] = useState('');
  const [chatMessageTempDb, setChatMessageTempDb] = useState([]);
  const [chatMessageDb, setChatMessageDb] = useState([
   
  ]);
  const [activateBot, setActivateBot] = useState(0);
  const [activateHuman, setActivateHuman] = useState(0);
  const [newCustomer, setNewCustomer] = useState(true);
  const [isListening, setIsListening] = useState(false); // To track the listening state

  const bottomRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      sendChatMessage();
      event.preventDefault(); // To prevent a newline or form submission
    }
  };

  const handleInputChange = (event) => {
    
   setChatMessageTrack(event.target.value);
  };

  const manipulateDataDb = (chatMessage, aiResponse) => {


    // Create a new message object
  const newMessage = {
    id: (chatMessageDb.length + 1).toString(),  // Incrementing ID based on array length (adjust if needed)
    userInput: chatMessage,
    aiResponse: aiResponse,
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  };

  // Append the new message object to the chatMessageDb array
  setChatMessageDb(prevDb => [...prevDb, newMessage]);
  }

  const scrollToBottom = () => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' });
  };




  // const sendChatMessage = () => {
  //   // alert(chatMessage);
  //   if(chatMessageTrack === ""){
  //     return;
  //   }

  //   setChatMessage(chatMessageTrack);

  //   axios.get('https://nodeapisocialmedia.sbs/api/ai/' + chatMessageTrack)
  //           .then(response => {
  //             // alert("success");
  //             console.log(response);
  //             console.log(response.data);
  //             manipulateDataDb(chatMessageTrack, response.data);
  //             setAiMessage(response.data);
  //           })
  //           .catch(error => {
  //               alert("error occurred");
  //               console.log(error);
  //           });

  //   setTimeout(() => {
  //     setActivateBot(1);
  //   }, 2000)
    
  //   setActivateHuman(1);
  //   setChatMessageTrack("");
    
  // }

  const sendChatMessage = async () =>  {

    // alert(chatMessage);
    if (chatMessageTrack === "") {
      return;
    }

      // Show spinner
      setIsLoading(true);
    
    // Create the payload for the API request
    const payloadfghgj = {
      user_query: chatMessageTrack,
      company_name: company
    };

   

    // manipulateDataDb(chatMessageTrack, "apiResponseData");
    // return
    try {
      // Send a POST request to the API
      let response;
      if(newCustomer === true){
        response = await axios.post(`${apiBaseUrl.prod}/api/recommend/new-user`, payloadfghgj);
      }else{
        response= await axios.post(`${apiBaseUrl.prod}/api/recommend/existing-user`, payloadfghgj);
      }
      

      // Extract the recommendations from the response
      const apiResponseData = response.data.recommendations; // Directly use the recommendations string
 

      // Pass the data to manipulateDataDb function
      manipulateDataDb(chatMessageTrack, apiResponseData);

      //Make AI Talk
      synthesizeSpeech(selectedVoice, apiResponseData);

      // Set the AI message from the API response
      setAiMessage(apiResponseData);

    } catch (error) {
      alert('Error fetching data from API:', error);
      console.error('Error fetching data from API:', error);
      setAiMessage("Sorry, there was an error processing your request.");
    }finally {
      // Hide spinner
      setIsLoading(false);
    }

  
     setTimeout(() => {
      setActivateBot(1);
    }, 2000);
    
    setActivateHuman(1);
    setChatMessageTrack("");
};



 
    // define the states
    const [imageIndex,setImageIndex] = useState(0);
    const [selectedVoice, setSelectedVoice] = useState("en-Us-JennyNeural");
    const [sentence, setSelectedSentence] = useState("Hi! I am your servicenow virtual friend");

    const sentences = [
      "hello, My name is Sarah. I will be your servicenow Representative today. What Accelerators are you looking for",
      "hakuna matata",
      "a friend in need is a friend in deed",
      " ActiveCampaign is a powerful customer experience automation platform that helps businesses of all sizes optimize their customer journeys. It offers a suite of tools including email marketing, marketing automation, sales CRM, and messaging. It also integrates with over 150 apps and platforms to streamline workflows and enhance user experience."
     ];

     function synthesizeSpeech(selectedVoice, sentence){
          const speechConfig = sdk.SpeechConfig.fromSubscription(config.SpeechKey, config.SpeechRegion);
          const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
      
          const ssml = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
                            <voice name='${selectedVoice}'> \r\n \
                                <mstts:viseme type='redlips_front'/> \r\n \
                                ${sentence} \r\n \
                            </voice> \r\n \
                        </speak>`;

            // Subscribes to viseme received event
            speechSynthesizer.visemeReceived = function (s, e) {
              // window.console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);

              visemes_arr.push(e);
            }

              speechSynthesizer.speakSsmlAsync(
                  ssml,
                  result => {
                      if (result.errorDetails) {
                          console.error(result.errorDetails);
                      } else {
                          console.log(JSON.stringify(result));
                          visemes_arr.forEach(e=>{
                            var duration = (e.audioOffset)/10000;
                            setTimeout(()=>{setImageIndex(e.visemeId);},duration);
                          })
                          
                      }
          
                      visemes_arr = [];
                      speechSynthesizer.close();
                  },
                  error => {
                      console.log(error);
                      visemes_arr = [];
                      speechSynthesizer.close();
                  });
    }

    useEffect(() => {
      handleOpenModal();
    }, []);

    useEffect(() => {
      scrollToBottom();
    }, [chatMessageDb]);

    const changeHeaderName = (value) => {
      if(value === "New-Customer"){
        setNewCustomer(true);
      }else{
        setNewCustomer(false);
      }
    }

    const handleTextToSpeechForKeyboard = () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.interimResults = true;

            recognition.addEventListener("start", () => {
                // When listening starts
                setIsListening(true);
            });

            recognition.addEventListener("end", () => {
                // When listening stops
                setIsListening(false);
            });

            recognition.addEventListener("result", (e) => {
                const transcript = Array.from(e.results)
                    .map((result) => result[0])
                    .map((result) => result.transcript)
                    .join("");

                // Update the input field with the transcript
                setChatMessageTrack(transcript);
                console.log(transcript);
            });

            recognition.start();
        } else {
            alert("Your browser does not support Speech Recognition.");
        }
    };

    const [isModalOpen, setModalOpen] = useState(false);

    const handleOpenModal = () => setModalOpen(true);
    const handleCloseModal = () => setModalOpen(false);

    const handleSubmitAISetup = (event) => {
      event.preventDefault();
      // Handle form submission logic here for modal settings
      const formData = new FormData(event.target);

      const data = {
          name: formData.get("name"),
          aiVoiceType: formData.get("aiVoiceType"),
          message: formData.get("message"),
      };

      const welcomeSentence = `Hi, My name is ${data.name}, ${data.message}`;
      const fullWelcomeSentence = `Hi, My name is ${data.name}, ${data.message} For example if you need a data visualization tool. In the prompt you can enter something like (I need a tool for data visualization) or If you want to know about an accelerator you can enter (can you tell me about Jumpstart Your ActiveCampaign). You can also utilise the voice to text feature if you don't want to type by clicking on the microphone icon.`;

      setSelectedVoice(data.aiVoiceType);
      setSelectedSentence(welcomeSentence);


      synthesizeSpeech(data.aiVoiceType, welcomeSentence);
      manipulateDataDb("", fullWelcomeSentence);
      setModalOpen(false);
  };
    

  return (
    <>
     {/* <button onClick={handleOpenModal} className="open-modal-button">
        Open Modal
      </button> */}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <h2>Set Up Your AI Person</h2>
          <form className="aiForm" onSubmit={handleSubmitAISetup}>
              <div>
                  <label htmlFor="name">Name:</label>
                  <input className="aiInput" type="text" id="name" name="name" placeholder="Enter a name for your AI bot" value="Sophia" required />
              </div>
              
              <div>
                  <label htmlFor="aiVoiceType">Select Voice Type:</label>
                  <select id="aiVoiceType" name="aiVoiceType" required>
                     {FemaleSpeakers.map((voice) => <option value={voice.value}>{voice.label}</option>)}
                  </select>
                </div>

              <div>
                  <label htmlFor="message">Introduction Message:</label>
                  <textarea
                      id="message"
                      name="message"
                      rows="5"
                      placeholder="For Example: I will be assisting you with your ServiceNow product recommendation today. Then the bot will say - Hi, My name is ****. I will be assiting you with your product recommendation today."
                      value="I will be assisting you with your ServiceNow product recommendation today."
                      required
                  >
                  </textarea>
                </div>

              <button type="submit" className="ai-submit-button">
                  Save Settings
              </button>
          </form>
      </Modal>
    <Header changeHeaderName={changeHeaderName} setSetCompany={setSetCompany} company={company} newCustomer={newCustomer}></Header>
      
    <Aibot imageIndex = {imageIndex} />

    {/* Loading spinner */}
    {isLoading && (
        <div className="spinner-container">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      )}


    {/* Chat Start from here */}
    <div className="Chatbody">
      <div className='chatbody-container'>
      <div className='chatbody-container-header'>
        {newCustomer
          ? 'Recommendation For New Customers'
          : `Recommendation For Existing Customers - ${company}`}
      </div>
      
      {chatMessageDb.map((dataItem) => (
          <>
            <div className='chat-container' key={dataItem.id}>
              {/* Render Date and Time if any message exists */}
              {(dataItem.userInput || dataItem.aiResponse) && (
                  <div className='time'>{dataItem.date + " " + dataItem.time}</div>
              )}
              {/* Render User Input if it exists */}
              {dataItem.userInput && (
                <div className='chat-user-text'>
                  <div className='werey-avater'>
                    <div className="avatar-circle">
                      <img
                        src="https://img.freepik.com/free-psd/3d-illustration-person-with-sunglasses_23-2149436188.jpg?t=st=1696722213~exp=1696722813~hmac=6fb296d005f9834f2ef6f3010e74fdf0522d0282facb30f9beb1165284eb2402"
                        alt="User Avatar"
                      />
                    </div>
                  </div>
                  <div className='data'>{dataItem.userInput}</div>
                </div>
              )}

              {/* Render AI Response if it exists */}
              {dataItem.aiResponse && (
                <div className='chat-ai-reply'>
                  <div className='werey-avater'>
                    <div className="avatar-circle">
                      <img
                        src="https://www.servicenow.com/content/dam/servicenow-assets/public/en-us/images/og-images/favicon.ico"
                        alt="AI Avatar"
                      />
                    </div>
                  </div>
                  <div className='data'>
                    <TypeIt
                      options={{
                        strings: [`${dataItem.aiResponse}`],
                        speed: 10,
                        waitUntilVisible: true,
                        afterComplete: function (instance) {
                          instance.destroy();
                        },
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Render Date and Time if any message exists */}
              {/* {(dataItem.userInput || dataItem.aiResponse) && (
                <div className='time'>{dataItem.date + " " + dataItem.time}</div>
              )} */}
              
              <hr />
            </div>
          </>
      ))}



              {/* important break line */}
    
          <div ref={bottomRef}></div>
      </div>

      <div className="input-container">
          <form>
              <div className="file-container">
                  {/* <input type="file" id="fileInput" hidden /> */}
                  <label className="icon-textarea" for="fileInput">
                    {isListening ? (
                        <BarIcon />
                    ) : (
                        <i onClick={handleTextToSpeechForKeyboard} className="fa fa-microphone" aria-hidden="true" title="Click to activate voice to speech"></i>
                    )}
                  </label>
              </div>
              <input 
                className="input-text" 
                value={chatMessageTrack} 
                onChange={handleInputChange} 
                onKeyDown={handleKeyDown} 
                type="text" 
                placeholder="Send a Message" 
              />
              <button type="button" className="input-button" title='Send a Message' onClick={() => sendChatMessage()} disabled={isLoading}>
                  <i className="fa fa-paper-plane-o" aria-hidden="true"></i>
              </button>
          </form>
      </div>
    </div>
  </>

  );
}

export default Chatbody;
