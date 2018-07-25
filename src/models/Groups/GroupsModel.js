import {observable, computed, action} from "mobx";
import GonhadatAPI from "../../common/gonhadatAPI.js";

class GroupsModel {

    @observable groups = [];
    @observable activeGroups = {};
    @observable groupFilter = {}

    @action
    fetchGroups(tok, callback) {
        if (!tok) {
            throw new Error("Missing Token");
        }
        const self = this;
        GonhadatAPI.getGroups(tok, 1, 10, (err, response) => {
            if (err) {
                console.error("getGroups", err);
                return callback && callback(err, response);
            }
            console.log(response.data);
            self.groups = response.data.data;
            for (let i = 0 ; i < self.groups.length; i++) {
                let group = self.groups[i];
                self.activeGroups[group.id] = group.active;
            }
            callback && callback(err, response);
        });
    }

    @action
    toggle(groupId) {
        this.activeGroups[groupId] = !this.activeGroups[groupId];
        for (let i = 0 ; i < this.groups.length; i++) {
            if (this.groups[i].id == groupId) {
                this.groups[i].active = !this.groups[i].active;
            }
        }
    }

    @action
    updateActiveGroups(tok, callback) {
        GonhadatAPI.updateGroupsOrder(tok, this.activeGroups, (err, response) => {
            console.log(response.data);
            callback();
        });
    }

    @action
    getGroupFilter(tok, callback) {
        this.groupFilter.landmarks = [];
        this.groupFilter.projects = [];
        this.groupFilter.districtIds = [];
        this.groupFilter.cityIds = [];
        this.groupFilter.realEstateTypes = [];
        this.groupFilter.sources = [];
        this.groupFilter.startTime = 0;
        this.groupFilter.endTime = 0;
        this.groupFilter.customerPhones = [];
        this.groupFilter.transactionModes = [];

        GonhadatAPI.getGroupFilter(tok, (err,response) => {
            if (response && response.data ) {
                this.groupFilter.landmarks = response.data.landmarks;
                this.groupFilter.projects = response.data.projects;
                this.groupFilter.districtIds = response.data.districtIds;
                this.groupFilter.cityIds = response.data.cityIds;
                this.groupFilter.realEstateTypes = response.data.realEstateTypes;
                this.groupFilter.sources = response.data.sources;
                this.groupFilter.startTime = response.data.startTime;
                this.groupFilter.endTime = response.data.endTime;
                this.groupFilter.customerPhones = response.data.customerPhones;
                this.groupFilter.transactionModes = [];
                if (response.data.transactionModes.includes(1))
                    this.groupFilter.transactionModes.push(1);
                if (response.data.transactionModes.includes(2))
                    this.groupFilter.transactionModes.push(2);
            }
            callback(err,response);
        });
    }

    @action
    setGroupFilter(tok, groupFilter,callback) {
        let requestGroupFilter = {};
        requestGroupFilter.landmarks = groupFilter.landmarks;
        requestGroupFilter.projects = groupFilter.projects;
        requestGroupFilter.districtIds = this.parseMapInfoToIdList(groupFilter.districtIds);
        requestGroupFilter.cityIds = [24];
        requestGroupFilter.transactionModes = groupFilter.transactionModes;
        requestGroupFilter.realEstateTypes = groupFilter.realEstateTypes;
        requestGroupFilter.sources = groupFilter.sources;
        requestGroupFilter.startTime = groupFilter.startTime;
        requestGroupFilter.endTime = groupFilter.endTime;
        requestGroupFilter.customerPhones = groupFilter.customerPhones;
        console.log(requestGroupFilter.transactionModes);

        if (requestGroupFilter.transactionModes.length>0 && !requestGroupFilter.transactionModes.includes(-1) ) {
            requestGroupFilter.transactionModes.push(-1);
        }

        GonhadatAPI.setGroupFilter(tok, requestGroupFilter, (err)=>{
            callback(err);
        });
    }
    parseMapInfoToIdList(lstMap) {
        let parsedLstMap = []
        console.log(lstMap);
        for (let i = 0; i < lstMap.length; i++) {
            parsedLstMap.push(lstMap[i].value);
        }
        return parsedLstMap;
    }

    getIdOfSelection(info) {
        let result = [];
        for (let i = 0 ; i < info.length; i++) {
            result.push(info[i].value);
        }
        return result;
    }

}

var groupsModel = new GroupsModel();

export default groupsModel;