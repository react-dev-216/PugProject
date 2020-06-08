var AWS = require("aws-sdk");
var fs = require('fs');
const random = require('random');


// AWS creds in ~/.aws/credentials file
const config = require('../config/config.js');
AWS.config.update({
    region: global.gConfig.AWS_config_region,
    endpoint: global.gConfig.AWS_config_endpoint
});

var docClient = new AWS.DynamoDB.DocumentClient();
console.log("Importing Players into Player. Please wait.");
var players = JSON.parse(fs.readFileSync('playerData.json', 'utf8'));
players.forEach(function (player) {
    var params = {
        TableName: "BJ_BootsMoon_Players",
        Item: {
            "game": "BJ_BootsMoon_v1",
            "email": player.email,
            "first_name": player.first_name,
            "last_name": player.last_name,
            "username": player.username,
            "score": random.int(0, 1000),
            "user_created": Date.now()
        }
    };
    docClient.put(params, function (err, data) {
        if (err) {
            console.error("Unable to add Player", player.email, ". Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("PutItem succeeded:", player.email);
        }
    });
});