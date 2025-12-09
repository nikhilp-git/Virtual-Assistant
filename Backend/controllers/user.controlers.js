import User from "../models/user.model.js"
import uploadOnCloudinary from "../config/cloudinary.js";
import geminiResponce from "../gemini.js";
import moment from "moment";



export const getCurrentUser=async(req,res)=>{
    try {
        const userId=req.userId;
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({message : "User not found"})
        }
        return res.status(200).json(user)
        
    } catch (error) {
        return  res.status(400).json({message:"get current user error"})
    }
}

export const updateassistant=async(req,res)=>{
    try {
        const {assistantName,imageUrl}=req.body
        let assistantImage;
        
        if(req.file){
            assistantImage=await uploadOnCloudinary(req.file.path)
        }
        else{
            assistantImage=imageUrl
        }
        const user=await User.findByIdAndUpdate(req.userId,{assistantname: assistantName, assistantimg: assistantImage},{new:true}).select("-password")
        return res.status(200).json(user)    
    } catch (error) {
        return  res.status(400).json({message:"update assistant error"})
    }
}

export const askToAssistant=async(req,res)=>{
    try {
        

        const {command}=req.body
        const user=await User.findById(req.userId)
        user.history.push(command)
        user.save()
        const userName=user.name
        const assistantName=user.assistantname
        const result=await geminiResponce(command,assistantName,userName)

       const jsonMatch = result.match(/{[\s\S]*}/);

        if (!jsonMatch) {
         
            return res.status(200).json({
            type: "general",
            userInput: command,
            responce: result.trim(),
        });
        }


        let cleanJSON = jsonMatch[0].replace(/```json|```/g, "").trim();
        const gemResult = JSON.parse(cleanJSON);
        const type = gemResult.type;

     
    switch (type) {
      case "get_date":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          responce: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get_time":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          responce: `Current time is ${moment().format("hh:mmA")}`,
        });

      case "get_day":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          responce: `Today is ${moment().format("dddd")}`,
        });

      case "get_month":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          responce: `This month is ${moment().format("MMMM")}`,
        });

      case "google_search":
      case "youtube_search":
      case "youtube_play":
      case "calculator_open":
      case "instagram_open":
      case "facebook_open":
      case "weather-show":
        return res.json({
          type,
          userInput: gemResult.userInput || command,
          responce: gemResult.responce || gemResult.response,
        });

      default:
        // Fallback for unrecognized command
        return res.status(200).json({
          type: "general",
          userInput: gemResult.userInput || command,
          responce: gemResult.response || gemResult.responce || result.trim(),
        });
    }
   
    } catch (error) {
        console.log("AskToAssistant Error:", error);
        return res.status(500).json({ responce: "ask assistant error", error: error.message });
    }

}