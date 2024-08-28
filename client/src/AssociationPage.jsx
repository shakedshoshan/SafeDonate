import { useParams } from "react-router-dom";
import FavoriteButton from "./components/FavoriteButton.jsx"

const AssociationPage = () => {
    const param = useParams();
    return (
        <div>
            AssociationPage {param.id}
            <FavoriteButton />
        </div>
    )
}

export default AssociationPage;