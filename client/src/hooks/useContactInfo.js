import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useContactInfo = () => {
	const [loading, setLoading] = useState(true);
	const [contactInfo, setContactInfo] = useState(null);

	const fetchContactInfo = async ({ associationNumber }) => {
		try {
			const response = await axios.post(
				"http://localhost:5000/scrape/contact",
				{ associationNumber }
			);

			if (response.data.error) {
				throw new Error(response.data.error);
			}
			setContactInfo(response.data.contactInfo);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, contactInfo, fetchContactInfo };
};

export default useContactInfo;
// const res = await fetch("/api/auth/link", {
// 	method: "POST",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
// });


