import react, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const userDataContext = createContext();
function UserContext({ children }) {
  const serverUrl = "https://virtual-assistant-backend-atiu.onrender.com";
  const [userData, setUserData] = useState(null);
  const [frontendimage, setfrontendimage] = useState(null);
  const [backendimage, setbackendimage] = useState(null);
  const [selectedimage, setselectedimage] = useState(null);

  const handleCurrentUser = async () => {
    try {
      const result = await axios.get("http://localhost:8000/api/user/current", {
        withCredentials: true,
      });
      setUserData(result.data);
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getGeminiResponce=async(command)=>{
    try {
      const result=await axios.post(`${serverUrl}/api/user/asktoassistant`,{command},{withCredentials:true})
      return result.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleCurrentUser();
  }, []);

  const value = {
    serverUrl,
    userData,
    setUserData,
    frontendimage,
    setfrontendimage,
    backendimage,
    setbackendimage,
    selectedimage,
    setselectedimage,
    getGeminiResponce
  };
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  );
}

export default UserContext;
