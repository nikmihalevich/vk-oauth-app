const passport = require("passport");
const VKontakteStrategy = require("passport-vkontakte").Strategy;

const User = require("../models/UserModel");

const VKONTAKTE_APP_ID = process.env.VKAPPID;
const VKONTAKTE_APP_SECRET = process.env.VKAPPSECRET;

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new VKontakteStrategy(
        {
            clientID: VKONTAKTE_APP_ID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
            clientSecret: VKONTAKTE_APP_SECRET,
            callbackURL: "/auth/vkontakte/callback",
            lang: "ru",
        },
        // verify callback
        (accessToken, refreshToken, params, profile, done) => {
            // check if user already exists in our db
            User.findOne({ vkontakteId: profile.id }).then((currentUser) => {
                if (currentUser) {
                    // already have the user

                    // update access token to be able to make requests to the API
                    // because every token have expiry time
                    User.findByIdAndUpdate(
                        { _id: currentUser._id },
                        {
                            accessToken,
                        },
                    ).then((updatedUser) => {
                        done(null, updatedUser);
                    });
                } else {
                    // if not, create user
                    new User({
                        fullname: profile.displayName,
                        vkontakteId: profile.id,

                        // save accessToken for api requests
                        // may not be very safe, but
                        // it has expiry period
                        // for more security can be hashed with salt
                        // and encrypt-decrypt it on server
                        accessToken,
                    })
                        .save()
                        .then((newUser) => {
                            console.log("new user created: " + newUser);
                            done(null, newUser);
                        });
                }
            });
        },
    ),
);
