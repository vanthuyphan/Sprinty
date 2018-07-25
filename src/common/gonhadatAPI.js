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
// const domain = "http://dev.gonhadat.net"
// const domain = "http://127.0.0.1:6878"
const domain = "https://teranhadat.vn"
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
exports.login = (mob, password, cb) => {
    console.log("API" , "/user/log-in-dashboard");

    const url = domain + '/user/log-in-dashboard';
    const did = '000000000000000000000';
    const tmp = moment().valueOf().toString();
    const pwd = encryptPassword(password, tmp);
    const sig = genSignature(mob, pwd, ilt, os, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mob, pwd, ilt, did, os, tmp, sig})
    };
    request(data, function (err, body) {
        cb(err, body);
    });
}

exports.logout = (tok, cb) => {
    console.log("API" , "/user/log-out");
    const url = domain + '/user/log-out';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

/**
 * Register new account with this phone number
 * @param mob phone number
 * @param did fcm token
 * @returns {Promise}
 */
exports.register = (mob, cb) => {
    console.log("API" , "/user/register");
    const fin = mob;
    const lan = '';
    const ime = '0';
    const did = 'device';
    const url = domain + '/user/register';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(mob, fin, lan, did, ime, os, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            mob,
            fin,
            lan,
            did,
            ime,
            os,
            tmp,
            sig
        })
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}


/**
 * Ask server to reset this phone password and send the new password via OTP
 * @param mob phone number
 * @returns {Promise}
 */
exports.forgetPassword = (mob, cb) => {
    console.log("API" , "/user/reset-password")
    const url = domain + '/user/reset-password';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(mob, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({mob, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

/**
 * Change user password
 * @param tok user token
 * @param _opw old password
 * @param _npw new password
 * @returns {Promise}
 */
exports.changePassword = (tok, _opw, _npw, cb) => {
    console.log("API" , "/user/change-password")
    const url = domain + '/user/change-password';
    const tmp = moment().valueOf().toString();
    const opw = encryptPassword(_opw, tmp);
    const npw = encryptPassword(_npw, tmp);
    const sig = genSignature(tok, opw, npw, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, opw, npw, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

exports.search = (body, cb) => {
    console.log("API" , "/public/add-request")
    const url = domain + '/public/add-request';
    const are = body.are || '';
    const typ = body.typ || '';
    const pri = body.pri || '';
    const queryUrl = body.url || '';
    const city = body.city || '';
    const dis = body.dis || '';
    const nob = body.nob == -1 ? '' : body.nob;
    const now = body.now == -1 ? '' : body.now;
    const tit = body.tit || '';
    const war = body.war || '';
    const mode = body.mode || '';
    const leg = body.leg instanceof Array ? body.leg : [body.leg];
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tit, tmp);
    var body = {tmp, sig};
    body.tit = tit;
    if (!!are) body.are = are;
    if (!!dis) body.dis = dis;
    if (!!pri) body.pri = pri;
    if (!!typ && typ != 0) body.typ = typ;
    if (!!nob) body.nob = nob;
    if (!!now) body.now = now;
    if (!!queryUrl) body.url = queryUrl;
    if (!!mode) body.mode = mode;
    if (!!city) body.cit = city;
    if (!!war) body.war = war;
    if (leg && leg.length > 0 && !!leg[0]) body.leg = leg;

    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

exports.searchResult = (rid, psi, pag, cb) => {
    console.log("API" , "/public/request-result")
    const url = domain + '/public/request-result';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(rid, pag, psi, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tmp, rid, psi, pag, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

exports.getNewestListings = (pag, psi, cb) => {
    console.log("API" , "/public/listing-newest")
    const url = domain + '/public/listing-newest';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(pag, psi, tmp);

    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pag, psi, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

exports.getListingsOnLocation = (model, cb) => {
    console.log("API" , "/public/listing-newest")
    const url = domain + '/public/listing-newest';
    const tmp = moment().valueOf().toString();
    const pag = model.page;
    const psi = 20;
    const sig = genSignature(pag, psi, tmp);

    var body = {pag, psi, tmp, sig};
    if (!!model.city) body.cityId = model.city;
    if (!!model.district) body.districtId = model.district;
    if (!!model.ward) body.wardId = model.ward;
    if (!!model.type && model.type != 0) body.type = model.type;
    if (!!model.model) body.mode = model.model;

    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

exports.getListingsForSiteMap = (pag, cb) => {
    console.log("API" , "/public/listing-newest")
    const url = domain + '/public/listing-newest';
    const tmp = moment().valueOf().toString();
    const psi = 100;
    const sig = genSignature(pag, psi, tmp);

    var body = {pag, psi, tmp, sig};
    body.mode = 1;
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}


exports.getNewestProjects = (pag, psi, cb) => {
    console.log("API" , "/public/project")
    const url = domain + '/public/project';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(pag, psi, tmp);

    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pag, psi, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

exports.getFeatureListings = (pag, psi, cb) => {
    console.log("API" , "/public/listing-feature")
    const url = domain + '/public/listing-feature';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(pag, psi, tmp);

    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pag, psi, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

exports.getPost = (lid, cb) => {
    console.log("API" , "/public/listing-detail")
    const url = domain + '/public/listing-detail';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(lid, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({lid, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

exports.getProject = (pid, cb) => {
    console.log("API" , "/public/project-detail")
    const url = domain + '/public/project-detail';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(pid, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({pid, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

/**
 * Update user info: avatar, username
 * @param tok
 * @param user
 * @returns {Promise.<*>}
 */
exports.updateUser = (tok, user, cb) => {
    console.log("API" , "/user/account-update")
    const uid = user.uid;
    const url = domain + '/user/account-update';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, uid, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({fin: user.fin, ava: user.ava, tok, uid: uid, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

/**
 * Update image using image path
 * @param images base64 images array
 * @param callback callback
 * @returns {Promise}
 */
exports.uploadImages = (images, cb) => {
    console.log("API" , "/upload/base64-scale")
    const url = domain + '/upload/base64-scale';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({images})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

/**
 * Update images using image path
 * @param images base64 images array
 * @returns {Promise}
 */
exports.uploadImagesNoScaleAsync = (images, cb) => {
    console.log("API" , "/upload/base64")
    const url = domain + '/upload/base64';
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({images})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

/**
 * Get posts
 * @param tok token from login process
 * @param key search keyword
 * @param pag page number
 * @param psi post per page
 * @returns {Promise}
 */
exports.getUserPosts = (tok, key, pag, psi, lsi, cb) => {
    psi = 20;
    console.log("API" , "/listing/search")
    const url = domain + '/listing/search';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, key, pag, psi, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({sot, tmp, tok, pag, psi, key, lsi, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

/**
 * Add a new listing
 * @param tok user token
 * @param post a post data
 * @returns {Promise}
 */
exports.addPost = (tok, post, cb) => {
    console.log("API" , "/listing/add")
    const tit = post.tit;
    const url = domain + '/listing/add';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tit, tmp);
    var body = {
        mode: post.mode, tit: post.tit,
        pri: post.pri, are: post.are, des: post.des,
        dir: post.dir, typ: post.typ, leg: post.leg,
        unit: post.unit, acc: 3, img: post.img, add: post.add,
        lon: post.lon, lat: post.lat, war: post.war, cna: post.cna,
        dna: post.dna, rou: post.rou
    };

    let type2 = post.typ;
    if (type2 == 3 || type2 == 2) {
        body.now = post.now;
        body.nob = post.nob;

    } else if (type2 == 3) {
        body.nof = post.nof;
    }
    body.fac = JSON.parse(post.fac);
    body.fea = JSON.parse(post.fea);
    body.tok = tok;
    body.tmp = tmp;
    body.sig = sig;
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify(body)
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

/**
 * Get posts
 * @param tok token from login process
 * @param key search keyword
 * @param pag page number
 * @param psi post per page
 * @returns {Promise}
 */
exports.getUSPosts = (tok, key, pag, psi, lsi, cb) => {
    console.log("API" , "/listing/search")
    const url = domain + '/listing/search';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, key, pag, psi, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({sot, tmp, tok, pag, psi, key, lsi, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

/**
 * Delete listing
 * @param tok user token
 * @param lid listing id
 * @returns {Promise}
 */
exports.deletePost = (tok, lid, cb) => {
    console.log("API" , "/listing/delete")
    const url = domain + '/listing/delete';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, lid, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, lid, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

/**
 * Add a new listing
 * @param tok user token
 * @param post a post data
 * @returns {Promise}
 */
exports.addPost = (tok, post, cb) => {
    console.log("API" , "/listing/add")
    const tit = post.tit.toTitleCase();
    const url = domain + '/listing/add';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tit, tmp);
    var body = {
        mode: post.mode, tit: tit,
        pri: post.pri, are: post.are, des: post.des,
        dir: post.dir, typ: post.typ, leg: post.leg,
        unit: post.unit, acc: 3, img: post.img, add: post.add,
        lon: post.lon, lat: post.lat, war: post.war, cna: post.cna,
        dna: post.dna, rou: post.rou
    };

    let type2 = post.typ;
    if (type2 == 3 || type2 == 2) {
        body.now = post.now;
        body.nob = post.nob;

    } else if (type2 == 3) {
        body.nof = post.nof;
    }
    body.fac = JSON.parse(post.fac);
    body.fea = JSON.parse(post.fea);
    body.tok = tok;
    body.tmp = tmp;
    body.sig = sig;
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify(body)
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        cb(err, body);
    });
}

exports.updatePost = (tok, post, cb) => {
    console.log("API" , "/listing/update")
    const lid = post.lid;
    const tit = post.tit.toTitleCase();
    const url = domain + '/listing/update';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, lid, tit, tmp);
    var body = {
        lid: post.lid,
        mode: post.mode, tit: tit, nof: post.nof,
        pri: post.pri, are: post.are, des: post.des,
        dir: post.dir, typ: post.typ, leg: post.leg,
        unit: post.unit, acc: 3, img: post.img,
        war: post.war, cna: post.cna, lat: post.lat, lon: post.lon,
        dna: post.dna, rou: post.rou, add: post.add
    };

    let type2 = post.typ;
    if (type2 == 1 || type2 == 3) {
        body.now = post.now;
        body.nob = post.nob;

    } else if (type2 == 3) {
        body.nof = post.nof;
    }
    if (!!post.lon && !!post.lat) {
        body.lon = post.lon;
        body.lat = post.lat;
    }
    body.fac = JSON.parse(post.fac);
    body.fea = JSON.parse(post.fea);
    body.tok = tok;
    body.tmp = tmp;
    body.sig = sig;
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify(body)
    };
    console.log("Request" , data.body);
    request(data, function (err, httpResponse, body) {
        console.log("Response" , body);
        cb(err, body);
    });
}

exports.getUserPost = (tok, lid, cb) => {
    console.log("API" , "/listing/detail")
    const url = domain + '/listing/detail';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, lid, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, lid, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

exports.getCities = (cb) => {
    console.log("API" , "/map/get-city")
    const countryId = 1;
    const url = domain + '/map/get-city';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(countryId, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({countryId, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

exports.getDistricts = (cityId, cb) => {
    console.log("API" , "/map/get-district")
    const url = domain + '/map/get-district';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(cityId, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({cityId, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

exports.getRequestOnUrl = (url, cb) => {
    console.log("API" , "/public/request-by-url")
    const baseUrl = domain + '/public/request-by-url';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(url, tmp);
    const data = {
        method: 'POST',
        url: baseUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({url, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, url) => {
        if (url.city && url.city.length > 0) {
            url.city = url.city[0];
        }
        cb(err, url);
    });
}

exports.getUrls = (cb) => {
    console.log("API" , "/public/request-urls")
    const baseUrl = domain + '/public/request-urls';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tmp);
    const data = {
        method: 'POST',
        url: baseUrl,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, httpResponse, body) => {
        cb(err, body);
    });
}

String.prototype.toTitleCase = function() {
    var parts = this.trim().split(' ');
    var result = '';
    parts.forEach(part => {
        let s = part.charAt(0);
        result += s.toUpperCase() + part.slice(1).toLowerCase() + " ";
    });
    return result;
};


const httpClient = axios.create(); // create instance to make Timeout feature works

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
            reportError(data.url, data, error);
            callback(error, data);
        });
}

function handleResponse(url, req, res, callback) {
    if (!res || res.code === undefined) {
        callback(res, res);
        return;
    }
    switch(res.code) {
        case 0:
            callback(undefined, res);
            break;
        case 408:
            callback(undefined, res);
            console.log("Session expired, please login again!");
            return;
        case 500:
            reportError(url, req, res);
        default:
            callback(res, res)
            tracker.print(req.url + "\n " + JSON.stringify(res), domain);
    }
}

exports.uploadFile = function(tok, file, callback) {
    let data = new FormData();
    data.append('file', file);
    data.append('name', file.name);
    let url = domain + '/upload/csv';
    let filename = file.name.replace(new RegExp("- messages.CSV" + '$'), "");
    const ss = tracker.section(url);
    axios.post(url, data)
        .then(function (response) {
            ss();
            try {
                if (response.status == 200 && response.data && response.data.code == 0) {
                    return sendViberFile(tok, filename, response.data.data[0], callback);
                }
                callback(response);
            } catch (e) {
                console.error(e);
            }
        })
        .catch(function (error) {
            ss(error);
            console.error(error);
        });
};

function sendViberFile(tok, filename, url, callback) {
    const requestUrl = domain + '/dashboard/upload-viber-history/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const gName = filename;
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, tmp, sig, url, gName})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        callback(err, body);
    });

}

exports.getGroups = (tok, pag, psi, cb) => {
    const requestUrl = domain + '/dashboard/viber-group/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, pag, psi, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, psi, pag, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.updateGroupsOrder = (tok, ids, cb) => {
    const requestUrl = domain + '/dashboard/update-active-group/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, ids, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.fetchMessage = (tok, cb) => {
    const requestUrl = domain + '/dashboard/fetch-viber-message/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.createViberMessages = (tok, id, message, mobile, listings, requests, cb) => {
    const requestUrl = domain + '/dashboard/create-viber-message/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, id, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, id, message, mobile, listings, requests, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.deleteViberMessage = (tok, id, cb) => {
    const requestUrl = domain + '/dashboard/delete-viber-message/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, id, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, id, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.getFacebookGroups = (tok, cb) => {
    const requestUrl = domain + '/dashboard/get-facebook-group-info/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, sig, tmp})
    };
    request(data, (err, body) => {
        console.log("XX");
        console.log(err);
        console.log(body);
        cb(err, body);
    });
};

exports.getListingCategory = (tok, cb) => {
    const requestUrl = domain + '/dashboard/get-listing-category/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.uploadFacebookHistory = (tok, gId, since,  cb) => {
    const requestUrl = domain + '/dashboard/upload-facebook-feed/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, gId, since, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.refreshListingTime = (tok, messId,  cb) => {
    const requestUrl = domain + '/dashboard/refresh-listing-time/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, messId, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.skipMessage = (tok, id,  cb) => {
    const requestUrl = domain + '/dashboard/skip-viber-message/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, id, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, id, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}


exports.getLandmarkInfo = (tok, cb) => {
    const requestUrl = domain + '/dashboard/get-landmark-info/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, sig, tmp})
    };
    console.log("Request", data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.getProjectInfo = (tok, cb) => {
    const requestUrl = domain + '/dashboard/get-project-info/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, sig, tmp})
    };
    console.log("Request", data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.createLandmark = (tok, landmarkList, cb) => {
    const requestUrl = domain + '/dashboard/create-landmark/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    console.log(landmarkList);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok,landmarkList, sig, tmp})
    };
    console.log("Request", data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.searchLandmark = (tok, landmarkName, cb) => {
    const requestUrl = domain + '/dashboard/search-landmark-info/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok,landmarkName, sig, tmp})
    };
    console.log("Request", data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}


exports.getIncorrectParsedMessages = (tok, numberOfMessage, diffFields, cb) => {
    const requestUrl = domain + '/dashboard/get-incorrect-parsed-messages/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, numberOfMessage, diffFields, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.searchProject = (tok, projectTitle, cb) => {
    const requestUrl = domain + '/dashboard/search-project-info/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok,projectTitle, sig, tmp})
    };
    console.log("Request", data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

function reportError(url, req, res) {
    console.warn("SLACK REPORTING HAS BEEN SKIPPED");
    return; // DONT WRITE LOG
    slack.send({
        channel: '#bug-dashboard',
        icon_url: 'http://example.com/my-icon.png',
        text: 'Error posting to: ' + url + " from " + window.location,
        username: 'Jimmy',
        fields: {
            'request': JSON.stringify(req),
            'response': JSON.stringify(res)
        }
    });
}


exports.getCityList = (tok,cb) => {
    const countryId = 1;
    const url = domain + '/dashboard/get-city-list';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, countryId, tmp, sig})
    };
    console.log("getCityList Request: " , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.getDistrictList = (tok, cityIds, cb) => {
    const url = domain + '/dashboard/get-district-list';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, cityIds, tmp, sig})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
};


exports.getGroupFilter  = (tok, cb) => {
    const requestUrl = domain + '/dashboard/get-group-filter/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}


exports.setGroupFilter  = (tok, groupFilter, cb) => {
    const requestUrl = domain + '/dashboard/set-group-filter/';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: requestUrl,
        headers: {
            'Content-Type': 'application/json',
            Authentication: tok
        },
        body: JSON.stringify({tok, groupFilter, sig, tmp})
    };
    console.log("Request" , data.body);
    request(data, (err, body) => {
        cb(err, body);
    });
}

exports.user = {};
exports.user.account_detail = (tok, uid, cb) => {
    const url = domain + '/dashboard/get-account-detail';
    const tmp = moment().valueOf().toString();
    const sig = genSignature(tok, tmp);
    const data = {
        method: 'POST',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            'Authentication': tok
        },
        body: JSON.stringify({tok, uid, tmp, sig})
    };
    console.log("Request" , data.body);

    const ss = tracker.section("account_detail");
    request(data, (err, httpResponse) => {
        ss(err);
        cb(err, httpResponse);
    });
};