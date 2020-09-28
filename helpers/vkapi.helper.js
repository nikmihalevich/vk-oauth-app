const axios = require("axios");

// function for get friend list with static params
module.exports = async (method, params) => {
    try {
        const friends = await axios.get(
            `https://api.vk.com/method/${method}?${makeParams(params)}`,
        );
        return friends.data.response.items; // return array with friends
    } catch (e) {
        console.error(e);
    }
};

// convert the object to a parameter string
const makeParams = (params) => {
    let p = "";

    if (!params) return "";

    let i = 0; // counter/iterator
    for (param in params) {
        if (param === "fields") {
            // for fields param use map because there can be many fields
            p += param + "=";
            params[param].map((value, key) => {
                p += value;
                if (params[param].length - 1 > key) p += ","; // if field is not last add ,
            });
            p += "&";
        } else {
            p += param + "=" + params[param];
            if (Object.keys(params).length - 1 > i) p += "&"; // if param is not last add &
        }
        i++;
    }

    return p;
};
