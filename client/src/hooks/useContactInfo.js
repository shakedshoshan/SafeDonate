import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const useContactInfo = (associationNumber) => {
	const [loading, setLoading] = useState(true);
	const [contactInfo, setContactInfo] = useState({});

	useEffect(() => {
		if (!associationNumber) return; // No association number, skip fetching
	
		const fetchContactInfo = async () => {
			setLoading(true);
			try {
				const response = await axios.post(
					"http://localhost:5000/scrape/contact",
					{ associationNumber }
				);

				if (response.data.error) {
					throw new Error(response.data.error);
				}
				setContactInfo(response.data.contactInfo || {});
			} catch (error) {
				toast.error(error.message);
				setContactInfo({}); // Reset contact info on error
			} finally {
				setLoading(false);
			}
		};
		
		fetchContactInfo();
	}, [associationNumber]);
	return { loading, contactInfo };
};

export default useContactInfo;
// const res = await fetch("/api/auth/link", {
// 	method: "POST",
// 	headers: { "Content-Type": "application/json" },
// 	body: JSON.stringify({ firstName, lastName, email, password, confirmPassword }),
// });

