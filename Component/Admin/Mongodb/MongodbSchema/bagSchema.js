import mongoose from "mongoose"
const schema=new mongoose.Schema({
    title: { type: String},
    slug: { type: String, unique: true },
    price: { type: Number },
    quantity: { type: Number },
    img:{type:String},
    size:{type:String},
    color:{type:String},
    userId:{type:String},
    bagId:{type:String}
})

const Bag=mongoose.models.Bag || mongoose.model("Bag",schema)
export default Bag