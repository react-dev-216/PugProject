var AWS = require("aws-sdk");

// AWS creds in ~/.aws/credentials file
const config = require('../config/config.js');
AWS.config.update({
    region: global.gConfig.AWS_config_region,
    endpoint: global.gConfig.AWS_config_endpoint
});

var dynamodb = new AWS.DynamoDB();

var params = {
    TableName : "BJ_BootsMoon_Players"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});


var params = {
    TableName : "BJ_BootsMoon_PlayersArchive"
};

dynamodb.deleteTable(params, function(err, data) {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});