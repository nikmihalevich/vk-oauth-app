const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const cors = require("cors");
const inject = require("require-all");
const passport = require("passport");
const passportSetup = require("./config/passport-setup");

const middlewares = require("./middlewares");
const homeController = require("./controllers");

class Application {
    constructor() {
        this.app = express();
        this.controllers = inject(__dirname + "/controllers");
        this.router = express.Router;

        this.settings();
        this.middlewaresBefore();
        this.routes();
        this.middlewaresAfter();
    }

    settings = () => {
        // Application settings
        this.app.set("port", process.env.PORT || 3000);
        this.app.set("view engine", "ejs");
    };

    middlewaresBefore = () => {
        // middlewares
        this.app.use(express.static(__dirname + "/public"));
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(cors());
        this.app.use(
            cookieSession({
                maxAge: 24 * 60 * 60 * 1000,
                keys: [process.env.cookieKey],
            }),
        );

        //initialize passport
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    };

    middlewaresAfter = () => {
        // middleware that should be connected after routes
        this.app.use(middlewares.notFound);
        this.app.use(middlewares.errorHandler);
    };

    routes = () => {
        // routes
        this.app.use("/", homeController(this.router)); // home controller for main route
        // dynamic dependencies injection
        try {
            for (const name in this.controllers) {
                if (name !== "index")
                    this.app.use(
                        `/${name}`,
                        this.controllers[name](this.router),
                    );
            }
        } catch (e) {
            console.error(e);
        }
    };

    start = () => {
        this.app.listen(this.app.get("port"), () => {
            console.log(`> Server on port ${this.app.get("port")} running...`);
        });
    };
}

module.exports = Application;
