import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton.jsx"

const AssociationCard = ({ association, userId }) => {

    //const id = association._id
    const aName = association["שם עמותה בעברית"]
    const aNumber = association["מספר עמותה"]
    const address = association["כתובת - ישוב"]
    let target = association["מטרות עמותה"] ? association["מטרות עמותה"] : "לא מוגדר"
    target = target.replaceAll("~", ".\n");
    const link = `/AssociationPage/${aNumber}`

    return (
        <div className="space-y-4">
            <Link to={link}>
                <div className="text-2xl p-2">{aName} - {address}</div>
                <div>מטרות עמותה: {target}</div>
            </Link>
            <div className="flex justify-end ml-2">
                {userId ? (
                    <FavoriteButton association={association} userId={userId} />
                ) : (
                    <div> </div>
                )}
                {/* <FavoriteButton association={association} userId={userId}/> */}
            </div>
        </div>
    )
}

export default AssociationCard;