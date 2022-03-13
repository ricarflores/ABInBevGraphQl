const request = require("supertest")
const db = require("./db/mongodb.js")
const createServer = require("./index");
const app = createServer();


describe("Test Connection to db", () => {
    test("Db Simple Request", async () => {
        let database = await db.getClient();
        const result = await database.command({
            dbStats: 1,
        });
        expect(result.ok).toEqual(1)
    })
})

describe("Graphql Response", () => {
    jest.setTimeout(20000)
    test("Search Response", async () => {
        let postData = {
            query: `query getSearch($q: String!, $latitude: Float!, $longitude: Float!, $page: Int!, $rows:Int!){
                search(q: $q, latitude: $latitude, longitude: $longitude, page:$page, rows:$rows) {
                  q
                  latitude
                  longitude,
                  search {
                    suscess
                    error,
                    search {
                      longitude
                      name
                      latitude
                      country_code
                      score
                    },
                    pagination {
                      start
                      end
                      hasNextPage
                      hasPreviousPage
                      nextPage
                      previousPage
                      lastPage
                      itemsPerPage
                      totalDocuments
                      currentPage
                    }
                  }
                }
              }`,
            operationName: 'getSearch',
            variables: {
                "q": "london",
                "latitude": 43.70011,
                "longitude": -79.4163,
                "page": 1,
                "rows": 10
            }
        }
        const response = await request(app).post('/graphql').send(postData);
        let responseData = JSON.parse(response.text);
        let res = responseData.data.search;
        expect(res.search.suscess).toEqual(true)
    })
})
