var DynamoDBModel = require('dynamodb-model');

var PlayerEntrySchema = new DynamoDBModel.Schema(
    {
        email: {
            type: String,
            key: 'hash'     // indicates a Hash key
        },
        game: String,
        first_name: String,
        last_name: String,
        username: String,
        score: Number,
        user_created: Number
    }
);

