const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const Promise = require("bluebird");

module.exports = (()=>{
    'use strict';

    class MongoDB{
        constructor()
        {
            const fs = require("fs");
            const fileConfig = require("../config/global.js");
            this.config = fileConfig;
            this.urlMong = 'mongodb://'+this.config.db.user+ ":"+this.config.db.password+"@"+this.config.db.ip+":"+this.config.db.port+"/admin"
            if(fs.existsSync('./config/local.js') || fs.existsSync('./app/config/local.js'))
            {
                const configLocal = require("../config/local.js");
                this.config = configLocal
                this.urlMong = 'mongodb://'+this.config.db.ip+":"+this.config.db.port+"/"
            }
        }
        getClient()
        {
            let parent = this;
            return new Promise((resolve,reject)=>{
                try{
                    MongoClient.connect(parent.urlMong, parent.config.db.option, function(err,client){
                        if(err)
                        {
                            reject(err)
                        }
                        resolve(client.db(parent.config.db.namedb));
                        parent.db = client;
                        return;
                    });
                }catch(e){ 
                    console.log(e);
                    resolve(e);
                }
            });
        }
    }
    return new MongoDB();
})();