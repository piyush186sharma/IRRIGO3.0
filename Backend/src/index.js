import { app } from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/database.js";

dotenv.config({
    path:"./.env"
})

const PORT=process.env.PORT || 3000

connectDB()
.then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server Up & Running on Port ${PORT}`);
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed",err)

})