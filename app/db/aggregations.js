module.exports = (()=>{
    'use strict';

    class Aggregations{
        totalSearch(params){
            let pipe;
            try{
                pipe = [
                    {
                        $match:{
                            name: {
                                $regex: "^"+params['q'] , $options: 'i'
                            }
                        }
                    },
                    {
                        $project:{
                            '_id': 0,
                            'name': 1
                        }
                    },
                    {
                        $count: "total"
                    }
                ]
                return pipe;
            }catch(err){
                console.log(err);
                return null;
            }finally{
                return pipe
            }
        }
        generalSearch(params){
            let pipe;
            try{
                let skip = ((Number(params['page']- 1)) * Number(params['rows']));
                pipe = [
                    {
                        $match:{
                            name: {
                                $regex: "^"+params['q'] , $options: 'i'
                            }
                        }
                    },
                    {
                        $sort:{
                            name: 1
                        }
                    },
                    {
                        $skip:skip
                    },
                    {
                        $limit: Number(params['rows'])
                    },
                    {
                        $addFields:{
                            diffLat:{
                                $subtract:["$latitude", parseFloat(params['latitude'])]
                            }
                        }
                    },
                    {
                        $addFields:{
                            diffLong:{
                                $subtract:["$longitude", parseFloat(params['longitude'])]
                            }
                        }
                    },
                    {
                        $addFields:{
                            validateGeo:{
                                $add:['$diffLat','$diffLong']
                            }
                        }
                    },
                    {
                        $project:{
                            '_id': 0,
                            'name': 1,
                            'longitude': 1,
                            'latitude': 1,
                            'geoip.location': 1,
                            'country_code': 1,
                            "diffLat":1,
                            "diffLong":1,
                            "validateGeo":1
                        }
                    }
                ]
            }catch(err){
                console.log(err);
                return null;
            }finally{
                return pipe;
            }
        }
        getPagination(totalItems, params)
        {
            try{
                let currentPage = parseInt(params.page, 10) || 1;
                let itemsPerPage = parseInt(params.rows) || 10;
                let result = {'start':1, 'end': itemsPerPage}
                if ((itemsPerPage * currentPage) > totalItems){
                    result['start'] = (currentPage * itemsPerPage) - (itemsPerPage + 1)
                    result['end'] = totalItems
                } else if (currentPage > 1){
                    result['start'] = (currentPage * itemsPerPage) - (itemsPerPage -1)
                    result['end'] = (currentPage * itemsPerPage)
                }
                result['hasNextPage'] = (itemsPerPage * currentPage) < totalItems
                result['hasPreviousPage'] = currentPage > 1
                result['nextPage'] = currentPage + 1
                result['previousPage'] = currentPage -1
                result['lastPage'] = Math.ceil(totalItems / itemsPerPage)
                result['itemsPerPage'] = itemsPerPage
                result['totalDocuments'] = totalItems
                result['currentPage'] = currentPage
                if(result.start == 1){
                    result.start = 0;
                }
                if (result.start == -1){
                    result.start = 0
                }
                return result;
            }catch(err){
                console.log(err);
                return 0;
            }
        }
    }
    return new Aggregations();
})();