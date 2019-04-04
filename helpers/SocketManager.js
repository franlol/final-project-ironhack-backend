class SocketManager {

    initIO(io) {
        this.io = io;
    }

    // When adding new need, emit message to home screen
    homeNewNeed() {
        this.io.emit("HOME_NEW_NEED", { for: 'everyone' });
    }

    // When someone apply, emit message to NeedDetail page //TODO namespaces
    newApply() {
        this.io.emit("NEED_DATAIL_NEW_APPLY", { for: 'everyone' });
    }

    // If owner of a need delete that need, emit message to NeedDetail to redirect home.
    deleteApply() {
        this.io.emit("NEED_DATAIL_DELETE_NEED", { for: 'everyone' });
    }

    // When owner of need edit a Need, send message to NeedDetail //TODO namespace
    editNeed() {
        this.io.emit("NEED_DATAIL_EDIT_NEED", { for: 'everyone' });
    }

    // When need status is updated, emit a socket
    statusUpdate() {
        this.io.emit("NEED_STATUS_UPDATE", { for: 'everyone' });
    }

}

module.exports = new SocketManager;