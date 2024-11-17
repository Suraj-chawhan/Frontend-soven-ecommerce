import mongoose from "mongoose";

const schema=new mongoose.Schema({
name:{type:String,unique:true},
slug:{type:String,unique:true},

})

const categoriesSchema=mongoose.models.Categories || mongoose.model("Categories",schema)
export default categoriesSchema