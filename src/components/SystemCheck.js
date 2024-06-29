import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { newDataLoad } from "./Addresses";

let _states = {
  isKafkaInstanceTriggered: false,
  isKafkaInstanceStarted: false,
  isKafkaInstanceHealthy: false,
  isDataTriggeredToKafkaInstance: false,
  isDataTriggeredToKafkaCompleted: false,
  
  expectedTimeForSystemUpSec: 60,
  currectProgressForSystemUp: 0,
  expectedTimeForDataLoadToKakfaSec: 60,
  currectProgressForDataLoadToKakfa: 0,

  setSystemUpSetting() {
    this.isKafkaInstanceTriggered = true;
    this.isKafkaInstanceStarted = true;
    this.isKafkaInstanceHealthy = true;
    this.isDataTriggeredToKafkaInstance = true;
    this.isDataTriggeredToKafkaCompleted = true;
    
    this.expectedTimeForSystemUpSec = -1;
    this.currectProgressForSystemUp =  100;
    this.expectedTimeForDataLoadToKakfaSec = -1;
    this.currectProgressForDataLoadToKakfa = 100;
    return this;
  },

  setSystemDownSetting() {
    this.isKafkaInstanceTriggered = false;
    this.isKafkaInstanceStarted = false;
    this.isKafkaInstanceHealthy = false;
    this.isDataTriggeredToKafkaInstance = false;
    this.isDataTriggeredToKafkaCompleted = false;
    
    this.expectedTimeForSystemUpSec = 60;
    this.currectProgressForSystemUp =  0;
    this.expectedTimeForDataLoadToKakfaSec = 60;
    this.currectProgressForDataLoadToKakfa = 0;
  
    return this;
  }

}

function updateProgress(interval, expectedTimeSec, progress, setProgress, callback, states, setState) {
  let currentProgress = progress;
  if(expectedTimeSec === -1) {
    currentProgress = 100;
    setProgress(currentProgress);
    clearInterval(interval);
    return currentProgress;
  }

  // If expected time is not given then take it as 60sec
  let _step = 100/(expectedTimeSec ? expectedTimeSec : 60);   // 100/50 - 100 is the percentage and 50 is the seconds
  currentProgress = currentProgress + _step;
  setProgress(currentProgress + _step);

  if(Math.round(currentProgress) === 100) {
    console.log(`clearing interval from updateProgress`);
    clearInterval(interval);
    callback(states, setState);
    return currentProgress;
  }

  return currentProgress;
}

function SystemUpProgressBar({states, setState}) {
  
  let interval;
  let [progress, setProgress] = useState(_states.currectProgressForSystemUp);

  useEffect(()=>{
    console.log(`initializing interval`);
    _states.currectProgressForSystemUp = updateProgress(
        interval,
        _states.expectedTimeForSystemUpSec,
        _states.currectProgressForSystemUp,
        setProgress,
        setForKafkaHealthCheck,
        states,
        setState
    );
    interval = setInterval(() => {
      _states.currectProgressForSystemUp = updateProgress(
        interval,
        _states.expectedTimeForSystemUpSec,
        _states.currectProgressForSystemUp,
        setProgress,
        setForKafkaHealthCheck,
        states,
        setState
      );
    }, 1000);

    return () => {
      console.log(`clearing interval from useEffect`);
      clearInterval(interval);
    };
  }, []);

  return <progress value={progress} max={100} />
}

function DataLoadInKafkaProgressBar({states, setState}) {
  
  let interval;
  let [progress, setProgress] = useState(_states.currectProgressForDataLoadToKakfa);

  useEffect(()=>{
    console.log(`initializing interval`);
    _states.currectProgressForDataLoadToKakfa = updateProgress(
        interval,
        _states.expectedTimeForDataLoadToKakfaSec,
        _states.currectProgressForDataLoadToKakfa,
        setProgress,
        triggerDataInKafkaInstance,
        states,
        setState
    );
    interval = setInterval(() => {
      _states.currectProgressForDataLoadToKakfa = updateProgress(
        interval,
        _states.expectedTimeForDataLoadToKakfaSec,
        _states.currectProgressForDataLoadToKakfa,
        setProgress,
        triggerDataInKafkaInstance,
        states,
        setState
      );
    }, 1000);

    return () => {
      console.log(`clearing interval from useEffect`);
      clearInterval(interval);
    };
  }, []);

  return <progress value={progress} max={100} />
}

function StartKafkaInstance({states, setState}) {
  const handleClick = () => {
    _states.isKafkaInstanceTriggered = true;
    setState( values => ({...values, isKafkaInstanceTriggered:true}) );

    console.log(`START_KAFKA_INSTANCE_URL=${process.env.REACT_APP_START_KAFKA_INSTANCE_URL}`)
    axios.get(`${process.env.REACT_APP_START_KAFKA_INSTANCE_URL}`).then(
      response => { /* All Good */  }
    ).catch(error => {console.error(error);});
  }

  return (<>
    <tr>
      <td>Shall I bring-up the system</td>
      { states.isKafkaInstanceTriggered === true ? 
          <td>Yes! Please</td> : 
          <td onClick={handleClick} className="btn" >Yes! Please</td> }
    </tr>    
  </>);
}

function KafkaInstanceLoading({states, setState}) {

  if(_states.isKafkaInstanceTriggered === false) {
    return (<></>);
  }
  
  return (<>
    <tr>
        <td>Kafka Instance is loading</td>
        <td>
            <span>It will take a minute</span>
            <br/>
            <SystemUpProgressBar 
              states={states}
              setState={setState} />
        </td>
    </tr>
  </>);
}

function KafkaInstanceStatus({states, setState}) {

  if(_states.isKafkaInstanceStarted === false) {
    return (<></>);
  }
  
  return (<>
    <tr>
        <td>Kafka Instance health</td>
        {states.isKafkaInstanceHealthy === true && 
            <td>
              <span>Good</span><br/>
              <a href={process.env.REACT_APP_KAFKA_INSTANCE_MONITORING_URL} target="_blank">Kafka Instance</a>
            </td>
        }
        {states.isKafkaInstanceHealthy === false && 
            <td>Something Wrong</td>
        }
    </tr>
  </>);

}

function AskForTriggerData({states, setState}) {

  const handleClick = () => {
    _states.isDataTriggeredToKafkaInstance = true;

    console.log(`TRIGGER_DATA_INTO_KAFKA_INSTANCE_URL=${process.env.REACT_APP_TRIGGER_DATA_INTO_KAFKA_INSTANCE_URL}`)
    axios.get(`${process.env.REACT_APP_TRIGGER_DATA_INTO_KAFKA_INSTANCE_URL}`).then(
      response => { 
        setState( values => ({...values, isDataTriggeredToKafkaInstance:true}) );  
        newDataLoad();
      }
    ).catch(error => {console.error(error);});
  }

  if(_states.isKafkaInstanceHealthy === false) {
    return (<></>);
  }

  return (<>
    <tr>
        <td>Shall the data to be loaded into Kafka instance?</td>
        {_states.isDataTriggeredToKafkaInstance ? 
            <td>Yes! Please, Go a head</td> : 
            <td onClick={handleClick} className="btn">Yes! Please, Go a head</td> }
    </tr>    
  </>);
}

function triggerDataInKafkaInstance(states, setState) {
  _states.isDataTriggeredToKafkaCompleted = true;
  _states.expectedTimeForDataLoadToKakfaSec = -1;
  setState( values => ({...values, isDataTriggeredToKafkaCompleted:true, expectedTimeForDataLoadToKakfaSec: -1}) );
}

function DataLoadingProgressBar({states, setState}) {

  if(_states.isDataTriggeredToKafkaInstance === false) {
    return (<></>);
  }

  return (<>
    <tr>
        <td>Kafka Data Loading Status, it will take approx 3min</td>
        <td>
            <span>It will take a minute</span>
            <br/>
            <DataLoadInKafkaProgressBar 
              states={states}
              setState={setState} 
            />
        </td>
    </tr>
  </>);
}

function NavigateToNextPage() {

  const navigate = useNavigate();
  
  if(_states.isDataTriggeredToKafkaCompleted === false) {
    return (<></>);
  }

  function handleClick() {
    navigate("/list");
  }

  return (<>
    <tr>
        <td>All data loaded, Please navigate to view data</td>
        <td onClick={handleClick} className="btn">Next</td>
    </tr>
  </>);
}

function setForKafkaHealthCheck(states, setState) {
  _states.isKafkaInstanceStarted = true;
  _states.expectedTimeForSystemUpSec = -1;
  setState( values => ({...values, isKafkaInstanceStarted:true, expectedTimeForSystemUpSec: -1}) );

  axios.get(`${process.env.REACT_APP_CHECK_HEALTH_KAFKA_INSTANCE_URL}`).then(
      response => {
        _states.isKafkaInstanceHealthy = true;
        setState( values => ({...values, isKafkaInstanceHealthy: true}) );
      }
  ).catch(error => {console.error(error);});
}

function setSystemInitialStatus(setState) {
  console.log("Going to check Current System Status on landing to this page.")
  axios.get(process.env.REACT_APP_CHECK_HEALTH_KAFKA_INSTANCE_URL,
    {timeout: 2000,} // Set a timeout of 2 seconds
  ).then(
    response => {
      _states.setSystemUpSetting();
      setState( values => ({...values, isKafkaInstanceTriggered: true}) )
    }
  ).catch(error => {
    console.log("Kafka Instance seems to be down, therefore activating the states.");
    setState( _states.setSystemDownSetting() );
    console.error(error);
  });
}

export function SystemCheck() {

  const [states, setState] = useState(_states);

  // Check Initial Status Here
  //useEffect(() => setSystemInitialStatus(setState), []);

  return (<>
    <h2>System Check</h2>
    <br/>
    <br/>
    <div className="systemCheckMain">
    <table className="systemCheckTable">
        <tbody>
          <StartKafkaInstance states={states} setState={setState} />
          <KafkaInstanceLoading states={states} setState={setState} />
          <KafkaInstanceStatus states={states} setState={setState} />
          <AskForTriggerData states={states} setState={setState} />
          <DataLoadingProgressBar states={states} setState={setState} />
          <NavigateToNextPage />
        </tbody>
    </table>
    </div>
  </>);
}
