const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;//By setting it to zero we will get all the documents on page 1 if we will not pass 
//the query.limit value in our query string.

//We have created a seperate file for pagination bcz for every endpoint route we want to have pagination.
function getPagination(query){
    const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
    const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
    const skip = (page - 1) * limit;
    return {
        skip,
        limit,
    };
}

module.exports = {
    getPagination
};
//NOTE --> We can pass query string like this --> (?limit=5&page=1)

