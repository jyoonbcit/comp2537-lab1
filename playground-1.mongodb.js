// Select the database to use.
use('sample');

/**
db.w1users.updateOne(
    {
    username: 'user1'
    },
    {
        $set: {
            password: '$2b$10$A5/8PzRQHvcA8TR5R.G9SecKz8HFud3zV.h2el.RudWaoB0hYX37i'
        }
    }
)
*/


db.w1users.find();