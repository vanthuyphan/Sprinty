import {observable, action} from "mobx";
import GonhadatAPI from "../../common/gonhadatAPI.js";

class DiffListingsModel {

    @observable diffListings = [];

    @action
    fetchDiffListings(tok, numberOfMessage, diffFields, callback) {
        GonhadatAPI.getIncorrectParsedMessages(tok, numberOfMessage, diffFields, (err, response) => {
            this.diffListings = response.data || [];
            if (callback) {
                callback();
            }
        });
    }
}


let diffListingsModel = new DiffListingsModel();

export default diffListingsModel;