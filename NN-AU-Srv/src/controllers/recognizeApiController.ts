import axios from "axios";
import https from 'https';
import { authHandler } from "../libs/auth/authHandler";
import { SAPI }        from '../configs/sberApiRoutes';


export type ContentType = | 'pcm_s16le' 
                          | 'opus'
                          | 'mp3' 
                          | 'flac'
                          | 'alaw' 
                          | 'mulaw';
const audioTypeMapper = new Map([
	['pcm_s16le', 'audio/x-pcm;bit=16;rate=16000'], // rate must be a mutable objects
	['opus',      'audio/ogg;codecs=opus'],
	['mp3',       'audio/mpeg'],
	['flac',      'audio/flac'],
	['alaw',      'audio/pcma;rate=XXX'],
	['mulaw',     'audio/pcmu;rate=XXX'],
]); 
const langTypeMapper = new Map([
	['ru', 'ru-RU'],
	['en', 'en-US'],
]);


export const recognizeVoice = async (contentType:       ContentType,
                                     dataForSynthesize: Buffer, 
	                                 _sampleRate:    number, 
	                                 language:      string  = 'ru', 
	                                 filter:        boolean = false, 
	                                 channelsCount: number  = 1) => {
	const token = await authHandler.getAuthData();


	// const response = await axios({
	const response = await axios({
		method: 'POST',
		url: SAPI.SS_REC,

		headers: {
			Authorization:  'Bearer ' + token,
			"Content-Type": audioTypeMapper.get(contentType),
		},
		params: {
			language: langTypeMapper.get(language),
			sample_rate: 16000,
			enable_profanity_filter: filter,
			channels_count: channelsCount
		},
		data: dataForSynthesize,

		// Debug [dangerous for production cuz ignore self-signed TLS certificates]
		httpsAgent: new https.Agent({
			rejectUnauthorized: false,
		}),
	});

	let resText: string = '';
	response.data.result.map((chunk: string) => resText += chunk);
	return resText;
};