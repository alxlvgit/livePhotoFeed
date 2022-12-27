const { DEFAULT_HEADER } = require("./util/util");
const url = require('url');
const ejs = require("ejs");
const database = require("../database/data.json");
const { formidableImageUpload } = require("./helpers");
const path = require("path");


const controller = {
    getHomePage: async (request, response) => {
        try {
            const message = url.parse(request.url, true).query.message;
            const data = { database, msg: message ? message : "" }
            let html = await ejs.renderFile(__dirname + '/home.ejs', data);
            response.writeHead(200, DEFAULT_HEADER);
            response.end(html);
        } catch (error) {
            console.log(error);
        }
    },

    sendFormData: async (request, response) => {
        try {
            const userName = url.parse(request.url, true).query.userName;
            formidableImageUpload(userName, request, response);
        } catch (error) {
            console.log(error);
        }
    },

    getFeed: async (request, response) => {
        try {
            const userFromSearchParam = url.parse(request.url, true).query.username;
            const userData = database.filter((user) => user.username === userFromSearchParam)[0];
            const userObj = { userData };
            let html = await ejs.renderFile(path.join(__dirname, "feed.ejs"), userObj);
            response.writeHead(200, DEFAULT_HEADER);
            response.end(html);
        } catch (error) {
            console.log(error);
        }
    }
};


module.exports = controller;
