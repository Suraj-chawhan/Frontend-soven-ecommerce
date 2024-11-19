import mongoose from "mongoose";

const schema=new mongoose.Schema({
name:{type:String,required:true},
slug:{type:String,unique:true,required:true},
img:{type:String}
})

const categoriesSchema=mongoose.models.Categories || mongoose.model("Categories",schema)
export default categoriesSchema