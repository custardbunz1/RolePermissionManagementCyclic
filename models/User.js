const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        username: { type: String, required: [true, 'username is required'], unique: true },
        password: { type: String, required: [true, 'password is required'] },
        role: { type: String, required: [true, 'role is required']}
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    // logging 
    console.log(this.password);
    try {
        //Hashes the password
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        console.log(this.password);
        next();
    } catch (e) {
        throw Error('Could not hash the password.');
    }
})

module.exports = mongoose.model("User", userSchema);