import react, { useContext, useRef, useState } from "react";
import Card from "../components/Card.jsx";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image3 from "../assets/authbg.png";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { RiImageAddLine } from "react-icons/ri";
import { userDataContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import { IoArrowBackSharp } from "react-icons/io5";

function Customize() {
  const {
    serverUrl,
    userData,
    setuserData,
    frontendimage,
    setfrontendimage,
    backendimage,
    setbackendimage,
    selectedimage,
    setselectedimage,
  } = useContext(userDataContext);

  const inputImage = useRef();
  const navigate = useNavigate();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setbackendimage(file);
    setfrontendimage(URL.createObjectURL(file));
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col p-[20px]">
      <IoArrowBackSharp className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]" onClick={()=>navigate("/")} />
      <h1 className="text-white text-[30px] text-center mb-30px]">
        select your <span className="text-blue-200">Assistant Image</span>
      </h1>
      <div className="h-[65%] max-w-[900px] flex justify-center items-center flex-wrap gap-[15px]">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image3} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className={`w-[70px] h-[140px] lg:w-[150px] lg:h-[200px] bg-[#030326] border-2 border-[#97fb5dbc] rounded-2xl overflow-hidden hover: shadow-blue-950 cursor-pointer hover:border-3 hover:border-white flex items-center justify-center ${
            selectedimage == "input"
              ? "border-4 border-white shadow-2xl shadow-blue-950 "
              : null
          }`}
          onClick={() => {
            inputImage.current.click(),setselectedimage("input");
          }}
        >
          {!frontendimage && (
            <RiImageAddLine className="text-white w-[35px] h-[35px]" />
          )}
          {frontendimage && (
            <img src={frontendimage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedimage && (
        <button
          className="min-w-[150px] h-[60px] mt-[10px] text-black font-semibold cursor-pointer bg-[white] rounded-full text-[19px]"
          onClick={() => navigate("/customize2")}
        >
          Next
        </button>
      )}
    </div>
  );
}
export default Customize;
