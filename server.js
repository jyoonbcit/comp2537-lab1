const mongoose = require('mongoose');
const app = require('./app.js')
// dotenv allows you to obscure variables using .gitignore and .env
const dotenv = require('dotenv');
dotenv.config();

// Main function needs to be called after inputting environment variables
main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(`mongodb+srv://${process.env.ATLAS_DB_USER}:${process.env.ATLAS_DB_PASSWORD}@cluster0.e6ipsvv.mongodb.net/sample?retryWrites=true&w=majority`);
    console.log("connected to db");
    const port = 3000
    app.listen(port, () => {
        console.log('Server is running on port 3000')
    })
}