
import mongoose , {Schema}from "mongoose";
import bcrypt from "bcrypt";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import jwt from "jsonwebtoken";

const studentSchema = new Schema({
    username: {
        type:String,
        required:false,
    },
    fullName:{
        type:String,
        required:true,
        trim:true,
    },
    email:{
        type:String, 
        required:true,
        unique: true,
        trim: true,
    },
    Mobile_No:{
        type:Number,
        required:false
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    avatar:{
        type:String, //Cloudinary URL maybe
        
    },
    refreshToken:{
        type:String
    },
    eventsRegistered:{
        type:Array
    }
})

studentSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password= await bcrypt.hash(this.password,10)
    next()
})

studentSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}

studentSchema.methods.generateAccessToken=function(){
     return jwt.sign({
        _id:this._id
    },
    process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
)
}
studentSchema.methods.generateRefreshToken=function(){
    return jwt.sign({  
       _id:this._id
   },
   process.env.REFRESH_TOKEN_SECRET,
   { expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
)
}

 
studentSchema.plugin(mongooseAggregatePaginate)


export const User= mongoose.model("User",studentSchema)