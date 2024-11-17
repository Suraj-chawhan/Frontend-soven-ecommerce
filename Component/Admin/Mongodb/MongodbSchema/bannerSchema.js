import mongoose from "mongoose"
const schema=new mongoose.Schema({
img:{type:String}
})

const Banner=mongoose.models.Banner || mongoose.model("Banner",schema)
export default Banner