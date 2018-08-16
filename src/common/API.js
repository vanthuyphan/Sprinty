/**
 * Created by Van Phan
 */
"use strict";

let CryptoJS = require('crypto-js');
let md5 = require('crypto-js/md5');
let AES = require('crypto-js/aes');
let sha256 = require('crypto-js/sha256');
let latin1 = require('crypto-js/enc-latin1');
let moment = require('moment');
let axios = require('axios');
let $ = require('jquery');
let MY_SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/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';
let slack = require('slack-notify')(MY_SLACK_WEBHOOK_URL);

import tracker from "../common/tracker.js";
const domain = "http://127.0.0.1:8080"
    , secret_key = "";

const TokenTypes = {
    ShortTermToken: 0, // token ngắn hạn
    LongTermToken: 1 // token dài hạn
};

const os = 3;
const ilt = TokenTypes.LongTermToken;
const sot = 2; // sort order ???

/**
 * Encrypt password with md5, AES
 * @param password
 * @param timestamp
 * @returns {string}
 */
function encryptPassword(password, timestamp) {
    const passwordMD5 = md5(password).toString();
    const key = latin1.parse(sha256(timestamp).toString().substring(0, 16));
    return AES.encrypt(passwordMD5, key, {
        iv: key,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    }).ciphertext.toString(CryptoJS.enc.Base64);
}

/**
 * Generate signature.
 * @param args params for signature
 */
function genSignature() {
    let signatureInput = '';
    for (let i = 0; i < arguments.length; i++) {
        signatureInput += arguments[i] + '|';
    }
    signatureInput += secret_key;
    return sha256(signatureInput).toString();
}

/**
 * Async login function
 * @param mob = phone number
 * @param password = password
 * @param did = fcmToken
 * @returns {Promise}
 */
exports.login = (username, password, cb) => {
    console.log("API", "/login");

    const url = domain + '/login';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password})
    };
    console.log("Data", data);
    request(data, function (err, body) {
        cb(err, body);
    });
}

exports.loadUser = (id, cb) => {
    console.log("API", "/user");

    const url = domain + '/user/' + id;
    const data = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    console.log("Data", data);
    getRequest(data, function (err, body) {
        cb(err, body);
    });
}

exports.loadReport = (cb) => {
    console.log("API", "/activity/getall");

    const url = domain + '/activity/getall';
    const data = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    console.log("Data", data);
    getRequest(data, function (err, body) {
        cb(err, body);
    });
}

exports.loadTasks = (cb) => {
    console.log("API", "/task/getall");

    const url = domain + '/task/getall';
    const data = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    console.log("Data", data);
    getRequest(data, function (err, body) {
        cb(err, body);
    });
}

exports.createUser = (username, firstname, lastname, avatar, password, cb) => {
    console.log("API", "/user");

    const url = domain + '/user/create';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, firstname, lastname, avatar,  password})
    };
    console.log("Data", data);
    request(data, function (err, body) {
        cb(err, body);
    });
}

exports.updateUser = (id, username, firstname, lastname, avatar, password, cb) => {
    console.log("API", "/user/update");

    const url = domain + '/user/update/' + id;
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, firstname, lastname, avatar,  password})
    };
    console.log("Data", data);
    request(data, function (err, body) {
        cb(err, body);
    });
}

exports.createTask = (content, included, cb) => {
    console.log("API", "/task");

    const url = domain + '/task/create';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({content, included})
    };
    console.log("Data", data);
    request(data, function (err, body) {
        cb(err, body);
    });
}

exports.count = (cb) => {
    console.log("API", "/count");

    const url = domain + '/count';
    const data = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    console.log("Data", data);
    getRequest(data, function (err, body) {
        cb(err, body);
    });
}

exports.getUsers = (cb) => {
    console.log("API", "/user/getall");

    const url = domain + '/user/getall';
    const data = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    console.log("Data", data);
    getRequest(data, function (err, body) {
        cb(err, body);
    });
}

exports.changeStatus = (id, status, cb) => {
    console.log("API", "/user/status/" + id);

    const url = domain + "/user/status/" + id;
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({status})
    };
    console.log("Data", data);
    request(data, function (err, body) {
        cb(err, body);
    });
}

exports.removeUser = (id, cb) => {
    console.log("API", "/user/delete/" + id);

    const url = domain + "/user/delete/" + id;
    const data = {
        method: 'GET',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    };
    console.log("Data", data);
    getRequest(data, function (err, body) {
        cb(err, body);
    });
}

exports.logout = (username, cb) => {
    console.log("API", "/logout");

    const url = domain + '/logout';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username})
    };
    request(data, function (err, body) {
        cb(err, body);
    });
}

/**
 * Register new account with this phone number
 * @param mob phone number
 * @param did fcm token
 * @returns {Promise}
 */
exports.register = (username, firstname, lastname, password, role, cb) => {
    console.log("API", "/register");
    const url = domain + '/register';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, firstname, lastname, password, role})
    };
    console.log("Request", data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}


const httpClient = axios.create(); // create instance to make Timeout feature works

function getRequest(data, callback) {
    let headers = {
        'Content-type': 'application/json'
    };
    if (data.headers.Authentication) {
        headers['Authentication'] = data.headers.Authentication;
    }
    const authOptions = {
        method: 'GET',
        url: data.url,
        headers: headers,
        data: data.body,
        json: true,
        timeout: 60000,
    };

    const track = tracker.section(data.url, domain);
    return httpClient(authOptions)
        .then(function (response) {
            try {
                track();
                handleResponse(data.url, data, response.data, callback);
            } catch (e) {
                tracker.print(e, "error");
                console.error(e);
            }
        })
        .catch(function (error) {
            console.log("################");
            track(error);
            if (error) tracker.print(error, "Backend.HttpError");
            callback(error, data);
        });
}

function request(data, callback) {
    let headers = {
        'Content-type': 'application/json'
    };
    if (data.headers.Authentication) {
        headers['Authentication'] = data.headers.Authentication;
    }
    const authOptions = {
        method: 'POST',
        url: data.url,
        headers: headers,
        data: data.body,
        json: true,
        timeout: 60000,
    };

    const track = tracker.section(data.url, domain);
    return httpClient(authOptions)
        .then(function (response) {
            try {
                track();
                handleResponse(data.url, data, response.data, callback);
            } catch (e) {
                tracker.print(e, "error");
                console.error(e);
            }
        })
        .catch(function (error) {
            console.log("################");
            track(error);
            if (error) tracker.print(error, "Backend.HttpError");
            callback(error, data);
        });
}

function handleResponse(url, req, res, callback) {
    callback(undefined, res);
    return;
    if (!res || res.code === undefined) {
        callback(res, res);
        return;
    }
    switch (res.code) {
        case 0:
            callback(undefined, res);
            break;
        case 408:
            callback(undefined, res);
            console.log("Session expired, please login again!");
            return;
        case 500:
        default:
            callback(res, res)
            tracker.print(req.url + "\n " + JSON.stringify(res), domain);
    }
}
