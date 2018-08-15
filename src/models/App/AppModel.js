/**
 * author Van Phan <vanthuyphan@gmail.com>
 */

import {observable, computed, action} from "mobx";
import API from "../../common/API.js";

const uuidv4 = require('uuid/v4');

class AppModel {
    @observable error = undefined;
    @observable loading = [];
    @observable modeOptions = undefined;
    @observable typeOptions = undefined;
    @observable cityOptions = undefined;
    @observable districtOptions = undefined;
    @observable projectSelection = undefined;
    @observable landmarkSelection = undefined;

    @computed
    get isLoading() {
        return this.loading.length > 0;
    }

    logBlockingTask() {
        //------------end logging
        let str = "AppModel.loading: ";
        this.loading.forEach((i) => { str += i.name + "| "});
        console.log(str);
        //------------logging
    }

    @action
    addBlockingTask(name) {
        const self = this;
        let id = 'TASK-' + uuidv4();
        const blocker = {};
        self.loading.push({id, name, time: Date.now()});
        self.logBlockingTask();
        blocker.done = () => {
            if (!id) {
                throw new Error("Task has been completed before! Don't call this function double!");
            }
            self.removeBlockingTask(id);
            id = undefined;
            self.logBlockingTask();
        };
        return blocker;
    }

    @action
    removeBlockingTask(id) {
        const DELAY_TIME = 1000;
        const self = this;
        for (let i = 0; i < this.loading.length; i++) {
            if (this.loading[i].id == id) {
                const t = Date.now() - this.loading[i].time;
                if (t < DELAY_TIME && this.loading.length == 1) {
                    setTimeout(()=> {
                        self.loading.splice(i, 1);
                    }, DELAY_TIME - t);
                    return;
                }
                    return this.loading.splice(i, 1);
            }
        }
    }

    @action
    setError(err) {
        this.error = err;
    }

    @action
    populateAppOptions(tok) {
        if (!tok) {
            throw new Error("Missing token!");
        }
        const self = this;
        console.log(this.modeOptions);
        if (this.modeOptions === undefined || this.typeOptions === undefined) {
            const getListingCategory = self.addBlockingTask("getListingCategory");
            API.getListingCategory(tok, (err, response) => {
                getListingCategory.done();
                if(err) {
                    self.error = err;
                    console.error("getListingCategory", err);
                    return;
                }
                let data = response.data || {};
                self.modeOptions = data.lstTransactionType || [];
                self.typeOptions = data.lstRealEstateType || [];
            });
        }

        if (this.cityOptions === undefined) {
            // const getCityList = self.addBlockingTask("getCityList");
            // API.getCityList(tok, (err, response) => {
            // getListingCategory.done();
            //     if(err) {
            //         self.error = err;
            //         console.error("getCityList", err);
            //         return;
            //     }
            //     if (response.data) {
            //         self.cityOptions = response.data.lst;
            //     } else {
            //         self.cityOptions = []
            //     }
            // });
        }
        //TODO: fake data
        this.cityOptions = [{id:24,name:"Ho Chi Minh"}]

        if (this.districtOptions === undefined) {
            const getDistrictInfo = self.addBlockingTask("getDistrictList");
            this.getDistrictInfo(tok,24, (err)=>{
                getDistrictInfo.done();
                if (err) {
                    self.error = err;
                    console.error("getDistrictInfo",err);
                }
            });
        }

        // this.districtOptions = [];
        this.projectSelection = [];
        this.landmarkSelection = [];
        return true;
    }

    @action
    createNewLandmark(word, tok, cb) {
        const self = this;
        if (confirm("You want to create new landmark: " + word)) {
            let landmarkInfo = [{realName: word}];
            API.createLandmark(tok, landmarkInfo, (err, response) => {
                if(err) {
                    self.error = err;
                    console.error("createLandmark", err);
                    return;
                }
                let data = response.data || [];
                if (data.length == 0) {
                    alert("Error !! can't create new landmark: " + word);
                    cb(null);
                } else {
                    alert("Created landmark :" + word);
                    let newLandmark = {value: data[0].id, label: data[0].realName};
                    cb(newLandmark);
                }
            });
        } else {
            cb(null);
        }
    }

    @action
    searchLandmark(word, tok, cb) {
        const self = this;
        if (word != "") {
            API.searchLandmark(tok, word, (err, response) => {
                if (err) {
                    console.log("ERROR", err);

                }
                if (response.data) {
                    this.landmarkSelection = this.parseLandmarkInfo(response.data.lstLandmark);
                } else {
                    this.landmarkSelection = [];
                }
                cb(err, response);
            });
        } else {
            this.landmarkSelection = [];
            cb();
        }
    }

    @action
    searchProject(word, tok, cb) {
        if (word != "") {
            API.searchProject(tok, word, (err, response) => {
                if (err) {
                    console.log("ERROR", err);

                }
                if (response.data) {
                    this.projectSelection = this.parseProjectInfo(response.data.lst);
                } else {
                    this.projectSelection = [];
                }

                cb(err, response);
            });
        } else {
            this.landmarkSelection = [];
            cb();
        }
    }

    @action
    getDistrictInfo(tok, cityId, cb) {
        API.getDistrictList(tok, [cityId], (err, response) => {
            if (err) {
                console.error(err);
                return;
            }
            if (response.data) {
                this.districtOptions = this.parseMapInfo(response.data.lst);
            } else {
                this.districtOptions = []
            }
            cb(err,response);
        });
    }

    parseProjectInfo(lstProject) {
        let parsedLstProject = []
        for (let i = 0; i < lstProject.length; i++) {
            parsedLstProject.push({value: lstProject[i].pid, label: lstProject[i].title});
        }
        return parsedLstProject;
    }

    parseLandmarkInfo(lstLandmark) {
        let parsedLstLandmark = []
        for (let i = 0; i < lstLandmark.length; i++) {
            parsedLstLandmark.push({value: lstLandmark[i].id, label: lstLandmark[i].realName});
        }
        return parsedLstLandmark;
    }

    parseMapInfo(lstMap) {
        let parsedLstMap = []
        for (let i = 0; i < lstMap.length; i++) {
            parsedLstMap.push({value: lstMap[i].id, label: lstMap[i].name});
        }
        return parsedLstMap;
    }
}

var appModel = new AppModel();

export default appModel;
