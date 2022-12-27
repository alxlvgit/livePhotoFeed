const { parse } = require("url");
const { DEFAULT_HEADER } = require("./util/util.js");
const controller = require("./controller");
const { createReadStream } = require("fs");
const path = require("path");
const { handleImages } = require("./helpers");


const allRoutes = {
  // GET: localhost:3000/
  "/:get": (request, response) => {
    controller.getHomePage(request, response);
  },
  // GET: localhost:3000/feed
  // Shows instagram profile for a given user
  "/feed:get": (request, response) => {
    controller.getFeed(request, response);
  },
  // POST: localhost:3000/form
  "/form:post": (request, response) => {
    controller.sendFormData(request, response);
  },
  // 404 routes
  default: (request, response) => {
    response.writeHead(404, DEFAULT_HEADER);
    createReadStream(path.join(__dirname, "views", "404.html"), "utf8").pipe(
      response
    );
  },
};

async function handler(request, response) {
  try {
    const { url, method } = request;

    const { pathname } = parse(url, true);
    const key = `${pathname}:${method.toLowerCase()}`;

    // handle loading of images
    const { query } = parse(url, true);
    await handleImages(key, pathname, query, allRoutes);

    const chosen = allRoutes[key] || allRoutes.default;
    return chosen(request, response);
  } catch (error) {
    handlerError(response);
  }
}

function handlerError(response) {
  return (error) => {
    console.log("Something bad has  happened**", error.stack);
    response.writeHead(500, DEFAULT_HEADER);
    response.write(
      JSON.stringify({
        error: "internet server error!!",
      })
    );

    return response.end();
  };
}

module.exports = handler;
