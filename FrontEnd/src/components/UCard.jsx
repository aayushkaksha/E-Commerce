import { Heart, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UCard = (items) => {
  const navigate = useNavigate();

  const handleCardClick = (id) => {
    navigate(`/product/${id}`);
  };

  // const handleAddToCart = async (id) => {
  //   const { success, message } = await addToCart(id);
  //   // Handle success or error
  // };

  // const handleAddToWishlist = async (id) => {
  //   const { success, message } = await addToWishlist(id);
  //   // Handle success or error
  // };

  return (
    <div className="main-container flex justify-left items-center">
      <div className="w-full grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-6 px-4">
        <div className="relative max-w-sm rounded-lg overflow-hidden shadow-md bg-white transition-transform duration-200 hover:shadow-lg hover:scale-105 cursor-pointer">
          <div className="relative h-0 pb-[75%]">
            <img
              className="absolute top-0 left-0 w-full h-full object-cover rounded-t-lg"
              src={items.images}
              alt={items.name}
              onClick={() => handleCardClick(items.id)}
            />
            <button
              className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow hover:shadow-md transition-colors"
              // onClick={() => handleAddToCart(items.id)}
            >
              <Heart className="w-5 h-5 text-gray-500 hover:text-red-500" />
            </button>
            <button
              className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:shadow-md"
              // onClick={() => handleAddToWishlist(items.id)}
            >
              <Plus className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <div
            className="mt-2 p-2 flex justify-between"
            onClick={() => handleCardClick(items.id)}
          >
            <div>
              <h3 className="text-sm text-gray-700">{items.name}</h3>
            </div>
            <p className="text-sm font-medium text-gray-900">
              Rs.{items.price}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UCard;
