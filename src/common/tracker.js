var io = require('socket.io-client');


class Profile {
    constructor() {
        this.reset();
    }

    reset() {
        this.data = {
            du: 0,
            g: {},
            c: {},
            t: {},
            i: {}
        };
        this.startTime = Date.now();
    }

    setInfo(key, value) {
        if (value) {
            if (typeof value != "string") {
                value = JSON.stringify(value);
            }
        }
        this.data.i[key] = value;
    }

    getSection(name, group) {
        let g = this.data.g[group];
        if (!g) {
            g = this.data.g[group] = {};
        }
        if (!g[name]) {
            g[name] = {
                in: 0,
                out: 0,
                er: 0,
                lpt: 0,
                le: ""
            }
        }
        return g[name];
    }

    addSection(name, group = "~") {
        this.getSection(name, group).in++;
        let startTime = Date.now();
        return (e) => {
            if (startTime == 0) {
                throw new Error("Already closed section!");
            }
            let s = this.getSection(name, group);

            s.out++;
            s.lpt = Date.now() - startTime;
            if (e) {
                s.er++;
                s.le = e.toString ? e.toString() : JSON.stringify(e); // MUST IMPROVE
            }
            startTime = 0;
        };
    }

    getCounter(name) {
        return this.data.c[name] || 0;
    }

    setCounter(name, val) {
        return this.data.c[name] = val;
    }

    print(text, terminal = "~", maxLength) {
        let t = this.data.t[terminal];
        if (!t) {
            t = this.data.t[terminal] = [];
        }
        if (t.length + 1 > maxLength) {
            t.shift();
        }

        if (text) {
            if (text instanceof Error) {
                text = text.stack;
            }
            if (text.toString) {
                text = text.toString();
            } else {
                text = JSON.stringify(text);
            }
        } else {
            text = JSON.stringify(text);
        }
        t.push({
            t: Date.now(),
            v: text
        });
        return t;
    }


    export() {
        this.data.du = Date.now() - this.startTime;

        for (let counter in this.data.c) {
            if (!this.data.c[counter]) {
                delete this.data.c[counter];
            }
        }
        if (Object.keys(this.data.g).length == 0) {
            delete this.data.g;
        }
        if (Object.keys(this.data.t).length == 0) {
            delete this.data.t;
        }
        if (Object.keys(this.data.c).length == 0) {
            delete this.data.c;
        }
        if (Object.keys(this.data.i).length == 0) {
            delete this.data.i;
        }

        const data = Object.keys(this.data).length == 1 ? "" : JSON.stringify(this.data);

        this.data.g = {};
        this.data.t = {};
        this.data.i = {};
        this.data.c = this.data.c || {};

        this.startTime = Date.now();

        return data;
    }


}

class Tracker {
    constructor(ops) {
        ops = ops || {};
        ops.delay = ops.delay || 2000;
        if (!ops.url) {
            throw new Error("url is missing");
        }
        const self = this;

        self.profile = new Profile();
        self.socket = io.connect(ops.url, {reconnection: false});

        self.socket.on('reconnecting', (attemptNumber) => {
            console.log("Tracker is connecting, attemptNumber = " + attemptNumber);
        });

        var interval = undefined;

        self.socket.on("connect", function () {
            console.log("Tracker is connected!");
            self.socket.emit("info", self.getInfo());

            interval = setInterval(() => {
                var data = self.profile.export();
                console.debug("REPORT" + data);
                if (data) {
                    self.socket.emit("report", data);
                }
            }, ops.delay);
        });

        self.socket.on("disconnect", function () {
            if (interval) {
                clearInterval(interval);
            }
        });
        self.socket.on("error", function (err) {
            console.warn("Tracker error", err);
        });

    }

    setIdentifier(id) {
        return this.profile.setInfo("__identifier", id);
    }

    getInfo() {
        return {os: "test"};
    }

    section(name, group) {
        return this.profile.addSection(name, group);
    }

    add(counter, value) {
        return this.profile.setCounter(counter, this.profile.getCounter(counter) + value);
    }

    set(counter, value) {
        this.profile.setCounter(counter, value);
    }

    print(text, terminal) {
        this.profile.print(text, terminal, 5);
    }
}

const instance = new Tracker({
    url: "http://tracker.vnbase.com/client?at=46919d80-ab51-438d-b7e0-1991f27fc869"
});
export default instance;



/*

 var cache = {
     du: 123123,
     g: {
         "~": {
             "session-1": {
                in: 123,
                 out: 10,
                 er: 3,
                 lpt: 23432, // last process time
                 le: "", // last error
             }
         }
     }
     c: { // counter
         "a": 1
     },
     t: { // terminal
         "~": [{t: 123, v : ""}]
     }
 }

 */