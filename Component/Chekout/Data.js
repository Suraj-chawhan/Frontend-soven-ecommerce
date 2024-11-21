import { MdLocalOffer } from "react-icons/md";

function Offer({ text1, text2, text3 }) {
  return (
    <div className="flex gap-2">
      <MdLocalOffer
        size="2em"
        className="w-[100px] h-[100px] md:h-[20px] md:w-[20px]"
        color="orange"
      />
      <p>{text1}</p>
      <p>{text2}</p>
      <p className="font-bold">{text3}</p>
    </div>
  );
}
export default function Data({ price }) {
  const ten = (price * 10) / 100,
    twenty = (price * 20) / 100,
    fifteen = (price * 15) / 100;

  return (
    <div className="flex gap-10 flex-col">
      <Offer
        text1={`Get this for INR $ ${price - twenty}/-`}
        text2={`Flat 20% Off on minimum purchase of 4599/-`}
        text3={`Code:FLAT20`}
      />
      <Offer
        text1={`Get this for INR $ ${price - fifteen}/-`}
        text2={`Flat 15% Off on minimum purchase of 2999/-`}
        text3={`Code:FLAT15`}
      />
      <Offer
        text1={`Get this for INR $ ${price - ten}/-`}
        text2={`Flat 10% Off on minimum purchase of 1999/-`}
        text3={`Code:FLAT10`}
      />
    </div>
  );
}
