import { useEffect, useState } from 'react';
import axios from 'axios';

const useAssociationData = () => {
    const [association, setAssociation] = useState(null);
    const [loadingAssoc, setLoadingAssociation] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssociation = async ({ associationNumber }) => {
        try {
            const cacheKey = `assoc_${associationNumber}`;
            const cachedData = sessionStorage.getItem(cacheKey);

            if (cachedData) {
                console.log("Using cached data");
                setAssociation(JSON.parse(cachedData));
                setLoadingAssociation(false);
            } else {
                console.log("Fetching from API");
                const filterQuery = JSON.stringify({ "מספר עמותה": associationNumber });
                const response = await axios.get(
                    `https://data.gov.il/api/3/action/datastore_search`,
                    {
                        params: {
                            resource_id: 'be5b7935-3922-45d4-9638-08871b17ec95',
                            filters: filterQuery
                        }
                    }
                );

                // if (response.data.error) {
                //     setError("לא נמצאה עמותה");
                //     throw new Error(res.data.error);
                // }
                // if (response.data.result.records.length > 0) {
                //     // throw new Error(response.data.error);

                if (response.data.result.records.length > 0) {
                    const associationData = response.data.result.records[0];
                    sessionStorage.setItem(cacheKey, JSON.stringify(associationData));
                    setAssociation(associationData);
                    setLoadingAssociation(false);
                } else {
                    setError("לא נמצאה עמותה");
                }

            }
        } catch (error) {
            setError(err.message || "An error occurred while fetching data");
        } finally {
            setLoadingAssociation(false);
        }

    };

    return { loadingAssoc, association, error, fetchAssociation };
};

export default useAssociationData;
