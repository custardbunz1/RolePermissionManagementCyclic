const User = require("../models/User")
const bcrypt = require('bcrypt');

exports.create = async (req, res) => {
    try {
        const user = new User({ username: req.body.username, password: req.body.password, role: req.body.role});
        await user.save();
        res.redirect('/roles')
    } catch (e) {
        if (e.errors) {
            res.render('createUser', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) {
            res.render('/', { errors: { username: { message: 'Login invalid. Please enter correct username and password.' } } })
            return;
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.userID = user._id;
            console.log(user.password)
            console.log(req.session.userID);
            res.redirect('/roles');
            return
        }
        res.render('/', { errors: { password: { message: 'password does not match' } } })
    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}