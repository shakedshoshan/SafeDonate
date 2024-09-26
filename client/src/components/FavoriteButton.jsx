import React, { useState, useEffect } from "react";
import axios from "axios"

const FavoriteButton = ({ association, userId }) => {
  const [favorite, setFavorite] = useState(false);
  const aName = association["שם עמותה בעברית"]
  const aNumber = association["מספר עמותה"]

  useEffect(() => {
    const checkFavoriteExistence = async () => {
      try {
        const response = await axios.post(`http://localhost:5000/users/updateExist/${userId}`, {
            associationNumber: aNumber
        });
        const isFavorite = response.data.exists;

        //console.log(`Association "${aNumber}" is ${isFavorite ? 'already a favorite' : 'not a favorite'}`);
        setFavorite(isFavorite);
      } catch (error) {
        console.error('Error checking favorite status:', error);
      }
    };

    checkFavoriteExistence();
  }, []);


  const handleClick = async () => {
    setFavorite(!favorite);

    if (favorite) {
      const removeFavorite = await axios.put(`http://localhost:5000/users/updateRemove/${userId}`, {
          associationNumber: aNumber       
      })
      //console.log(removeFavorite)
    } else {
      const addFavorite = await axios.put(`http://localhost:5000/users/updateAdd/${userId}`, {
          associationName: aName, 
          associationNumber: aNumber       
      })
  
    }
  };

  return (
    <div className="">
      {favorite ? (
        <button
          className="favorite-button flex gap-2 bg-[#e84949] hover:bg-[#c73131]"
          onClick={handleClick}
        >
          <p>מחק מהמועדפים</p>
          <span className="">{"  ❤️"}</span>
        </button>
        
      ) : (
        <button
          className="favorite-button flex gap-2 "
          onClick={handleClick}
        >
           <p>הוסף למועדפים</p>
          <span className="">{"  🤍"}</span>
        </button>
      )}
    </div>
  );
};
export default FavoriteButton;

