import express, { response } from 'express'
import { 
    headerTypes, 
    headerValues 
} from './configs/corsConfigs';

import './libs/loadEnv';

import { ContentType as SyntContentType, synthesizeVoice }  from './controllers/synthesizeApiControllers';
import { ContentType as recContentType,  recognizeVoice }   from './controllers/recognizeApiController';
import { makeRequestGGApi } from './controllers/ggApiController';

import fs    from 'fs';



const app  = express();
const port = process.env.PORT;

app.use(express.json())                         // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use(function(_req, res, next) {
    res.header(headerTypes.acaOrigin,      headerValues.acaOrigin); 
    res.header(headerTypes.acaHeaders,     headerValues.acaHeaders); 
    res.header(headerTypes.acaMethods,     headerValues.acaMethods); 
    res.header(headerTypes.acaCredentials, headerValues.acaCredentials); 
    
    next();
});


/**
 * POST routes for serving request from front side
 */
app.post('/gg/:content', async (req, res) => {
    const result = await makeRequestGGApi(req.params.content);
    res.send(result);
});
app.post('/synth/:type/:content', async (req, res) => {
    const resp = await synthesizeVoice(req.params.type as SyntContentType, req.params.content, res);
});
// app.post('/rec/:type/:content/:rate', async (req, res) => {
//     // const result = await recognizeVoice(req.params.type as recContentType, req.params.content, Number(req.params.rate));
   
//     const file = fs.readFileSync('./1710414640258.wav');
//     const result = await recognizeVoice('pcm_s16le' as recContentType, file, Number(req.params.rate));
//     res.send(result);
// });



/**
 * Test routes for testing API w/o frontend (call by GET from browser)
 */
app.get('/gg/:content', async (req, res) => {
    const result = await makeRequestGGApi(req.params.content);
    res.send(result);
});
app.get('/rec/:type/:content/:rate', async (req, res) => {
    // const result = await recognizeVoice(req.params.type as recContentType, req.params.content, Number(req.params.rate));
   
    const file = fs.readFileSync('./1710414640258.wav');
    const result = await recognizeVoice('pcm_s16le' as recContentType, file, Number(req.params.rate));
    res.send(result);
});


app.listen(port, () => console.log(`Running on port ${port}`));
