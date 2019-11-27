require('source-map-support/register');
module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! dotenv */ "dotenv").config();

const fs = __webpack_require__(/*! fs */ "fs");

const puppeteer = __webpack_require__(/*! puppeteer */ "puppeteer");

const loadFsas = __webpack_require__(/*! ./loadFsas */ "./src/loadFsas.js");

const data_dir = process.env.RESULTS_DIR || 'data';
const CLINIC_FINDER_URL = "https://clinicfinder.shoppersdrugmart.ca/";
const FSA_FILE = 'src/FSA.csv';

async function main() {
  const fsas = await loadFsas(FSA_FILE);

  try {
    const browser = await puppeteer.launch({
      headless: false
    });
    const page = await browser.newPage();

    async function getData(fsa) {
      await page.goto(CLINIC_FINDER_URL, {
        waitUntil: "networkidle2",
        timeout: 3000000
      });

      let s = t => new Promise(r => setTimeout(r, t));

      await page.waitForSelector("#search-input");
      await page.focus("#search-input");
      await page.keyboard.type(fsa);
      await page.focus("#search-input");
      await page.waitForSelector(".pac-container");
      await s(2000);
      await page.keyboard.press("ArrowDown");
      await s(1000);
      await page.click("body");
      await s(1000);
      await page.focus("#search-button");
      await page.click("#search-button");
      await s(2000);
      let data = await page.evaluate(() => {
        let searchResults = Array.from(document.querySelectorAll(".search-result"));
        return searchResults.map(result => {
          let name = result.querySelector("label.sb.purple").innerText;
          let city = result.querySelector("label.ssb.black-font").innerText;
          let address = result.querySelector("p.sr").innerText;
          let details = result.querySelector(".row:nth-child(2) > div:last-child .col:first-child > a").href;
          let directions = result.querySelector(".row:nth-child(2) > div:last-child .col:last-child > a").href;
          return {
            name,
            city,
            address,
            details,
            directions
          };
        });
      }); // save data as JSON

      await new Promise((resolve, reject) => {
        fs.writeFile(`./${data_dir}/` + fsa + "-data.json", JSON.stringify(data, null, 2), err => {
          if (err) {
            reject(err);
          } else {
            resolve();
            console.log(fsa + " Done.");
          }
        });
      });
    }

    for (let f of fsas) {
      await getData(f);
    }

    console.log("finished");
    browser.close(); // all done, close this browser
  } catch (error) {
    // if something went wrong display the error
    console.log(error);
  }
}

main();

/***/ }),

/***/ "./src/loadFsas.js":
/*!*************************!*\
  !*** ./src/loadFsas.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const fs = __webpack_require__(/*! fs */ "fs");

const parse = __webpack_require__(/*! csv-parse */ "csv-parse");

module.exports = file => {
  return new Promise(resolve => {
    const output = []; // Create the parser

    const parser = parse({
      delimiter: '\n'
    }); // Use the readable stream api

    parser.on('readable', function () {
      let record;

      while (record = parser.read()) {
        output.push(record);
      }
    }); // Catch any error

    parser.on('error', function (err) {
      console.error(err.message);
    }); // When we are done, test that the parsed output matched what expected

    parser.on('end', function () {
      // console.log('end', output)
      resolve(output);
    });
    parser.write(fs.readFileSync(file));
    parser.end();
  });
};

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/alex-wilmer/Projects/scrape-sdm/src/index.js */"./src/index.js");


/***/ }),

/***/ "csv-parse":
/*!****************************!*\
  !*** external "csv-parse" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("csv-parse");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("dotenv");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "puppeteer":
/*!****************************!*\
  !*** external "puppeteer" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("puppeteer");

/***/ })

/******/ });
//# sourceMappingURL=main.map