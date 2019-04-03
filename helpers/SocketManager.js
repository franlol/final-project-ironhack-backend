class SocketManager {

    initIO(io) {
        this.io = io;
    }

    newNeed() {
        this.io.emit("NEW_NEED", { for: 'everyone' });

    }

}

module.exports = new SocketManager;