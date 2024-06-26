const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = () => {
    passport.use(new localStrategy({
        usernameField: 'username', // req.body.username
        passwordField: 'password', // req.body.password
    }, async (username, password, done) => {
        try{
            const exUser = await User.findOne({ where: { username } });
            if(exUser){
                const result = await bcrypt.compare(password, exUser.password);
                if(result){
                    done(null, exUser);
                } else {
                    done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
                }
            } else {
                done(null, false, { message: '가입되지 않은 회원입니다.' });
            }
        } catch(error){
            console.error(error);
            done(error);
        }
    }));
};