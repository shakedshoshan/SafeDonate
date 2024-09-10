import React, { useState, useEffect } from "react";
import axios from "axios"

const FavoriteButton = ({ association, userId }) => {
    const [favorite, setFavorite] = useState(false);
    const aName = association["שם עמותה בעברית"]

    useEffect(() => {
      const checkFavoriteExistence = async () => {
          try {
            const response = await axios.post(`http://localhost:3000/users/updateExist/${userId}`, { Association: aName });
            const isFavorite = response.data;
      
            //console.log(`Association "${aName}" is ${isFavorite ? 'already a favorite' : 'not a favorite'}`);
            setFavorite(isFavorite);
          } catch (error) {
            console.error('Error checking favorite status:', error);
            // Consider handling errors gracefully, e.g., displaying an error message
          }
      };
    
      checkFavoriteExistence();
    }, []);


    const handleClick = async () => {
      setFavorite(!favorite);
      
      if(favorite){
        const removeFavorite = await axios.put(`http://localhost:3000/users/updateRemove/${userId}`, { Association: aName })
        //console.log(removeFavorite)
      } else {
        const addFavorite = await axios.put(`http://localhost:3000/users/updateAdd/${userId}`, { Association: aName })
        //console.log(addFavorite)
      }
    };
  
    return (
      <div>
        {favorite ? (
          <button
            className="text-sm font-semibold text-white bg-blue-400 hover:bg-blue-500 p-2 rounded"
            onClick={handleClick}
          >
            Remove Favorite
          </button>
        ) : (
          <button
            className="text-sm font-semibold text-white bg-blue-700 p-2 rounded hover:bg-blue-800"
            onClick={handleClick}
          >
            Add To Favorite
          </button>
        )}
      </div>
    );
  };
export default FavoriteButton;