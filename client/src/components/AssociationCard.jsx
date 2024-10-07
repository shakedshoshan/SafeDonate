import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton.jsx"
import {replaceTildesAlgorithm} from "../utils/filterText.js";

const AssociationCard = ({ association, userId }) => {

    const aName = replaceTildesAlgorithm(association["שם עמותה בעברית"])
    const aNumber = association["מספר עמותה"]
    //const address = association["כתובת - ישוב"]
    //console.log(address)
    let goals = replaceTildesAlgorithm(association["מטרות עמותה"]) || "לצערנו, המידע אודות מטרות העמותה אינו זמין כרגע. ייתכן כי העמותה טרם רשמה את מטרותיה באופן רשמי."
    // goals = goals.replaceAll("~", ".\n");
    if(goals.length > 100) goals = goals.slice(0, 100) + "..."
    const link = `/AssociationPage/${aNumber}`

    return (
        <div className="space-y-4">
            <Link to={link}>
            <div className="text-2xl p-2">{aName}</div>
                <div>{goals}</div>
                {/* <div className="text-2xl p-2">{aName} - {address}</div>
                <div>מטרות עמותה: {goals}</div> */}
            </Link>
            <div className="flex justify-end ml-2">
                {userId ? (
                    <FavoriteButton association={association} userId={userId} />
                ) : (
                    <div> </div>
                )}
            </div>
        </div>
    )
}

export default AssociationCard;