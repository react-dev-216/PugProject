
var AWS = require("aws-sdk");

// AWS creds in ~/.aws/credentials file
const config = require('../config/config.js');
AWS.config.update({
    region: global.gConfig.AWS_config_region,
    endpoint: global.gConfig.AWS_config_endpoint
});


var dynamodb = new AWS.DynamoDB();
var params = {
    TableName: "BJ_BootsMoon_Players",
    KeySchema: [
        { AttributeName: "username", KeyType: "HASH" },  //Partition key
        { AttributeName: "game", KeyType: "RANGE" }  //Sort key
    ],
    AttributeDefinitions: [
        { AttributeName: "username", AttributeType: "S" },
        { AttributeName: "game", AttributeType: "S" },
        { AttributeName: "score", AttributeType: "N" }
    ],
    ProvisionedThroughput: {
        ReadCapacityUnits: 5,
        WriteCapacityUnits: 5
    },
    GlobalSecondaryIndexes: [{
        IndexName: "PlayerScoreIndex",
        KeySchema: [
            {
                AttributeName: "game",
                KeyType: "HASH"
            },
            {
                AttributeName: "score",
                KeyType: "RANGE"
            }
        ],
        Projection: {
            ProjectionType: "ALL"
        },
        ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1
        }
    }
    ]
};
dynamodb.createTable(params, function (err, data) {
    if (err) {
        console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
});