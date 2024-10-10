import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useAssociationLink = () => {
	const [loading, setLoading] = useState(true);
	const [link, setLink] = useState(null);

	const fetchAssociationLink = async ({ associationNumber }) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/scrape/link",
				{ associationNumber }
			);

			if (response.data.error) {
				throw new Error(response.data.error);
			}
			setLink(response.data.link);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, link, fetchAssociationLink };
};

export default useAssociationLink;
// const res = await fetch("/api/auth/link", {
// 	method: "POST",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
// });


