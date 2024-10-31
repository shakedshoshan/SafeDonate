const useSearchByNumber = () => {
    const [searchResult, setSearchResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const searchByNumber = async (associationNumber) => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://data.gov.il/api/3/action/datastore_search?resource_id=be5b7935-3922-45d4-9638-08871b17ec95&q=${associationNumber}"`
        );
        const jsonData = await response.json();
        const activeData = jsonData.result.records

        if (activeData.length > 0) {
          setSearchResult(activeData[0]);
        } else {
          setError("לא נמצאה עמותה פעילה עם המספר הזה");
        }
      } catch (error) {
        setError("אירעה שגיאה בחיפוש העמותה");
        console.error("Error searching association:", error);
      } finally {
        setLoading(false);
      }
    };

    return {
      searchResult,
      loading,
      error,
      searchByNumber
    };
  };

  export default useSearchByNumber;