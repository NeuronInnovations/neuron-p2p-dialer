const abi = [
	
		{
			"inputs": [],
			"name": "getPeerArraySize",
			"outputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"name": "hederaAddressToPeer",
			"outputs": [
				{
					"internalType": "string",
					"name": "peerID",
					"type": "string"
				},
				{
					"internalType": "uint64",
					"name": "aliveTopic",
					"type": "uint64"
				},
				{
					"internalType": "uint64",
					"name": "inVoiceTopic",
					"type": "uint64"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint256",
					"name": "",
					"type": "uint256"
				}
			],
			"name": "peerList",
			"outputs": [
				{
					"internalType": "address",
					"name": "",
					"type": "address"
				}
			],
			"stateMutability": "view",
			"type": "function"
		},
		{
			"inputs": [
				{
					"internalType": "uint64",
					"name": "aliveTopic",
					"type": "uint64"
				},
				{
					"internalType": "uint64",
					"name": "inVoiceTopic",
					"type": "uint64"
				},
				{
					"internalType": "string",
					"name": "peerID",
					"type": "string"
				}
			],
			"name": "putPeerAvailableSelf",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		}
	
]
export default abi;