'use strict';

const multer = require('multer');
const fs = require('fs');
const nodeRes = require('node-res');
const {ServiceBroker} = require('moleculer');
const ApiGatewayService = require('moleculer-web');

const upload = multer({dest: '/var/tmp/'});

// Create broker
let broker = new ServiceBroker({
	logger: console,
	transporter: 'nats://nats:4222'
});

// Load services
broker.createService({
	mixins: ApiGatewayService,
	settings: {
		routes: [
			{
				path: '/process',
				aliases: {
					'POST /'(req, res) {
						return this.broker.call('sharp.process', {url: req.query.source}, {meta: req.body})
							.then(result => {
								this.logger.info('Image processed', result);
								nodeRes.send(req, res, result);
							}).catch(err => {
								this.logger.error('Image processing error', err);
								this.sendError(req, res, err);
							});
					}
				}
			},
			{
				path: '/metadata',
				aliases: {
					'GET /'(req, res) {
						return this.broker.call('sharp.metadata', {url: req.query.source})
							.then(result => {
								this.logger.info('Image processed', result);
								nodeRes.send(req, res, result);
							}).catch(err => {
								this.logger.error('Image processing error', err);
								this.sendError(req, res, err);
							});
					}
				}
			},
			{
				path: '/stats',
				aliases: {
					'GET /'(req, res) {
						return this.broker.call('sharp.stats', {url: req.query.source})
							.then(result => {
								this.logger.info('Image processed', result);
								nodeRes.send(req, res, result);
							}).catch(err => {
								this.logger.error('Image processing error', err);
								this.sendError(req, res, err);
							});
					}
				}
			},

		]
	}
});

process.once('SIGUSR2', function() {
	broker.stop().then(() => {
		process.kill(process.pid, 'SIGUSR2');
	});
});

// Start server
broker.start().then(() => broker.repl());
