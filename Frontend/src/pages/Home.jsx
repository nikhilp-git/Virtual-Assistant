import React, { useState, useContext, useEffect, useRef } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiimg from "../assets/ai.gif";
import userimg from "../assets/userimg.gif";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

function Home() {
  const { userData, serverUrl, setUserData, getGeminiResponce } =
    useContext(userDataContext);
  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const [userText, setUserText] = useState("");
  const [aiText, setaiText] = useState("");

  // 🧠 Refs for tracking state across renders
  const isSpeakingRef = useRef(false);
  const isRecognizingRef = useRef(false);
  const recognitionRef = useRef(null);
  const [ham, setHam] = useState(false);
   

  const synth = window.speechSynthesis;

  // ✅ Logout handler
  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signin");
    } catch (error) {
      console.error(error);
      setUserData(null);
    }
  };

  // ✅ Text-to-speech
  const speak = (text) => {
    if (!text) return;

    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.lang = "hi-IN";
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      const hindivoice = voices.find((v) => v.lang === "hi-IN");
      if (hindivoice) {
        utterance.voice = hindivoice;
      }

      // mark as speaking
      isSpeakingRef.current = true;

      utterance.onend = () => {
        setaiText("");
        isSpeakingRef.current = false;
          safeRecognition(); // restart listening after speaking
      };

      synth.cancel(); // stop previous speech
      synth.speak(utterance);
    } else {
      console.error("Speech synthesis not supported in this browser.");
    }
  };

  // ✅ Handle assistant commands
  const handleCommand = (data) => {
    const { type, userInput, responce } = data;

    if (type === "google_search") {
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(userInput)}`,
        "_blank"
      );
    } else if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    } else if (type === "instagram_open") {
      window.open("https://www.instagram.com", "_blank");
    } else if (type === "facebook_open") {
      window.open("https://www.facebook.com", "_blank");
    } else if (type === "weather_show") {
      window.open("https://www.google.com/search?q=weather", "_blank");
    } else if (type === "youtube_search" || type === "youtube_play") {
      window.open(
        `https://www.youtube.com/results?search_query=${encodeURIComponent(
          userInput
        )}`,
        "_blank"
      );
    }

    // Speak the response if present
    if (responce) speak(responce);
  };

  // ✅ Safe recognition start
  const safeRecognition = () => {
    const recognition = recognitionRef.current;
    if (!recognition || isRecognizingRef.current || isSpeakingRef.current)
      return;

    try {
      recognition.start();
    } catch (error) {
      if (error.name !== "InvalidStateError") {
        console.error("Recognition start error:", error);
      }
    }
  };

  // ✅ Setup SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognitionRef.current = recognition;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      // Restart automatically if not speaking
      if (!isSpeakingRef.current) {
        setTimeout(safeRecognition, 800);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);

      if (event.error !== "aborted" && !isSpeakingRef.current) {
        setTimeout(safeRecognition, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      console.log("Heard:", transcript);

      if (
        transcript
          .toLowerCase()
          .includes(userData.assistantname?.toLowerCase() || "")
      ) {
        setaiText("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);

        const data = await getGeminiResponce(transcript);
        if (data) handleCommand(data);
        setaiText(data.responce);
        setUserText("");
      }
    };

    // Auto-start recognition
    safeRecognition();

    // Keep recognition alive periodically
    const fallback = setInterval(() => {
      if (!isSpeakingRef.current && !isRecognizingRef.current) {
        safeRecognition();
      }
    }, 2000);

    const greeting=new SpeechSynthesisUtterance(`hello ${userData.name}, what can i help you with ?`);
    greeting.lang='hi-IN';
    window.speechSynthesis.speak(greeting);

    // Cleanup
    return () => {
      clearInterval(fallback);
      recognition.stop();
      isRecognizingRef.current = false;
      setListening(false);
    };
  }, []);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-black to-[#03035398] flex justify-center items-center flex-col gap-[15px] overflow-hidden">
      <IoMenu
        className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] lg:hidden"
        onClick={() => setHam(true)}
      />
      <div
        className={`absolute lg:hidden top-0 w-full h-full bg-[#00000000] backdrop-blur-lg  p-[20px] flex flex-col gap-[10px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <RxCross2
          className="text-white absolute top-[20px] right-[20px] w-[25px] h-[25px] "
          onClick={() => setHam(false)}
        />
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white  top-[20px] right-[20px] rounded-full text-[19px]"
          onClick={handleLogout}
        >
          Logout
        </button>

        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white  top-[100px] right-[20px] px-[20px] py-[10px] rounded-full text-[19px]"
          onClick={() => navigate("/customize")}
        >
          Customize your AI
        </button>
        <div className="w-full h-[2px] bg-gray-400"></div>
        <h1 className="text-white font-semibold text-[19px]">history</h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col">
          {userData?.history && userData.history.length > 0 ? (
            userData.history.map((his, index) => (
              <span key={index} className="text-white truncate">
                {his}
              </span>
            ))
          ) : (
            <span className="text-gray-400">No history yet</span>
          )}
        </div>
      </div>
      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[20px] right-[20px] rounded-full text-[19px]"
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-white absolute hidden lg:block top-[100px] right-[20px] px-[20px] py-[10px] rounded-full text-[19px]"
        onClick={() => navigate("/customize")}
      >
        Customize your AI
      </button>

      <div className="w-[300px] h-[350px] flex justify-center items-center overflow-hidden rounded-4xl shadow-lg">
        <img
          src={userData?.assistantimg}
          alt=""
          className="h-full object-cover"
        />
      </div>

      <h1 className="text-white text-[18px] font-semibold">
        I'm {userData?.assistantname}
      </h1>
      {aiText && <img src={aiimg} alt="" className="w-[100px] h-[100px]" />}
      {!aiText && <img src={userimg} alt="" className="w-[100px] h-[100px]" />}

      <h1 className="text-white text-[18px] font-semibold text-wrap">
        {userText ? userText : aiText ? aiText : null}
      </h1>
    </div>
  );
}

export default Home;
