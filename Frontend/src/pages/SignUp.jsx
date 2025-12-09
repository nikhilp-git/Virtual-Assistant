import react, { useState, useContext } from "react";
import bg from "../assets/authbg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { userDataContext } from "../context/UserContext";
import axios from "axios";

function SignUp() {
  const [showpass, setshowpass] = useState(false);
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const { serverUrl, userData, setUserData } = useContext(userDataContext);
  const [err, seterr] = useState("");
  const [loading, Setloading] = useState(false);

  const handlesignup = async (e) => {
    e.preventDefault();
    seterr("");
    Setloading(true);

    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        {
          name,
          email,
          password,
        },
        { withCredentials: true }
      )
      setUserData(result.data)
      Setloading(false)
      useNavigate("/customize")

    } catch (error) {
      console.log(error);
      setUserData(null)
      Setloading(false);
      seterr(error.response?.data?.message || "Network or server error");
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000062] backdrop-blur shadow-lg shadow-black flex flex-col justify-center items-center gap-[20px] px-[20px]"
        onSubmit={handlesignup}
      >
        <h1 className="text-white text-[30px] font-semibold mb-[30px]">
          register to <span> virtual assistant</span>
        </h1>
        <input
          type="text"
          placeholder="enter your name"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setname(e.target.value)}
          value={name}
        />
        <input
          type="email"
          placeholder="enter your email"
          className="w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px]"
          required
          onChange={(e) => setemail(e.target.value)}
          value={email}
        />
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showpass ? "text" : "password"}
            placeholder="password"
            className="w-full h-full outline-none bg-transparent placeholder-gray-300 px-[20px] py-[10px] rounded-full"
            required
            onChange={(e) => setpassword(e.target.value)}
            value={password}
          />
          {!showpass && (
            <IoEye
              className="absolute top-[20px] right-[20px] h-[25px] w-[25px] text-[white] "
              onClick={() => setshowpass(true)}
            />
          )}
          {showpass && (
            <IoEyeOff
              className="absolute top-[20px] right-[20px] h-[25px] w-[25px] text-[white] "
              onClick={() => setshowpass(false)}
            />
          )}
        </div>
        {err.length > 0 && <p className="text-red-600">*{err}</p>}
        <button
          className="min-w-[150px] h-[60px] mt-[30px] text-black font-semibold bg-[white] rounded-full text-[19px]"
          disabled={loading}
        >
          {loading ? "Loading ..." : "Sign up"}
        </button>
        <p
          className="text-[white] text-[18px] cursor-pointer"
          onClick={() => navigate("/signin")}
        >
          alredy have an account ?<span className="text-blue-400">signin </span>
        </p>
      </form>
    </div>
  );
}

export default SignUp;
