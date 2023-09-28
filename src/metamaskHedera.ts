//import { Signer } from "@hashgraph/sdk/lib/Signer.js";
import abi from "./sc/abi.js";
import { ethers } from "ethers";
import { LedgerId, AccountId, Key, SignerSignature, AccountBalance, AccountInfo, TransactionRecord, Transaction, Executable } from "@hashgraph/sdk";

const network = "testnet";

/*

export async function connectMetaMask (): Promise<{selectedAccount:any,provider:ethers.providers.Web3Provider,network:string}>{
  console.log(`\n=======================================`);

	// ETHERS PROVIDER
	const provider = new ethers.providers.Web3Provider(window.ethereum, "any");

	// SWITCH TO HEDERA TEST NETWORK
	console.log(`- Switching network to the Hedera ${network}...🟠`);
	let chainId;
	if (network === "testnet") {
		chainId = "0x128";
	} else if (network === "previewnet") {
		chainId = "0x129";
	} else {
		chainId = "0x127";
	}

	await window.ethereum.request({
		method: "wallet_addEthereumChain",
		params: [
			{
				chainName: `Hedera ${network}`,
				chainId: chainId,
				nativeCurrency: { name: "HBAR", symbol: "ℏℏ", decimals: 18 },
				rpcUrls: [`https://${network}.hashio.io/api`],
				blockExplorerUrls: [`https://hashscan.io/${network}/`],
			},
		],
	});
	console.log("- Switched ✅");

	// CONNECT TO ACCOUNT
	console.log("- Connecting wallet...🟠");
	let selectedAccount;
	await provider
		.send("eth_requestAccounts", [])
		.then((accounts) => {
			selectedAccount = accounts[0];
			console.log(`- Selected account: ${selectedAccount} ✅`);
		})
		.catch((connectError) => {
			console.log(`- ${connectError.message.toString()}`);
			return;
		});
		

	return {selectedAccount:selectedAccount, provider:provider, network:network}
  
}

*/
export async function getPhoneNumber (hederaAccount:string,contractAddress:string ,signer:ethers.Signer): Promise<{peerId:string,aliveTopic:number} | null >{
	
		console.log(`\n=======================================`);
		console.log(`- Executing the smart contract...🟠`);
	
	
		// EXECUTE THE SMART CONTRACT
		let txHash;
		let peer;
		try {
			// CHECK SMART CONTRACT STATE
			//const initialCount = await getCountState();
			//console.log(`- Initial count: ${initialCount}`);
	
			// EXECUTE CONTRACT FUNCTION
			const gasLimit = 100000;
			const myContract = new ethers.Contract(contractAddress, abi, signer);
			peer = await myContract.hederaAddressToPeer(hederaAccount,{ gasLimit: gasLimit });
			
	
			// CHECK SMART CONTRACT STATE AGAIN
			//await delay(5000); // DELAY TO ALLOW MIRROR NODES TO UPDATE BEFORE QUERYING
	
			//finalCount = await getCountState();
			//console.log(`- Final count: ${finalCount}`);
			console.log(`- Contract executed. Transaction hash: \n${peer} ✅`);
		} catch (executeError) {
			console.log(`- ${executeError.message.toString()}`);
			return null
		}
	return {peerId:peer.peerID, aliveTopic:Number(peer.aliveTopic)}
}

/*
async function getCountState() {
	let countDec;
	const countInfo = await axios.get(`https://${walletData[2]}.mirrornode.hedera.com/api/v1/contracts/${contractAddress}/state`);
	//https://testnet.mirrornode.hedera.com/api/v1/topics/1795405/messages?limit=3&order=desc
	if (countInfo.data.state[0] !== undefined) {
		const countHex = countInfo.data.state[0].value;
		countDec = parseInt(countHex, 16);
	} else {
		countDec = 0;
	}
	return countDec;
}
*/

export async function tellHederaAboutAvailability  (contractAddress:string ,signer:ethers.Signer,aliveTopicNum:string,inVoiceTopicNum:string,peerID:string) : Promise<boolean> {

	console.log(`\n=======================================`);
		console.log(`- Executing the smart contract...🟠`);
	
		//const signer = provider.getSigner();
	
		// EXECUTE THE SMART CONTRACT
		let peer;
		try {
			// CHECK SMART CONTRACT STATE
			//const initialCount = await getCountState();
			//console.log(`- Initial count: ${initialCount}`);
	
			// EXECUTE CONTRACT FUNCTION
			const gasLimit = 2500000;
			const myContract = new ethers.Contract(contractAddress, abi, signer);
			peer = await myContract.putPeerAvailableSelf(aliveTopicNum, inVoiceTopicNum, peerID,{ gasLimit: gasLimit });
			
	
			// CHECK SMART CONTRACT STATE AGAIN
			//await delay(5000); // DELAY TO ALLOW MIRROR NODES TO UPDATE BEFORE QUERYING
	
			//finalCount = await getCountState();
			//console.log(`- Final count: ${finalCount}`);
			console.log(`- Contract executed. Transaction hash: \n${peer} ✅`);
		} catch (executeError) {
			console.log(`- ${executeError.message.toString()}`);
			alert("This didn't work")
			return false
		}
		return true
}

