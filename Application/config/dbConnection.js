const mongoose = require('mongoose');

const connectToDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
    } catch (e) {
        console.error(e);
    }}

module.exports = connectToDb;