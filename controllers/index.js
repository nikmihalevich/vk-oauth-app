const vkApiHelper = require("../helpers/vkapi.helper");

module.exports = (router) => {
    const routes = router();

    routes.get("/", async (req, res) => {
        let friends = [];
        if (req.user) {
            try {
                friends = await vkApiHelper(
                    "friends.search", // method from vk api docs for get friend list with params
                    {
                        count: 5, // amount of friends
                        fields: ["photo_100"], // fields with information about friends
                        access_token: req.user.accessToken, // our access token
                        v: 5.124, // API version which we want use
                    },
                );
                if (!friends) friends = [];
            } catch (e) {
                console.error(e);
            }
        }
        res.render("home", { user: req.user, friends });
    });

    return routes;
};
