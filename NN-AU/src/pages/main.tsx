import { useState } from "react";
import axios from "axios";
import { Button, Flex, Switch } from 'antd';
import TextArea from "antd/es/input/TextArea";



export const MainPage = () => {
  const [isResponseGot, setIsResponseGot] = useState(false);
  const [response, setResponse] = useState('');
  const [prompt, setPrompt]     = useState('');

  const [audiofile, setAudiofile] = useState('');



  const sendToGChat = async () => {
    const response = await axios({
      method: 'POST',
      url: `http://localhost:5000/gg/${prompt}`,

      withCredentials: true,
    });

    setIsResponseGot(true);
    setResponse(response.data);
  };

  
  const sendToSaluteSpeech = async () => {
    const response = await axios({
      method: 'POST',
      url: `http://localhost:5000/synth/text/${prompt}`,

      withCredentials: true,
    });

    setIsResponseGot(true);
    const blob = new Blob([response.data], { type: 'audio/wav' });
    const url = URL.createObjectURL(blob);
    console.log(url)
    document.getElementById('audioid')!.src = url;
  };



  return (
    <div>
      <Flex vertical={true} gap={5}>
        <span>Укажите свой запрос:</span>

        <Flex vertical={false} gap={5} style={{
          verticalAlign: 'center',
        }}>
          <TextArea onChange={e => setPrompt(e.target.value)}/>
          <Button onClick={sendToGChat}>Отправить</Button>

          {/*<Switch onChange={checked => {
            if (mode === 'gg') 
              mode = 'speech';
            else 
              mode = 'gg'; 
          }}/>*/}
        </Flex>

        {
          (isResponseGot) ? 
              (<>
                <span>Результат:</span>
                <span className="api-response" style={{
                  width: '50%',
                  marginLeft: 5,
                }}>{response}</span> 
              </>) : (<></>)
            // (mode === 'speech') ?
            //   (<>
            //     <span>Результат:</span>
            //     {/*{audiofile ? <AudioPlayer {...{audiofile} as any} />*/}
            //     {audiofile ? <audio id='audioid' controls src={audiofile} />
            //     // : error ? <div>There was an error fetching the audio file</div>
            //     : <div>Loading audio...</div>}
            //   </>) 

        }
      </Flex>
    </div>
  )
};