import { Link } from "react-router-dom";
import {replaceTildesAlgorithm} from "../utils/filterText.js";

const AssociationCard = ({ association, userId }) => {

    const aName = replaceTildesAlgorithm(association["שם עמותה בעברית"])
    const aNumber = association["מספר עמותה"]
    let goals = replaceTildesAlgorithm(association["מטרות עמותה"]) || "המידע אודות מטרות העמותה אינו זמין כרגע. ייתכן כי העמותה טרם רשמה את מטרותיה באופן רשמי."
    if(goals.length > 100) goals = goals.slice(0, 100) + "..."
    const link = `/AssociationPage/${aNumber}`

    return (
        <div className="space-y-4  text-[#161616]">
            <Link to={link}>
            <div className="text-2xl p-2">{aName}</div>
                <div>{goals}</div>
            </Link>
        </div>
    )
}

export default AssociationCard;