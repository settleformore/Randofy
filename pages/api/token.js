import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
	api: {
		externalResolver: true,
	},
};

var redirect_uri =
	process.env.NODE_ENV === 'development'
		? 'http://localhost:3000/'
		: 'https://randofy.vercel.app/';

export default async function handler(req, res) {
	const code = req.query.code;
	// console.log(code);
	const encoded = Buffer.from(
		process.env['SPOT_ID'] + ':' + process.env['SPOT_SECRET'],
	).toString('base64');

	const spotifyRes = await fetch('https://accounts.spotify.com/api/token', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Access-Control-Allow-Header': '*',
			'Cache-Control': 'no-cache',
			Authorization: `Basic ${encoded}`,
		},
		body: `grant_type=authorization_code&code=${code}&redirect_uri=${redirect_uri}`,
	});

	const response = await spotifyRes.json();
	// console.log(response);
	if (response.status === 200) {
		res.status(200).send(response.data);
	} else {
		res.status(spotifyRes.status).send(response);
	}
}
