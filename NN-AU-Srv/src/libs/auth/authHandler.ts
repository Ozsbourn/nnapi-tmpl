import '../loadEnv';
import { SAPI } from '../../configs/sberApiRoutes';

import { v4 as uuidv4 } from 'uuid';

import axios from "axios";
import https from 'https';




type AuthResponse = {
	token:      string;
	expires_at: number;
};

class AuthHandler {
	_uuid:     string;

	_data: Required<AuthResponse>;
	// Debug(?) Is russian government signed certificate trusted?
	_agent: any;


	constructor() {
		this._uuid = '';

		this._data = {
			token: '',
			expires_at: 0,
		};
	
		// Debug
		this._agent = new https.Agent({
			rejectUnauthorized: false,
		});
	};


	_genUUID = () => {
		this._uuid = uuidv4();
	};


	_getApiToken = async () => {
		this._genUUID();
		const response = await axios({
			method: 'POST',
      		url: SAPI.OAUTH,
      		headers: {
      		  'Authorization': 'Basic ' + process.env.SSPEECH_AUTH_DATA,
      		  'Content-Type':  'application/x-www-form-urlencoded',
      		  'RqUID': this._uuid, 
      		},
      		data: {
      		  'scope': 'SALUTE_SPEECH_PERS',
      		},	

      		// Debug 
      		httpsAgent: this._agent,
		});
		
		this._data = {
			token:      response.data.access_token,
			expires_at: response.data.expires_at,
		};

		return this._data.token; 
	};
	_getGGApiToken = async () => {
		this._genUUID();
		const response = await axios({
			method: 'POST',
      		url: SAPI.OAUTH,
      		headers: {
      		  'Authorization': 'Basic ' + process.env.GCHAT_AUTH_DATA,
      		  'Accept': 'application/json',
      		  'Content-Type':  'application/x-www-form-urlencoded',
      		  'RqUID': this._uuid, 
      		},
      		data: {
      		  'scope': 'GIGACHAT_API_PERS',
      		},	

      		// Debug 
      		httpsAgent: this._agent,
		})
		 
		this._data = {
			token:      response.data.access_token,
			expires_at: response.data.expires_at,
		};
		return this._data.token;
	};
	_isAuthInvalid = () => {
		const currDate = new Date();
		const timestamp = currDate.getTime();
		const timeDiff = (this._data.expires_at - timestamp) < (1000 * 60); // if TimeDiff are lesser than 1 minute also update   
		
		return (this._data.token === '' || timeDiff) ? true : false;
	};


	getToken = async () => {
		const token = await this._getGGApiToken();
		return token;
	};


	getAuthData = async () => {
		if (this._isAuthInvalid()) {
			return await this._getApiToken();
		} else {
			const token = this._data.token;
			return token;
		}
	};
};

export const authHandler = new AuthHandler();
