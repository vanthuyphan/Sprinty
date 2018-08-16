import {observable, computed, action} from "mobx";
import API from "../../common/API.js";
import tracker from "../../common/tracker";

class UserModel {

    @observable loading = true;
    @observable user = undefined;

    @computed
    get id() {
        return this.user.id;
    }

    @computed
    get avatar() {
        return this.user.ava;
    }

    @action
    loadUsers(cb) {
        API.getUsers(cb);
    }

    @action
    deleteUser(id, cb) {
        API.removeUser(id, cb);
    }

    @action
    logout(tok, cb) {
        let self = this;
        self.loading = true;
        localStorage.removeItem("user");
        this.user = undefined;
        self.loading = false;
        cb();
    }

    @computed
    get firstName() {
        return this.user.firstName;
    }

    @computed
    get userName() {
        return this.user.userName;
    }

    @computed
    get isAuthenticated() {
        return this.user != undefined;
    }

    @action
    fetchProfile(cb) {
        if (this.user == undefined) return cb();

        const self = this;
        self.loading = true;
        API.loadUser(this.user.id, (err, result) => {
            self.loading = false;
            if (err) {
                localStorage.removeItem("user", undefined);
                console.error(result);
                return cb(err);
            }
            if (result) {
                self.user = result;
                return cb(undefined, self.user);
            }
            cb(err, result);
        });
    }

    @action
    loadReport(cb) {
        API.loadReport(cb);
    }

    @action
    loadTasks(cb) {
        API.loadTasks(cb);
    }

    @action
    count(cb) {
        API.count(cb);
    }

    @action
    changeStatus(status, cb) {
        API.changeStatus(this.user.id, status, (err, result) => {
            cb(err, result);
        });
    }

    @action
    initializing(cb) {
        this.user = localStorage.getItem('user');
        this.fetchProfile(cb);
    }

    @action
    login(phone, password, cb) {
        let self = this;
        API.login(phone, password, (error, response) => {
            if (error) {
                return cb && cb(error);
            }
            if(response && response.id) {
                self.user = response;
                localStorage.setItem("user", response);
            }
            console.log(self.user);

            return cb && cb(null, response.data);
        });
    }

    @action
    createUser(username, firstName, lastName, avatar, password, cb) {
        let self = this;
        API.createUser(username, firstName, lastName, avatar, password, (error, response) => {
            window.location.href = "#/users";
        });
    }

    @action
    update(username, firstName, lastName, avatar, password, cb) {
        API.updateUser(this.user.id, username, firstName, lastName, avatar, password, (error, response) => {
            this.user.userName = username;
            this.user.firstName = firstName;
            this.user.lastName = lastName;
            this.user.avatar = avatar;
            this.user.password = password;
            cb();
        });
    }

    @action
    createTask(content, included, cb) {
        API.createTask(content, included, (error, response) => {
            window.location.href = "#/tasks";
        });
    }
}

var userStore = new UserModel();

export default userStore;