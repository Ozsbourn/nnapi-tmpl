import axios from "axios";
import https from 'https';
import { authHandler } from "../libs/auth/authHandler";
import { SAPI } from "../configs/sberApiRoutes";



/**
 * Makes a request to GigaChat Api
 *
 * @param      {string}  content  The content that was sended by user (prompt)
 * 
 * Additional info look up here: https://developers.sber.ru/docs/ru/gigachat/api/reference/rest/post-chat
 */
export const makeRequestGGApi = async (content: string) => {
	const token = await authHandler.getToken();

	const response = await axios({
		method: 'POST',
		url: SAPI.GCHAT,

		maxBodyLength: Infinity,

		headers: {
			Authorization:  'Bearer ' + token,
			'Accept': 'application/json',
			"Content-Type": 'application/json',
		},
		data: {
			'model': 'GigaChat',
			'messages': [
				{
					'role': 'user',
					'content': content,
				},
			],

			"temperature": 1,
			"top_p": 0.1,
			"n": 1,
			"stream": false,
			"max_tokens": 512,
			"repetition_penalty": 1,
			"update_interval": 0
		},


		// Debug [dangerous for production cuz pass self-signed TLS certificates]
		httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		}),
	})
	
	return response.data.choices[0].message.content;
};




