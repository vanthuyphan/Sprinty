import {observable, computed, action} from "mobx";
import GonhadatAPI from "../../common/gonhadatAPI.js";
import ListingModel from "./ListingModel";
class ListingsModel {

    @observable listings = [];
    @observable message = "";
    @observable gName = "";
    @observable id = "";
    @observable tit = "";
    @observable streetWidth;
    @observable pri;
    @observable unit;
    @observable mode;
    @observable typ;

    @observable are;
    @observable areaUnit;
    @observable widthArea;
    @observable lengthArea;

    @observable phone = "";
    @observable nob;
    @observable now;
    @observable nof;
    @observable dir = "";
    @observable des = "";
    @observable similarMessage = "";
    @observable similarId="";
    @observable img = [];
    @observable landmark = [];
    @observable project;
    @observable acc;
    @observable address;

    @action
    fetchMessage(tok, callback) {
        GonhadatAPI.fetchMessage(tok,
            ((err, response) => {
                if (err) {
                    console.error(err);
                    callback(err);
                    return;
                }
                console.info(response);
                this.listings = [];
                let data = response.data;
                if (Object.keys(data).length == 0){
                    return callback && callback();
                }

                this.message = data.message.trim();
                this.gName = data.gName;
                this.phone = data.phone;
                this.des = data.description.trim();
                this.similarMessage = data.similarMessage && data.similarMessage.trim();
                this.similarId = data.similarMessageId && data.similarMessageId.trim();
                this.id = data.id;
                this.img = data.img || [];
                this.mode = data.transactionType || 0;
                this.typ = data.realEstateType || 0;
                this.tit = data.title.trim();
                this.acc = data.accessLevel || 2;

                // extract price
                let prices = data.price || [{'value': null, 'unitId': 1}];
                console.log(prices);
                if (prices.length > 0) {
                    let priceObj = prices[0];
                    this.pri = priceObj.value;
                    this.unit = priceObj.unitId;

                } else {
                    this.unit = 1;
                }

                // extract area
                let areas = data.area || [{'value': null, 'unitId': null, 'widthArea': null, 'lengthArea': null}];
                if (areas.length > 0) {
                    let areaObj = areas[0];
                    this.are = this.parseStringToNumber(areaObj.value);
                    this.areaUnit = areaObj.unitId;
                    this.widthArea = areaObj.widthArea;
                    this.lengthArea = areaObj.lengthArea;
                }

                this.dir = data.directions && data.directions[0] || 0;
                this.nob = data.bedrooms && data.bedrooms[0] || 0;
                this.now = data.bathrooms && data.bathrooms[0] || 0;

                this.listings.push(new ListingModel());
                this.address = '';

                callback && callback();
            }).bind(this));
    }

    getImgs(urls) {
        let result = [];
        for (let i = 0 ; i < urls.length; i++) {
            if (urls[i].isFirst == true) {
                result.push(urls[i].src);
                break;
            }
        }

        for (let i = 0 ; i < urls.length; i++) {
            if (urls[i].isSelected == true && urls[i].isFirst == false) {
                result.push(urls[i].src)
            }
        }
        return result;
    }

    getIdOfSelection(info) {
        let result = [];
        for (let i = 0 ; i < info.length; i++) {
            result.push({id:info[i].value,name:info[i].label})
        }
        return result;
    }

    @action
    addListing() {
        this.listings.push(new ListingModel(this.title));
    }

    @action
    createMessage(tok, callback) {
        // separate listings and requests:
        let requests = [];
        let _listings = [];
        let isValidate = true;
        this.listings.map(listing => {
            if (!this.validateListing(listing) || !isValidate) {
                isValidate = false;
                return;
            }
            if (listing.landmark != null) {
                listing.img = this.getImgs(listing.img);
            }
            if (listing.landmark != null) {
                listing.landmark = this.getIdOfSelection(listing.landmark);
            }
            if (listing.project != null) {
                listing.project = this.getIdOfSelection([listing.project])[0];
            }
            listing.rawId = this.id;

            let isRequest = listing.isRequest;

            // remove unused fields before sending to server
            delete listing.id;
            delete listing.typeOptions;
            delete listing.modeOptions;
            delete listing.isRequest;
            delete listing.landmarkSelection;
            for (let key in listing) {
                if (listing[key]==""|| listing[key]==null) {
                    delete listing[key];
                }
            }
            console.log(isRequest);
            if (isRequest) {
                // 3 (mua) --> 1; 4 (thuê) --> 2
                listing.mode = listing.mode == 3 ? 1 : 2;
                listing.leg = [listing.leg];
                listing.dir = [listing.dir];

                listing.tit = listing.des;

                requests.push(listing);
            } else {
                if (listing.dir!=null) {
                    listing.dir = listing.dir && listing.dir.length > 0 ? listing.dir[0] : 0;
                }
                _listings.push(listing);
            }
        });

        if (isValidate) {
            GonhadatAPI.createViberMessages(tok, this.id, '', this.phone, _listings, requests, (err, response) => {
                alert("Created" + _listings.length + " listings and " + requests.length + " requests");
                this.fetchMessage(tok, callback);
            });
        }
    }

    @action
    createMessageOnly(tok, callback) {
        GonhadatAPI.createViberMessages(tok, this.id, this.message, this.phone, [], [], (response) => {
            alert("Message Created");
            this.fetchMessage(tok, callback);
        });
    }

    @action
    skipMessage(tok, callback) {
        GonhadatAPI.skipMessage(tok, this.id, (err, response) => {
            this.fetchMessage(tok, callback);
        });
    }

    @action
    refreshLisingTime(tok, callback) {
        GonhadatAPI.refreshListingTime(tok, this.similarId, (err, response) => {
            alert("Refresh listing id: "+ this.similarId);
            this.deleteViberMessage(tok);
        });
    }

    @action
    deleteViberMessage(tok, callback) {
        GonhadatAPI.deleteViberMessage(tok, this.id, (err, response) => {
            this.fetchMessage(tok, callback);
        });
    }

    @action
    doneVerifying(listing) {
        for (let i = 0 ; i < this.listings.length; i++) {
            if (listing.id == this.listings[i].id) {
                this.listings[i] = listing;
            }
        }
    }

    @action
    deleteListing(id, tok) {
        for (let i = 0 ; i < this.listings.length; i++) {
            if (id == this.listings[i].id) {
                this.listings.splice(i, 1);
            }
        }
    }

    validateListing(listing) {
        if (listing.mode == -1) {
            alert("please select << Loại tin đăng >>");
            return false;
        }
        return true;
    }

    parseStringToNumber(param) {
        let parsedValue = 0;
        if (typeof param === "string") {
            param = param.replace(",", ".")
            parsedValue = parseFloat(param);
        } else {
            parsedValue  = param;
        }
        return parsedValue;
    }
}

let listingsModel = new ListingsModel();

export default listingsModel;