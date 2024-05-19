const paginationOutPut = async (currentCompany, page, limit, totalCount) => {
    const currentPagination = {
        list: typeof currentCompany == "string" ? parseInt(currentCompany) : currentCompany,
        pageNumber : typeof page == "string" ? parseInt(page) : page,
        pageSize: typeof limit == "string" ? parseInt(limit) : limit,
        totalRecords: typeof totalCount == "string" ? parseInt(totalCount) : totalCount
    }
    return currentPagination;
}

module.exports= {
    paginationOutPut 
}

