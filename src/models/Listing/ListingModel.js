import {observable, computed, action} from "mobx";
import GonhadatAPI from "../../common/gonhadatAPI.js";

class ListingModel {

    @observable id;
    @observable title;
    constructor(title) {
        this.title = title;
        this.id = Math.random();
    }
}

export default ListingModel;