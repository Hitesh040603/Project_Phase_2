import React, { useEffect, useState } from "react";
import { FormGroup, FormControl, Button, FormSelect } from "react-bootstrap";
import { API_BASE_URL } from "../config";
import { Link, withRouter } from "react-router-dom";

function ConductTransaction(props) {
    const [amount, setAmount] = useState(0);
    const [recipient, setRecipient] = useState('');
    const [chipId, setChipId] = useState('');
    const [chipMake, setChipMake] = useState('');
    const [currentStatus, setCurrentStatus] = useState('active');
    const [knownAddresses, setKnownAddresses] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE_URL}/known-addresses`)
            .then(response => response.json())
            .then(json => setKnownAddresses(json));
    }, []);

    const updateRecipient = event => setRecipient(event.target.value);
    const updateAmount = event => setAmount(Number(event.target.value));
    const updateChipId = event => setChipId(event.target.value);
    const updateChipMake = event => setChipMake(event.target.value);
    const updateCurrentStatus = event => setCurrentStatus(event.target.value);

    const submitTransaction = () => {
        // Step 1: Fetch the entire blockchain
        fetch(`${API_BASE_URL}/blockchain`)
            .then(response => response.json())
            .then(blockchain => {
                // Flatten all transactions from the blockchain
                const transactions = blockchain
                    .flatMap(block => block.data)
                    .filter(tx => tx.chip_info && tx.chip_info.chip_id === chipId);
    
                if (transactions.length > 0) {
                    // Get the most recent transaction for that chip
                    const lastTransaction = transactions[transactions.length - 1];
                    const lastStatus = lastTransaction.chip_info.current_status.toLowerCase();
                    const newStatus = currentStatus.toLowerCase();
    
                    // Apply transition logic
                    if (lastStatus === "active" && newStatus !== "inactive (expired)") {
                        alert("An active chip can only be marked as 'inactive (expired)'.");
                        return;
                    }
                    if (lastStatus === "inactive (expired)") {
                        alert("A chip marked as 'expired' cannot be reused.");
                        return;
                    }
                    if (lastStatus === "inactive (not in use)" && newStatus !== "active") {
                        alert("A 'not in use' chip can only be reactivated as 'active'.");
                        return;
                    }
                } else {
                    // Chip ID not found, only allow 'inactive (not in use)' for new chips
                    if (currentStatus.toLowerCase() !== "inactive (not in use)") {
                        alert("New chip entries must start with status 'inactive (not in use)'.");
                        return;
                    }
                }
    
                // If all validations pass, proceed with transaction
                fetch(`${API_BASE_URL}/wallet/transact`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        recipient,
                        amount,
                        chip_info: {
                            chip_id: chipId,
                            chip_make: chipMake,
                            current_status: currentStatus
                        }
                    })
                }).then(response => response.json())
                    .then(json => {
                        console.log('submitTransaction json', json);
                        if (window.confirm('Transaction successful. Go back to home?')) {
                            props.history.push('/');
                        }
                    });
            });
    };
    
    return (
        <div className="ConductTransaction">
            <Link className="nav-link" to="/">Home</Link>
            <hr />
            <h3>Conduct a Transaction</h3>
            <br />
            <FormGroup>
                <FormControl
                    input="text"
                    placeholder="Recipient"
                    value={recipient}
                    onChange={updateRecipient} />
            </FormGroup>
            <br />
            <FormGroup>
                <FormControl
                    input="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={updateAmount} />
            </FormGroup>
            <br />
            <h3>Chip Information</h3>
            <FormGroup>
                <FormControl
                    input="text"
                    placeholder="Chip ID"
                    value={chipId}
                    onChange={updateChipId} />
            </FormGroup>
            <br />
            <FormGroup>
                <FormControl
                    input="text"
                    placeholder="Chip Make"
                    value={chipMake}
                    onChange={updateChipMake} />
            </FormGroup>
            <br />
            <FormGroup>
                <FormSelect style={{ color: "black" }} value={currentStatus} onChange={updateCurrentStatus}>
                    <option value="active">Active</option>
                    <option value="inactive (not in use)">Inactive (Not in Use)</option>
                    <option value="inactive (expired)">Inactive (Expired)</option>
                </FormSelect>
            </FormGroup>
            <br />
            <div>
                <Button variant="danger" onClick={submitTransaction}>Submit</Button>
            </div>
            <br />
            <h4>Known Addresses</h4>
            <div>
                {knownAddresses.map((address, i) => (
                    <span key={address}>
                        <u>{address}</u>{i !== knownAddresses.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>
        </div>
    );
}

// Wrap with withRouter to get access to history
export default withRouter(ConductTransaction);
