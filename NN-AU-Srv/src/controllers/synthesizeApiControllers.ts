import fs    from 'fs';
import axios from "axios";
import https from 'https';
import { authHandler } from "../libs/auth/authHandler";
import { SAPI }        from '../configs/sberApiRoutes';
import { Response, response }    from 'express';


export type ContentType = 'text' | 'ssml';

export const synthesizeVoice = async (contentType: ContentType,
                                      dataForSynthesize: string,
                                      res: Response,
	                                  format: string = 'wav16', 
	                                  voice:  string = 'Nec_24000') => {
	const token = await authHandler.getAuthData();
	const date  = new Date(); const timestamp = date.getTime();
	const file  = fs.createWriteStream(timestamp + '.wav');

	axios({
		method: 'POST',
		url: SAPI.SS_SYNTH,

		headers: {
			Authorization:  'Bearer ' + token,
			'Content-Type': (contentType === 'ssml') ? 'application/ssml' : 'application/text',
		},
		params: {
			format: format,
			voice:  voice,
		},
		data: dataForSynthesize,

		responseType: 'stream',

		// Debug [dangerous for production cuz pass self-signed TLS certificates]
		httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		}),
	})
	.then(resp => {
		resp.data.pipe(file);

		// If need stream type of response 
		/*resp.data.on('data', chunk => {
			resp.data.pipe(res);
		});*/

		resp.data.on('end', () => {
			file.close();

			res.set({
				'Content-Type': 'audio/wav',
			});
			const resFile = fs.createReadStream(file.path).pipe(res);
		});
	})
	.catch(err => {
		console.log(err.message)
	});
};