const mongoose = require('mongoose');
const app = require('./app.js')
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/sample');
    console.log("connected to db");
    const port = 3000
    app.listen(port, () => {
        console.log('Server is running on port 3000')
    })
}