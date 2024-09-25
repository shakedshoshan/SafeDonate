// Filter results where the associationNumber and keyword are found in the title or content
const processScrapedResults = (keyword, associationNumber, results) => {
    const filteredResults = results.filter(result => {
        const { title, content } = result;
        // return title.includes(keyword) || content.includes(keyword) 
        // && title.includes(associationNumber) || content.includes(associationNumber);
        // Check if both the keyword and associationNumber are in either title or content
        const isKeywordInTitleOrContent = title.includes(keyword) || content.includes(keyword);
        const isAssociationInTitleOrContent = title.includes(associationNumber) || content.includes(associationNumber);

        // Only approve results where both conditions are true
        return isKeywordInTitleOrContent && isAssociationInTitleOrContent;
    });

    console.log(`Results after Filtering for keyword '${keyword}':`, filteredResults);

    // Store the filtered results
    return {
        keyword,
        filteredResults
    };
}

module.exports = { processScrapedResults };

// Filter results where the associationNumber and keyword are found in the title or content
//             const filteredResults = searchResults.filter(result =>
//                 (result.title.includes(associationNumber) || result.content.includes(associationNumber)) &&
//                 (result.title.includes(keyword) || result.content.includes(keyword))
//             );

//             //console.log(`Filtered Results for keyword '${keyword}':`, filteredResults);

//             // Store the filtered results
//             results.push({
//                 keyword,
//                 filteredResults
//             });






