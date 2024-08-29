import { useParams } from "react-router-dom";
import FavoriteButton from "./components/FavoriteButton.jsx"
import { useState, useEffect } from "react";
import axios from "axios";


const AssociationPage = () => {
    const { id } = useParams();
    const [association, setAssociation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssociation = async () => {
            try{
                const response = await fetch(
                    `https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&filters={"_id":"${id}"}`
                );
                if(!response.ok) {
                    throw new Error(`Http error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                const fetchAssociation = jsonData.result.records[0];
                setAssociation(fetchAssociation)
                
                
                // fetch user info from token
                // const token = Cookies.get("token");
                // console.log(token)
                // if(token){
                //     const tokenResponse = await axios.post("http://localhost:3000/users/getToken", { token: token })
                    
                //     if (tokenResponse.status === 200) {
                //         setUser(tokenResponse.data);
                //     } else {
                //         setError(error);
                //         console.log("Bad request. You have problem with token verifacation.");
                //     }
                // }
                 setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };
        fetchAssociation();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
   
    return (
        <div>
            {association ? (
                <>
                    <h1>{association["שם עמותה בעברית"]}</h1>
                    
                    <p>{association["מטרות עמותה"]}</p>
                    
                    <p>{association["סיווג פעילות ענפי"]}</p>
                    {/* <FavoriteButton association={association} /> */}
                </>
            ) : (
                <p>No association found.</p>
            )}               
        </div>
    );
};

export default AssociationPage;