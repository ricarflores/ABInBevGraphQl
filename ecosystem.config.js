module.exports = {
    apps:[
        {
            name:'GraphQl',
            script: './app/server.js',
            instance: 1,
            autorestart: true,
            watch: false,
            env:{
                port: 3030
            }
        }
    ]
}