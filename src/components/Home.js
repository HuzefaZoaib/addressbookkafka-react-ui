export default function Home() {
    console.log('Environment '+process.env.NODE_ENV);
    console.log('REST API URL ' +process.env.REACT_APP_API_URI);
    return (<>
      <h1>Application Architecture</h1>
      <h2>Address Book to demonstrate React with Spring Boot REST API</h2>
      <div>
        <img src="./React UI with Spring Boot & Kafka.png" width="80%" height="80%" />
      </div>
    </>);
  }
  