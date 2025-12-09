import react, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

function Customize2() {
  const { userData,backendimage,selectedimage,serverUrl,setUserData} =
    useContext(userDataContext);
  const [assistantName, setassistantName] = useState(
    userData?.assistantName || ""
  );
  const [loading,setloading] = useState(false)
  const navigate=useNavigate()

  const handleupdateassistant = async () => {
    setloading(true)

    try {
      let formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendimage) {
        formData.append("assistantimage", backendimage);
      } else {
        formData.append("imageUrl", selectedimage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
      setloading(false)
      console.log(result.data);
      setUserData(result.data);
      navigate("/")
    } catch (error) {
      setloading(false)
      console.log(error);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#030353] flex justify-center items-center flex-col">
      <IoArrowBackSharp className="absolute top-[30px] left-[30px] text-white cursor-pointer w-[25px] h-[25px]" onClick={()=>navigate("/customize")} />
      <h1 className="text-white text-[30px] text-center mb-30px]">
        enter your <span className="text-blue-200">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg : shipra"
        className="max-w-[600px] w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
        required
        onChange={(e) => setassistantName(e.target.value)}
        value={assistantName}
      />
      {assistantName && (
        <button
          className="min-w-[300px] h-[60px] mt-[10px] text-black font-semibold cursor-pointer bg-[white] rounded-full text-[19px]"
          disabled={loading}
          onClick={() => {
            handleupdateassistant();
          }}
        >
          {!loading ?"finally create your assitant":"Loading ..."}
        </button>
      )}
    </div>
  );
}
export default Customize2;
