import Image from "next/image";
export default function CategoryCard({ image, title }) {
  return (
    <div className="bg-white h-[400px] shadow-lg rounded overflow-hidden shadow-lg rounded   hover:-translate-y-2 hover:scale-105">
      <Image
        src={image}
        alt={title}
        width={100}
        height={300}
        className="w-full h-[300px] object-cover"
      />
      <div className="p-4">
        <h4 className="text-2xl font-bold mb-2">{title}</h4>
      </div>
    </div>
  );
}
