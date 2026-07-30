const { tavily } = require("@tavily/core");

const client = tavily({
    apiKey: process.env.TAVILY_API_KEY
});

async function search(zoneName){

    const query=
`PVC panel dealers OR interior designers OR building material shops in ${zoneName}`;

    const response=await client.search(query,{

        topic:"general",

        searchDepth:"basic",

        maxResults:8

    });

    return response.results;
}

module.exports={search};