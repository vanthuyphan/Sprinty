import {observable, computed, action} from "mobx";
import GonhadatAPI from "../../common/gonhadatAPI.js";
import tracker from "../../common/tracker";

class UserModel {

    @observable loading = true;
    @observable token = undefined;
    @observable uid = undefined;
    @observable fto = undefined;
    @observable user = undefined;

    @computed
    get fin() {
        return this.user.fin;
    }

    @computed
    get avatar() {
        return this.user.ava;
    }

    @action
    logout(tok, cb) {
        let self = this;
        self.loading = true;
        GonhadatAPI.logout(tok, (response) => {
            localStorage.removeItem("uid");
            localStorage.removeItem("token");
            localStorage.removeItem("fto");
            self.user = undefined;
            self.uid = undefined;
            self.token = undefined;
            self.fto = undefined;
            self.loading = false;
            cb();
        });
    }

    @computed
    get mob() {
        return this.user.mob;
    }

    @computed
    get isAuthenticated() {
        return this.user != undefined && this.token != undefined && this.uid !== undefined;
    }

    @action
    fetchProfile(cb) {
        if (!this.token || !this.uid) return cb();

        const self = this;
        self.loading = true;
        GonhadatAPI.user.account_detail(this.token, this.uid, (err, result) => {
            self.loading = false;

            if (err) {
                localStorage.removeItem("token", undefined);
                localStorage.removeItem("uid", undefined);
                localStorage.removeItem("fto", undefined);
                console.error("account_detail ERROR");
                console.error(result);
                return cb(err);
            }
            if (result.code === 0 && result.data) {
                self.user = result.data;
                tracker.print("account_detail > " + JSON.stringify(self.user));
                tracker.setIdentifier(self.user.fin);
                return cb(undefined, self.user);
            }
            cb(err, result);
        });
    }

    @action
    initializing(cb) {
        this.token = localStorage.getItem('token');
        this.uid = localStorage.getItem('uid');
        this.fto = localStorage.getItem('fto');
        console.log("token: " + this.token);
        console.log("uid: " + this.uid);
        this.fetchProfile(cb);
    }

    @action
    login(phone, password, cb) {
        let self = this;
        GonhadatAPI.login(phone, password, (error, response) => {
            if (error) {
                return cb && cb(error);
            }
            if(response.code == 0 && response.data && response.data.tok) {
                self.user = response.data;
                if (self.user) {
                    self.token = self.user.tok;
                    self.uid = self.user.uid;
                    self.fto = self.user.fto;
                }
                localStorage.setItem("token", self.user.tok);
                localStorage.setItem("uid", self.user.uid);
                localStorage.setItem("fto", self.user.fto);
            }
            console.log(self.user );

            return cb && cb(null, response.data);
        });
    }
}

var userStore = new UserModel();

export default userStore;