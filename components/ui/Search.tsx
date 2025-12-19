import Image from "next/image";

const Search = () => {
  return (
    <div className="relative mb-8 mt-5">
      <input
        type="text"
        placeholder="Rechercher un expert"
        className="w-full pl-12 pr-4 py-4 text-[#8696BB] bg-white border  rounded-md  focus:outline-none focus:border-[#00569E]"
      />
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <Image
          src={"/search-normal.svg"}
          alt="recherche"
          width={23}
          height={23}
        />
      </div>
    </div>
  );
};

export default Search;
