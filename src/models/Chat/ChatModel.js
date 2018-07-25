/**
 * author Van Phan <vanthuyphan@gmail.com>
 */

import {action, computed, observable} from "mobx";
import firebase from "firebase";

class ChatModel {
    @observable rooms = [];
    @observable activeRoom;
    @observable messages = [];
    @observable loading;

    constructor() {
        var config = {
            apiKey: "AIzaSyCZ_ohWzi5rtkjPiKoP4BfnaAlNceyJn5c",
            databaseURL: "https://reflecting-zone-136507.firebaseio.com",
            storageBucket: "reflecting-zone-136507.appspot.com"
        };
        firebase.initializeApp(config);
    }

    @action
    signIn(uid, fto, callback) {
        const that = this;
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                that.loadRooms(uid, callback);
            } else {
                firebase.auth().signInWithCustomToken(fto).catch(function (error) {
                    // Handle Errors here.
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    if (errorCode === 'auth/invalid-custom-token') {
                    } else {
                        console.error(error);
                    }
                })};
        });
    }

    loadRooms(uid, callback) {
        const that = this;
        var userRef = firebase.database().ref('user_metadata/' + uid).orderByKey().limitToLast(50);
        userRef.on('child_added', function (room) {
            console.log("Child Aded", room.val());
            that.rooms.push({...room.val(), id: room.key});
        });

        userRef.on('child_changed', function (data) {
        });

        userRef.on('child_removed', function (data) {
        });

        userRef.once("value", function(snap) {
            console.log("Value", snap.val());
            callback();
        });

    }

    @action
    loadRoomData(key, uid, callback) {
        consle.log("Key", key)
        const roomRef = firebase
            .database()
            .ref(`room_metadata/${key}/list_users`);
        roomRef.on('value', snapshot => {

            snapshot.forEach(childSnapshot => {
                console.log("RowData", childSnapshot);
                if (childSnapshot.key === uid) {
                    callback(childSnapshot.val())
                }
            });
        });
    }
}

var chatModel = new ChatModel();

export default chatModel;
