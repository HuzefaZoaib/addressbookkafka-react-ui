import axios from "axios";
import { useEffect, useState, useRef } from "react";

const ADDRESSESS = [
  {id:1, name:"John", phone:"38495345", address:"Some Street 1"},
  {id:2, name:"Gautham", phone:"12495345", address:"Some Street 1"},
  {id:3, name:"Jerand", phone:"54495345", address:"Some Street 1"},
  {id:4, name:"Jerry", phone:"98495345", address:"Some Street 1"}
];

let MAX_ADDRESS_ID = 4;
let IS_API_SERVER_LIVE = true;

  function AddressRecord({addressess=[]}) {
    const records = addressess.map( address => 
      <tr>
        <td>{address.id}</td>
        <td>{address.name}</td>
        <td>{address.phone}</td>
        <td>{address.address}</td>
        <td>{address.zipCode}</td>
        <td>{address.generator}</td>
        <td>{address.consumer}</td>
      </tr>
    );
  
    return records;
  }
  
  let _responseData = [];
  let _consumedAddressess = [];

  export default function AddressList() {
  
    const consumedAddressess = useRef(_consumedAddressess);
    const interval = useRef();
    
    const [addressess, setAddressess] = useState(consumedAddressess.current);
    const [isApiServerLive, setIsApiServerLiver] = useState(IS_API_SERVER_LIVE);

    const consume = (url) => {
      console.log('Going to consume addressess');
      axios.get(url).then(response => {
        console.log(`Going to consume addressess: Response Data Length: ${response.data.length}`);
        processResponseData(response.data);
      }).catch(error => {console.error(error);})
    }

    const processResponseData = (response_data) => {
      if(response_data.length === 0) {
        console.log(`Addressess: clearing interval response data is empty`);
        clearInterval(interval.current);
      }
      _consumedAddressess = response_data.concat(consumedAddressess.current);
      setAddressess(_consumedAddressess);
      consumedAddressess.current = _consumedAddressess;
    }

    // Fetch records here or pass it through param
    useEffect(() => {

      interval.current = setInterval(() => { 
        consume(process.env.REACT_APP_COSUMER_API_URL)
      }, 5000);

      return () => {
        console.log(`Addressess: clearing interval from useEffect`);
        clearInterval(interval.current);
      };
    }, []); 
  
    return (<>
      <table>
        <thead>
          <tr>
            <th className="header">ID</th>
            <th className="header">Name</th>
            <th className="header">Phone</th>
            <th className="header">Address</th>
            <th className="header">Zip Code</th>
            <th className="header">Generator</th>
            <th className="header">Consumer</th>
          </tr>
        </thead>
        <tbody>
          <AddressRecord addressess={addressess} />
        </tbody>
      </table>
    </>);
  }
  
  export function updateAddressess(address) {
    MAX_ADDRESS_ID = MAX_ADDRESS_ID + 1;
    ADDRESSESS.push({id:MAX_ADDRESS_ID, name:address.name, phone:address.phone, address:address.address});
  }

  export function newDataLoad() {
    _consumedAddressess = [];
  }
