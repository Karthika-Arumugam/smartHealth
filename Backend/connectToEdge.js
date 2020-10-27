const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;
const { edge_connString, edge_targetDevice } = require('./config.js');

class EdgeConnection {
    constructor() {
        this.connectionString = edge_connString,
            this.targetDevice = edge_targetDevice,
            this.serviceClient = null;

    }
    init() {
        console.log("within edge init");
        this.serviceClient = Client.fromConnectionString(this.connectionString);
    }

    _printResultFor(op) {
        return function printResult(err, res) {
            if (err) console.log(op + " error: " + err.toString());
            if (res) console.log(op + " status: " + res.constructor.name);
        };

    }
    _receiveFeedback(err, receiver) {
        receiver.on("message", function (msg) {
            console.log("Feedback message:");
            console.log(msg.getData().toString("utf-8"));
        });
    }
    send(payload) {
        console.log(payload);
        try {
            this.serviceClient.open(err => {
                if (err) {
                    console.error("Could not connect: " + err.message);
                } else {
                    console.log("Service client connected");
                    this.serviceClient.getFeedbackReceiver(this._receiveFeedback.bind(this));
                    // var message = new Message(
                    //     "{\"PatientID\": \"user@gmail.com\",\"Age\":23,\"Sex\": 0 ,\"years\" : 30.00,\"Smoke\":\"No\"}"
                    // );
                    var message = new Message(
                        payload
                    );
                    message.ack = "full";
                    message.messageId = "My Message ID";
                    console.log("Sending message: " + message.getData());
                    this.serviceClient.send(this.targetDevice, message, this._printResultFor.apply(this, ["send"]));
                }
            });
        } catch (error) {
            console.log("error is", error);
        }
    }
}
const edgeConn = new EdgeConnection();
module.exports = {
    init: edgeConn.init.bind(edgeConn),
    send: edgeConn.send.bind(edgeConn)
};