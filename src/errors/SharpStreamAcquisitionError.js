const {MoleculerError} = require("moleculer/src/errors");

/**
 * Error that should be thrown when the Sharp Service can not acquire a stream
 *
 * @class SharpStreamAcquisitionError
 * @extends {MoleculerError}
 */
module.exports = class SharpStreamAcquisitionError extends MoleculerError {
	/**
	 * Creates an instance of SharpStreamAcquisitionError.
	 *
	 * @param {String?} message
	 * @param {Number?} code
	 * @param {String?} type
	 * @param {any} data
	 *
	 * @memberof SharpStreamAcquisitionError
	 */
	constructor(
		message = "Stream could not be acquired", code = 500,
		type = "SHARP_STREAM_ACQUISITION_ERROR", data = {}) {
		super(message);
		this.code = code;
		this.type = type;
		this.data = data;
	}
};
