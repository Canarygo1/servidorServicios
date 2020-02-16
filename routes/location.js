module.exports = function (io) {
    var app = require('express');
    var router = app.Router();

    io.on("connection", function (clientSocket) {
        console.log('User connected');
        clientSocket.on('disconnect', function () {
            console.log('user disconnected');
            disconnectTrackedUser(clientSocket.id);
        });
        clientSocket.on("connectTrackedUser", function (nickname) {
            connectTrackedUser(clientSocket.id, nickname)
        });

        function connectTrackedUser(clientSocketId, nickname) {
            var message = "User" + nickname + " has started tracking.";
            console.log(message);
            var trackedUserInfo = {};
            trackedUserInfo["id"] = clientSocketId;
            trackedUserInfo["nickname"] = nickname;
            trackedUsers[clientSocket.id] = trackedUserInfo;
            emitTrackedUsersListUpdate();
        }

        function emitTrackedUsersListUpdate() {
            var trackedUsersList = Object.keys(trackedUsers).map(function (key) {
                return trackedUsers[key];
            });
            io.emit("trackedUsersListUpdate", trackedUsersList);
        }

        clientSocket.on("disconnectTrackedUser", function () {
            console.log("user disconected");
        });

        function disconnectTrackedUser(clientSocketId) {

        }

        function emitTrackedUserHasStoppedSharingLocation(clientSocket) {
            for (index in trackedUsersTrackers[clientSocket]) {
                var socket = trackedUsersTrackers[clientSocket][index]
                if (socket.connected) {
                    socket.emit("trackedUserHasStoppedUpdate", trackedUsers[clientSocket]["nickname"]);
                }
            }
        }

        clientSocket.on("requestUpdatedTrackedUsersList", function () {
            emitTrackedUsersListUpdate();
        });

        clientSocket.on("updatelocation", function (latitude, longitude) {
            io.emit("getCoordenates",latitude,longitude)
        });
        clientSocket.on("connectTrackedUserTracker", function (trackedUserSocketId) {
            connectTrackedUserTracker(trackedUserSocketId, clientSocket)
        });

        function connectTrackedUserTracker(trackedUserSocketId, clientSocket) {
            if (trackedUsers[trackedUserSocketId] != null) {
                var message = "User" + clientSocket.id + "is traking" + trackedUsers[trackedUserSocketId]["nickname"]
                console.log(message);
                if (trackedUsersTrackers[trackedUserSocketId] == null) {
                    trackedUsersTrackers[trackedUserSocketId] = []
                }
                trackedUsersTrackers[trackedUserSocketId].push(clientSocket);
            }
        }

        clientSocket.on("disconnectTrackedUserTracker", function (trackedUserSocketId) {
            disconnectTrackedUserTracker(trackedUserSocketId, clientSocket.id);
        });

        function disconnectTrackedUserTracker(trackedUserSocketId, clientSocketId) {
            if (trackedUsers[trackedUserSocketId] != null) {
                var message = "User" + clientSocketId + " has stopped tracking " + trackedUsers[trackedUserSocketId]["nickname"];
                console.log(message);
                for (index in trackedUsersTrackers[trackedUserSocketId]) {
                    if (trackedUsersTrackers[trackedUserSocketId][index].id == clientSocketId) {
                        trackedUsersTrackers[trackedUserSocketId].splice(index, 1);
                        break;
                    }
                }
            }
        }

        clientSocket.on("trackedUserCoordinates", function (latitude, longitude) {
            emitCoordinatesToTrackingUsers(clientSocket.id, latitude, longitude)
        });

        function emitCoordinatesToTrackingUsers(clientSocketId, latitude, longitude) {
            if (trackedUsers[clientSocketId] != null) {
                var message = "Coordinates of" + trackedUsers[clientSocketId]["nickname"] + ": " + "Latitude" + latitude + "Longitude" + longitude;
                console.log(message);
                for (index in trackedUsersTrackers[clientSocketId]) {
                    var socket = trackedUsersTrackers[clientSocketId][index];
                    if (socket.connected) {
                        var message = "Sending to" + socket.id + socket.connected;
                        console.log(message);
                        var coordinates = {};
                        coordinates["latitude"] = latitude;
                        coordinates["longitude"] = longitude;
                        socket.emit("trackedUserCoordinatesUpdate", coordinates);
                    }
                }
            }
        }

        clientSocket.on("disconnect", function () {
            console.log("user disconnected");

        });
    });
    return router;
};
