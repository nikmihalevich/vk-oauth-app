const passport = require("passport");

module.exports = (router) => {
    const routes = router();

    // auth with vk
    routes.get(
        "/vkontakte",
        passport.authenticate("vkontakte", {
            scope: [
                "friends", // permissions for get user friend list
                // "offline", // for get access token without expiry period
            ],
        }),
        (req, res) => {
            // the request will be redirected to vk.com for authentication
            // with extended permissions.
            // this function will not be called.
        },
    );

    // callback route for vk to redirect to
    routes.get(
        "/vkontakte/callback",
        passport.authenticate("vkontakte"),
        (req, res) => {
            // successful authentication, redirect to home.
            res.redirect("/");
        },
    );

    // auth logout
    routes.get("/logout", (req, res) => {
        // handle with passport
        req.logout();
        res.redirect("/");
    });

    return routes;
};
