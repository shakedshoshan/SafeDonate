import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
//import { useAuthContext } from "../context/AuthContext";

const useAssociationLink = () => {
	const [loading, setLoading] = useState(false);
	const [link, setLink] = useState(null);
	//const { setAuthUser } = useAuthContext();

	const associationLink = async ({ associationNumber }) => {
		const success = handleInputErrors({ associationNumber });
		if (!success) return;

		setLoading(true);
		try {
			const res = await axios.post(
				"http://localhost:5000/scrape/link",
				{ associationNumber }
			);

			if (res.data.error) {
				throw new Error(res.data.error);
			}
			setLink(res.data.link);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, link, associationLink };
};

function handleInputErrors({ associationNumber }) {
	if (!associationNumber) {
		toast.error("Association number is required.");
		return false;
	}

	return true;
}

export default useAssociationLink;
// const res = await fetch("/api/auth/link", {
// 	method: "POST",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
// });


