'use strict';
const dbService = require("../db/mongodb.js");
const mongoUtilities = require("../db/aggregations.js");

exports.graphlSearch = async (params) =>{
    let result = {
        suscess: true,
        error: false,
        search :[],
        pagination :{}
    }
    try{
        let db = await dbService.getClient();
        if (!params.q || !params.latitude || !params.longitude)
        {
            return {
                suscess: false,
                error: true,
                search: []
            }
        }
        let pipeline = mongoUtilities.generalSearch(params);
        let data = await db.collection("City").aggregate(pipeline).toArray();
        if(data.length == 0)
        {
            return {
                suscess: true,
                error: null,
                search: [],
            }
        }
        let orderArray = data.sort((a,b) => a.validateGeo  - b.validateGeo);
        for(let i =0; i< orderArray.length; i++)
        {
            let score = 0;
            if(orderArray[i]['validateGeo'] == 0)
            {
                score = 1;
            }
            else{
                let toRest = ((Number(i+1))/ orderArray.length);
                if (toRest == 1)
                {
                    score = 0.99;
                }else{
                    score = score + toRest
                }
            }
            orderArray[i]['score'] = score;
            delete orderArray[i]['diffLat']
            delete orderArray[i]['diffLong']
            delete orderArray[i]['validateGeo']
        }
        let reverseArray = orderArray.reverse();
        let totalPipe = mongoUtilities.totalSearch(params);
        let total = await db.collection("City").aggregate(totalPipe).toArray();
        let getPagination = mongoUtilities.getPagination(total[0]['total'], params);
        result.search = reverseArray;
        result.pagination= getPagination;
    }catch(err){
        console.log(err)
        result.error = true;
        result.suscess = false;
    }
    finally{
        return result;
    }
}