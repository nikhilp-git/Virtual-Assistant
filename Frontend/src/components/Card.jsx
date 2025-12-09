import react, { useContext } from "react";
import { userDataContext } from "../context/UserContext.jsx";

function Card({image}) {
  const {
    serverUrl,
    userData,
    setUserData,
    frontendimage,
    setfrontendimage,
    backendimage,
    setbackendimage,
    selectedimage,
    setselectedimage,
  } = useContext(userDataContext);
  return (
    <div
      className={` w-[70px] h-[140px] lg:w-[150px] lg:h-[200px] bg-[#030326] border-2 border-[#97fb5dbc] rounded-2xl overflow-hidden hover: shadow-blue-950 cursor-pointer hover:border-3 hover:border-white ${
        selectedimage == image
          ? "border-4 border-white shadow-2xl shadow-blue-950 "
          : null
      }`}
      onClick={() => {
        setselectedimage(image),setbackendimage(null),setfrontendimage(null);
      }}
    >
      <img src={image} className="h-[full] object-cover" />
    </div>
  );
}
export default Card;
