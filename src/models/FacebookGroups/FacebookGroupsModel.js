import {observable, computed, action} from "mobx";
import GonhadatAPI from "../../common/gonhadatAPI.js";

class FacebookGroupsModel {

    @observable loading = false;
    @observable error = undefined;
    @observable groups = [];


}

var facebookGroupsModel = new FacebookGroupsModel();

export default facebookGroupsModel;