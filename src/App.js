import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import * as tf from '@tensorflow/tfjs';
import { Howl } from 'howler';
import soundURL from './assets/hey_sondn.mp3';
import { initNotifications, notify } from '@mycv/f8-notification';
var sound = new Howl({
  src: [soundURL]
});
setTimeout(function(){
  alert('Vui lòng đợi 15s sau khi bấm ok để set up camera.');
},1000);
const knnClassifier = require('@tensorflow-models/knn-classifier');
const mobilenet = require('@tensorflow-models/mobilenet');
const NOT_TOUCH_LABEL = 'not_touch';
const TOUCHED_LABEL = 'touched';
const TRAINING_TIMES = 100;
const TOUCHED_CONFIDENCE = 0.8;
var b1=document.getElementsByClassName('btn1');
console.log(b1);
b1.onClick=function(){
  alert('Vui lòng đợi 15s');
}
function App() {

  const video = useRef();
  const canPlaySound = useRef(true);
  const classifier = useRef();
  const mobilenetModule = useRef();
  const [touched, setTouched] = useState(false);

  const init = async () => {

    await setupCamera();

    classifier.current = knnClassifier.create();
    // load the model
    mobilenetModule.current = await mobilenet.load();
    console.log('setup done');
    console.log('khong cham tay len mat va bam train 1');
    //text='Bấm bắt đầu và không chạm tay lên mặt.';
    initNotifications({cooldown: 3000});
  }

  const setupCamera = () => {
    return new Promise((resolve, reject) => {
      navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msgetUserMedia;

      if (navigator.getUserMedia) {
        navigator.getUserMedia(
          { video: true },
          stream => {
            video.current.srcObject = stream;
            video.current.addEventListener('loadeddata', resolve);
          },
          error => reject(error)
        );
      } else {
        reject();
      }
    });
  }

  const train1 = async label => {
    console.log(label);
    for(let i = 0; i<TRAINING_TIMES;++i){
      var te=document.getElementById('text');
      te.innerText=`Keep your hand off your face, AI is learing: Process ${parseInt((i + 1) / TRAINING_TIMES * 100)}%`;
      console.log(`progress ${parseInt((i + 1) / TRAINING_TIMES * 100)}%`);
      await training(label);
    }
    te.innerText='Done';
  }
  const train2 = async label => {
    console.log(label);
    for(let i = 0; i<TRAINING_TIMES;++i){
      var te=document.getElementById('text');
      te.innerText=`Put your hand up at 10cm above your face, AI is learing: Process ${parseInt((i + 1) / TRAINING_TIMES * 100)}%`;
      console.log(`progress ${parseInt((i + 1) / TRAINING_TIMES * 100)}%`);
      await training(label);
    }
    te.innerText='Done';
  }
  /**
   * Mechanic Learning 
   * b1: train cho may khuon mat khong cham tay
   * b2: train cho may khuon mat cham tay
   * b3: lay hinh anh hien tai, phan tich va so sanh voi data da hoc truoc
   * ==> neu matching voi touched: canh bao
   */
  const training = label => {
    return new Promise(async resolve => {
      const embedding = mobilenetModule.current.infer(
        video.current,
        true
      );
      classifier.current.addExample(embedding, label);
      await sleep(100);
      resolve();
    });
  }
  const run = async () => {
    const embedding = mobilenetModule.current.infer(
      video.current,
      true
    );
    // result luu ket qua so sanh anh :not_touch,touch
    const result = await classifier.current.predictClass(embedding)
    if (result.label === TOUCHED_LABEL &&
      result.confidences[result.label] > TOUCHED_CONFIDENCE) {
      console.log('Touch');
      setTouched(true); 
      if(canPlaySound.current){
        canPlaySound.current=false;
      sound.play();
      }
      notify('BỎ TAY RA', { body: 'Bạn vừa chạm tay vào mặt' });
    }
    else {
      console.log('NOT_Touch');
      setTouched(false);
    }
    await sleep(200);
    run();
  }
  const sleep = (ms = 0) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  useEffect(() => {
    init();

    sound.on('end', function(){
      canPlaySound.current=true;
    });
    //cleanup
    return () => {
    }
  }, []);

  return (
    <div className={`main ${touched ? 'touched' : ''}`}>
      <video
        ref={video}
        className="video"
        autoPlay />
        <p id="text"></p>
      <div className="control">
        
        <button className="btn1" onClick={() => train1(NOT_TOUCH_LABEL)}>Train 1</button>
        <button className="btn2" onClick={() => train2(TOUCHED_LABEL)}>Train 2</button>
        <button className="btn" onClick={() => run()}>Run</button>


      </div>
    </div>
  );
  
}

export default App;
