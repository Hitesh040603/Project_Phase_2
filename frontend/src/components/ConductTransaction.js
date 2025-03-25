import React, {useEffect, useState} from "react";
import { FormGroup,FormControl, Button } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ConductTransaction(){
    const [amount, setAmount]=useState(0);
    const [recipient, setRecipient]=useState('');
    const[knownAddresses,setknownAddresses]=useState([]);

    useEffect(() =>{
        fetch(`${API_BASE_URL}/known-addresses`)
        .then(response =>response.json())
        .then(json=> setknownAddresses(json));
    },[]);


    const updateRecipient =event => {
        setRecipient(event.target.value);
    }

    const updateAmount =event => {
        setAmount(Number(event.target.value));
    }

    const submitTransaction=()=>{
        fetch(`${API_BASE_URL}/wallet/transact`,
            {method: 'POST',
            headers: {'Content-Type':'application/json'},
            body: JSON.stringify({recipient,amount})
        }).then(response =>response.json())
        .then(json=> {
            console.log('submitTransaction json',json);
            alert('Success')
        })
    }


    return(
        <div className="ConductTransaction">
            <Link to="/">Home</Link>
            <hr/>
            <h3>Conduct a Transaction</h3>
            <br/>
            <FormGroup>
                <FormControl
                input="text"
                placeholder="recipient"
                value={recipient}
                onChange={updateRecipient}/>
            </FormGroup>

            <br/>
            <FormGroup>
                <FormControl
                input="number"
                placeholder="amount"
                value={amount}
                onChange={updateAmount}/>
            </FormGroup>
            <div>
                <Button
                variant="danger"
                onClick={submitTransaction}>Submit</Button>
            </div>
            <br/>
            <h4>Known Addresses</h4>
            <div>
                {
                    knownAddresses.map((knownAddresses,i)=>(
                        <span key={knownAddresses}>
                            <u>{knownAddresses}</u>{i!== knownAddresses.length -1 ?', ' :''} 
                        </span>
                    ))
                }

            </div>
        </div>
    )


}
export default ConductTransaction

