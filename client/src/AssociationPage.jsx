import { useParams } from "react-router-dom";
import FavoriteButton from "./components/FavoriteButton.jsx"
import { useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import './AssociationPage.css';


const AssociationPage = () => {
    const { id } = useParams();
    const [association, setAssociation] = useState(null);
    const [approvals, setApprovals] = useState(null);
    const [negativeInfo, setNegativeInfo] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hasCookie, setHasCookie] = useState(false);


    //   // Debug logging
    //   useEffect(() => {
    //     console.log('Association:', association); // Log association data
    // }, [association]);

    useEffect(() => {
        const fetchAssociation = async () => {
            try {
                // fetch user info from token
                const token = Cookies.get("token");
                //console.log(token)
                if (token) {
                    const tokenResponse = await axios.post("http://localhost:3000/users/getToken", { token })

                    if (tokenResponse.status === 200) {
                        setHasCookie(true);
                        setUser(tokenResponse.data);
                        console.log(tokenResponse.data)

                        const response = await fetch(
                            `https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&filters={"_id":"${id}"}`
                        );

                        if (!response.ok) {
                            throw new Error(`Http error! status: ${response.status}`);
                        }

                        const jsonData = await response.json();
                        if (jsonData.result.records.length > 0) {
                            const associationData = jsonData.result.records[0];
                            setAssociation(associationData)

                            //const associationNumber = associationData['מספר עמותה'];
                            const associationNumber = 580570950;

                            // Fetch approvals and negative info in parallel
                            await fetchApprovals(associationNumber);
                            await fetchNegativeInfo(associationNumber);
                        } else {
                            setError('No association found');
                        }
                    } else {
                        setHasCookie(false);
                        console.log("Token verification failed.");
                    }
                } else {
                    //setError(error);
                    setHasCookie(false);
                    console.log("No token found.");
                }

                // console.log(hasCookie)
                // if (hasCookie) {
                //     console.log("hi") 


                // const associationNumber = associationData['מספר עמותה'];

                // console.log(associationNumber);

                // // fetch approvals of the association
                // await fetchApprovals(associationNumber);

                // //web scraping
                // await fetchNegativeInfo(associationNumber);

                setLoading(false);
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        const fetchApprovals = async (associationNumber) => {
            try {
                const response2 = await fetch(
                    `https://data.gov.il/api/3/action/datastore_search?resource_id=cb12ac14-7429-4268-bc03-460f48157858&q=${associationNumber}`
                );
                if (!response2.ok) {
                    throw new Error(`Http error! status: ${response2.status}`);
                }
                //console.log("hello3")
                const jsonData2 = await response2.json();
                const sortedData = jsonData2.result.records.sort((a, b) => {
                    const yearA = parseInt(a["שנת האישור"], 10);
                    const yearB = parseInt(b["שנת האישור"], 10);
                    return yearB - yearA;
                });
                setApprovals(sortedData)
            } catch (error) {
                setError(error);
                setLoading(false);
            }
        };

        const fetchNegativeInfo = async (associationNumber) => {
            console.log('Fetching negative information for association:', associationNumber);
            try {
                const response3 = await axios.get(`http://localhost:3000/scrape/${associationNumber}`);
                setNegativeInfo(response3.data);
                console.log('Scraping succeeded:', response3.data);
            } catch (error) {
                setError('Error fetching negative information');
                console.error(error);
                // setLoading(false);
            }
        };

        fetchAssociation();
    }, [id]);

    const handleOpenModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
        <div>
            {hasCookie ? (
                <div>
                    {association ? (
                        <>
                            <h1>{association["שם עמותה בעברית"] || "No name available"}</h1>
                            <p>{association["מטרות עמותה"] || "No goals available"}</p>
                            <p>{association["סיווג פעילות ענפי"] || "No activity category available"}</p>
                        </>
                    ) : (
                        <p>Association data not available.</p>
                    )}

                    <h2>מידע נוסף</h2>
                    {approvals.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>שנת האישור</th>
                                    <th>האם יש אישור</th>
                                    <th>הגשת בקשה</th>
                                </tr>
                            </thead>
                            <tbody>
                                {approvals.map((record, index) => (
                                    <tr key={index}>
                                        <td>{record["שנת האישור"] ? record["שנת האישור"] : "N/A"}</td>
                                        <td>{record["האם יש אישור"] ? record["האם יש אישור"] : "N/A"}</td>
                                        <td>{record["הגשת בקשה"] ? record["הגשת בקשה"] : "N/A"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p>No approvals data available.</p>
                    )}

                    <div className="flex justify-end ml-2">
                        {user?._id && (
                            <FavoriteButton association={association} userId={user._id} />
                        )}
                    </div>

                    <div>
                        <button onClick={handleOpenModal} className="donate-button">לתרומה</button>
                        {showModal && (
                            <div className="popup-overlay">
                                <div className="popup-content">
                                    <button onClick={handleCloseModal} className="close-popup">&times;</button>
                                    {/* Your donation form or iframe here */}
                                    <div className="donation-form">
                                        <h2>פרטי התרומה שלי</h2>
                                        {/* Include the donation form UI here */}
                                        <form>
                                            <div className="form-group">
                                                <label htmlFor="donationAmount">אני רוצה לתרום:</label>
                                                <input type="number" id="donationAmount" name="donationAmount" placeholder="0.00" />
                                            </div>
                                            <button type="submit" className="submit-donation">תרמו עכשיו</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <h1>Negative Information</h1>
                        {negativeInfo.length > 0 ? (
                            negativeInfo.map((info, index) => (
                                <div key={index}>
                                    <h2>{info.title}</h2>
                                    <p>{info.snippet}</p>
                                    <a href={info.link} target="_blank" rel="noopener noreferrer">
                                        Read more
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p>No negative information found.</p>
                        )}
                        <p><strong>Disclaimer:</strong> The information displayed is scraped from public sources and may not be entirely accurate or up-to-date.</p>
                    </div>
                </div>
            ) : (
                <div>
                    <h1>Loser</h1>
                </div>
            )}
        </div>
    );
};

//     return (
//         <div>
//             {hasCookie ? ( 
//             <div>
//                 <h1>{association["שם עמותה בעברית"]}</h1>
//                 <p>{association["מטרות עמותה"]}</p>
//                 <p>{association["סיווג פעילות ענפי"]}</p>                  
//                 <h2>מידע נוסף</h2>
//                 {approvals.length > 0 ? (
//                     <table>
//                         <thead>
//                             <tr>
//                                 <th>שנת האישור</th>
//                                 <th>האם יש אישור</th>
//                                 <th>הגשת בקשה</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {approvals.map((record, index) => (
//                                 <tr key={index}>
//                                     <td>{record["שנת האישור"] ? record["שנת האישור"] : "N/A"}</td>
//                                     <td>{record["האם יש אישור"] ? record["האם יש אישור"] : "N/A"}</td>
//                                     <td>{record["הגשת בקשה"] ? record["הגשת בקשה"] : "N/A"}</td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 ) : (
//                     <p>No data available for this association.</p>
//                 )}
//                 <div className="flex justify-end ml-2">
//                     {user._id ? (
//                         <FavoriteButton association={association} userId={user._id}/>) 
//                         :(
//                             <div> </div>
//                         )} 
//                 </div>
//                 <div>
//                     <button onClick={handleOpenModal} className="donate-button">
//                         לתרומה
//                     </button>
//                     {showModal && (
//                         <div className="popup-overlay">
//                             <div className="popup-content">
//                                 <button onClick={handleCloseModal} className="close-popup">
//                                     &times;
//                                 </button>
//                                 {/* Your donation form or iframe here */}
//                                 <div className="donation-form">
//                                     <h2>פרטי התרומה שלי</h2>
//                                     {/* Include the donation form UI here */}
//                                     <form>
//                                         <div className="form-group">
//                                             <label htmlFor="donationAmount">אני רוצה לתרום:</label>
//                                             <input type="number" id="donationAmount" name="donationAmount" placeholder="0.00" />
//                                         </div>
//                                         <button type="submit" className="submit-donation">
//                                             תרמו עכשיו
//                                         </button>
//                                     </form>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//                 <div>
//                     <h1>Negative Information</h1>
//                     {negativeInfo.length > 0 ? (
//                         negativeInfo.map((info, index) => (
//                         <div key={index}>
//                             <h2>{info.title}</h2>
//                             <p>{info.snippet}</p>
//                             <a href={info.link} target="_blank" rel="noopener noreferrer">
//                             Read more
//                             </a>
//                         </div>
//                         ))
//                     ) : (
//                         <p>No negative information found.</p>
//                     )}
//                     <p><strong>Disclaimer:</strong> The information displayed is scraped from public sources and may not be entirely accurate or up-to-date.</p>
//                 </div>
//             </div>
//             ) : (
//                 <div>
//                     <h1>loser</h1>
//                 </div>
//             )}
//         </div>
//     )
// };

export default AssociationPage;