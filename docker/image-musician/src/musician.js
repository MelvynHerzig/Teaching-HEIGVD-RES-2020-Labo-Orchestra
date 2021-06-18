/*
 * The specification of the app
 */
let protocol = require('./musician-protocol');


/*
 * We use a standard Node.js module to work with UDP
 */
let dgram = require('dgram');

/*
 * Let's create a datagram socket. We will use it to send our UDP datagrams 
 */
let s = dgram.createSocket('udp4');

/*
 * Used to generate UUID
 */

const RFC4122 = require('rfc4122');
let rfc4122 = new RFC4122();

/*
 * A map of instruments with their name has key and sound has value
 */
const instruments = new Map(protocol.INSTRUMENTS);

/**
 * Create a musician with his uuid and sound associated with his instrument
 * @param {*} sound The sound emited by the Musician
 */
function Musician(sound) {

	this.sound = sound;
	this.uuid = rfc4122.v4f();

	this.payload = {
		"uuid": this.uuid,
		"sound": this.sound
	};

	this.message = new Buffer.from(JSON.stringify(this.payload));

	/*
	 * Let's send a sound to everyone 
	 */
	Musician.prototype.update = function () {
		

		s.send(this.message, 0, this.message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, (err, bytes) => {
			console.log("Sending payload: " + this.message + " via port " + s.address().port + " to port " + protocol.PROTOCOL_PORT);
		});

	}

	/*
	 * Let's send a sound every second
	 */
	setInterval(this.update.bind(this), 1000);
}

/**
 * Check for the right amount of parameters
 */
if(process.argv.length < 3)
{
	console.error("Need an instrument to play sounds. Please provide one");
	process.exit();
}

let sound = instruments.get(process.argv[2]);

/**
 * If the sound is null, it means the instrument in parameters doesn't exist in the map
 */
if (sound != null) {

	let m1 = new Musician(sound);
} else {
	console.error("Unknown instrument");
	process.exit();
}
