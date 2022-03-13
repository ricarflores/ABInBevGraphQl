const express = require('express');
const app = express();
const searchController = require("./controllers/search.js");
const graphExpress = require('express-graphql').graphqlHTTP;
const { buildSchema } = require('graphql');

const schema = buildSchema(`
    type Query {
        search(q: String!, latitude: Float!, longitude:Float!, page:Int!, rows:Int!): Search
    }

    type Search {
        q: String,
        latitude: Float,
        longitude: Float,
        page:Int,
        rows:Int,
        search: SearchResult
    }
    type SearchResult {
        suscess: Boolean,
        error: Boolean,
        search: [dbResultModel],
        pagination: Pagination
    }
    type dbResultModel {
        longitude: Float,
        name: String,
        latitude: Float,
        country_code: String
        score: Float
    }
    type Pagination {
        start: Int,
        end: Int,
        hasNextPage: Boolean,
        hasPreviousPage: Boolean,
        nextPage:Int,
        previousPage:Int,
        lastPage: Int,
        itemsPerPage:Int,
        totalDocuments:Int,
        currentPage: Int
    }
`);

let getSearch = async (args) =>{
    let q = args.q;
    let latitude = args.latitude;
    let longitude = args.longitude;
    let page = args.page;
    let rows = args.rows
    let params = {q, latitude, longitude, page, rows};
    let result = await searchController.graphlSearch(params);
    params.search = result;
    return params;
}

const root = {
    search: getSearch
}

const createServer  = () =>{
    app.use('/graphql', graphExpress({
        schema: schema,
        rootValue: root,
        graphiql: true
    }));
    
    return app;
} 

module.exports = createServer;