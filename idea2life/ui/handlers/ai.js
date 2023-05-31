/**
 * This is an example of how to document routes.
 * @module handlers_ai
 */

var CONFIG = require("./../../config.js");
var request = require("request");

/**
 * Send a post request to AI service with base64 image and runs the callback when results are available.
 * @param res - response object.
 * @param imageBase64 - base64 image clicked by the idea2life.
 * @param filename - default filename generated by system (unix timestamp)
 * @param callback - callback function (to be called when data from AI service is available)
 * @throws {object} If any error is encountered, the erorr received is of the format
 *  { data: erroData, category: 'error', msg: 'Error Message', title: 'Service/ Module Name'}
 */
function sendImageToAIService(res, imageBase64, filename, callback) {
  var requestData = {
    apiVersion: "2.1",
    context: "blank",
    data: { imgType: "base64", img: imageBase64 },
  };

  console.log(
    " sending data to AI server ",
    "http://" +
      CONFIG.external_services.ai.url +
      ":" +
      CONFIG.external_services.ai.port +
      "/svc"
  );

  request(
    {
      method: "POST",
      url:
        "http://" +
        CONFIG.external_services.ai.url +
        ":" +
        CONFIG.external_services.ai.port +
        "/svc",
      json: requestData,
      timeout: 240 * 1000,
      encoding: null,
    },
    (err, response, body) => {
      if (CONFIG.logging) {
        console.log(" got data from AI service", body);
      }

      if (err) {
        if (CONFIG.logging) {
          console.log("ERROR in sending request to AI server", err);
        }

        res.send(
          JSON.stringify({
            status: false,
            msg: "Could not connect to AI service. Make sure it is running with right config.",
            category: "error",
            title: "AI Service:",
          })
        );
      } else {
        var data = body;

        if (data.hasOwnProperty("error")) {
          res.send(
            JSON.stringify({
              status: false,
              msg: data.error.message,
              data: data.error,
              category: "error",
              title: "AI Service:",
            })
          );
        } else {
          callback(data);
        }
      }
    }
  );
}

module.exports.sendImageToAIService = sendImageToAIService;
