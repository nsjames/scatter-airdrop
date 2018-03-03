export default class Snackbar {

    constructor(_message, _seconds = 5){
        this.message = _message;
        this.seconds = _seconds;
        this.timestamp = +new Date();
        this.unique = Math.round(Math.random() * 1000000 + 1);
        this.timeout = null;
        this.displayed = false;
    }

}