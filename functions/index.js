'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.register = functions.https.onRequest((req, res) => {
	switch (req.method) {
	    case 'POST':
	   		switch (req.get('content-type')) {
	   			case 'application/json':
					admin.auth().createUser({
						email: req.body.email,
						emailVerified: false,
						password: req.body.password,
						displayName: req.body.name,
						disabled: false
					})
					.then(function(userRecord) {
						var data = {
							name: req.body.name,
							phone_number: req.body.phone_number,
							address: req.body.address
						}

						admin.database().ref("/users").child(userRecord.uid).push().set(data)
						var body = {
							uid: userRecord.uid
						};

						res.type('application/json');
						res.status(200).send(JSON.stringify(body));
					})
					.catch(function(error) {
						res.status(500).send({ error: error.message });
					});
					break;
				default:
					res.status(400).send({ error: 'Wrong Application Type' });
			}
	      break;
	    default:
			res.status(400).send({ error: 'Undefined Request Method' });
			break;
  	}
});