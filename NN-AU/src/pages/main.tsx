import { useState } from "react";
import axios from "axios";
import { Button, Flex, Switch } from 'antd';
import TextArea from "antd/es/input/TextArea";
import { LucideTally3, LucideTally4 } from "lucide-react";



export const MainPage = () => {
  const [isResponseGot, setIsResponseGot] = useState(false);
  const [response, setResponse] = useState('');
  const [prompt, setPrompt]     = useState('');

  const [audiofile, setAudiofile] = useState('');



  const renderImg = async (file_id: string) => {
    let image = await axios({
      method: 'GET',
      maxBodyLength: Infinity,
      url: `http://localhost:5000/getImg/${file_id}`,

      withCredentials: true,
    });

    // console.log(image)
    // const bimage = btoa(image);
    document.getElementById('api-result')!.innerHTML = `<img src="data:image/jpeg;base64,${image}">`;
  };

  const sendToGChat = async () => {
    const response = await axios({
      method: 'POST',
      url: `http://localhost:5000/gg/${prompt}`,

      withCredentials: true,
    });

    setIsResponseGot(true);

    if (response.data.includes('<img')) {
      const substr = response.data.slice(10, response.data.indexOf('\"', 10));

      setResponse('');
      renderImg(substr);
    } else {
      setResponse(response.data);
    }
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

        <div 
          id="api-result" 
          className="api-response" 
          style={{
            width: '50%',
            marginLeft: 5,
          }}
        ></div> 
      </Flex>
    </div>
  )
};