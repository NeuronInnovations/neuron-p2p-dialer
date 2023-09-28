import './style.css'

import { multiaddr } from '@multiformats/multiaddr'
import { setupLibp2p as libp2pSetup } from './libp2p'
import {  getPhoneNumber, tellHederaAboutAvailability } from './metamaskHedera'
import { pipe } from 'it-pipe'
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import { ethers } from 'ethers'
//import { Buffer } from "buffer";

//import { peerIdFromString } from '@libp2p/peer-id'
//import { CID, fromJSON } from 'multiformats/cid'
//import all from 'it-all'
//import first from 'it-first'
import randomLocation from 'random-location'
import axios from 'axios'
import CryptoJS from 'crypto-js'
import { Client, PrivateKey, TopicCreateTransaction, TopicMessageSubmitTransaction } from '@hashgraph/sdk'
import { Libp2p } from 'libp2p/dist/src'
//import SignatureMap from '@hashgraph/sdk/lib/transaction/SignatureMap'
//import NodeAccountIdSignatureMap from '@hashgraph/sdk/lib/transaction/NodeAccountIdSignatureMap'
//import { TransactionDescription } from 'ethers/lib/utils'
//import Web3, { eth } from 'web3'
//import { Connection } from '@libp2p/interface/dist/src/connection'
//import { create } from 'multiformats/dist/types/src/hashes/digest'
//import { Libp2p } from 'libp2p/dist/src'
//import { ServiceMap } from '@libp2p/interface/dist/src'



const contractAddress = "0x7c2d149301d2f50a7f684e4726a6db2d2f33f433";



declare global {
  interface Window {
    privateKeyInput: HTMLInputElement
    privateKeyBtn: HTMLButtonElement

    accNoSpan: HTMLLinkElement
    ethPkSpan: HTMLSpanElement
    balanceSpan: HTMLSpanElement

    goAliveBtn: HTMLButtonElement

    aliveTopicSpan: HTMLLinkElement
    inVoiceTopicSpan: HTMLLinkElement
    peerIdSpan: HTMLSpanElement
    fetchBtn: HTMLButtonElement
    connectBtn: HTMLButtonElement
    sayHiBtn: HTMLButtonElement
    peerInput: HTMLInputElement
    cidInput: HTMLInputElement
    statusEl: HTMLParagraphElement
    //downloadEl: HTMLAnchorElement
    downloadCidWrapperEl: HTMLDivElement
    connlistWrapperEl: HTMLDivElement
    connlistEl: HTMLUListElement



  }
}

let ethPrivateKey: string
let wl: ethers.Wallet
let hederaPrivateKey: PrivateKey // hedera pk
let hederaClient: Client
let conn: Connection
let libp2p:Libp2p




(async function () {
 const libp2p =  (await libp2pSetup()).libp2p;

  window.peerIdSpan.innerHTML =  libp2p.peerId.toString();

  //localStorage.setItem('privatekey', );
  const storedKey = localStorage.getItem("ethPrivateKey");

  if (storedKey != null) {
    ethPrivateKey = storedKey;
    window.privateKeyInput.value = ethPrivateKey;
  }

  window.privateKeyBtn.onclick = async () => {
    if (window.privateKeyInput.value == "") {
      alert("can't use that key");
    } else {
      ethPrivateKey = window.privateKeyInput.value;
    }

    const prv = new ethers.providers.JsonRpcProvider({
      url: "https://testnet.hashio.io/api",
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    })

    wl = new ethers.Wallet(ethPrivateKey, prv);
    hederaPrivateKey = PrivateKey.fromStringECDSA(ethPrivateKey);
    // if you got here then the private key seems to work
    localStorage.setItem("ethPrivateKey", ethPrivateKey);

    const accountInfo = await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/accounts/${wl.address}`);
    window.accNoSpan.innerHTML = accountInfo.data.account
    window.accNoSpan.href = `https://hashscan.io/testnet/account/${accountInfo.data.account}`
    window.ethPkSpan.innerHTML = accountInfo.data.evm_address;


    setInterval(
      function () {
        prv.getBalance(wl.address).then(balance => {
          window.balanceSpan.innerHTML = (Number(balance.toBigInt() / BigInt(1_000_000_000_000)) / 1_000_000).toString()
        });
      }, 10_000
    );

    hederaClient = Client.forTestnet();
    hederaClient.setOperator(accountInfo.data.account, hederaPrivateKey)


  }


  /*
  libp2p.addEventListener('peer:discovery', async function (peerId) {
    console.log('found peer: ', peerId)
    let rpeer = peerIdFromString("12D3KooWRLtcFUPnjDfk2wDTwe6ukPKikAF4WXz5WaHA4S3K4dW2");
    const pstore = await libp2p.peerStore.all()
    console.log(pstore)
    //const peerfound = await libp2p.peerRouting.findPeer(rpeer)
    // representation of "seller" as a CID because go does a translation of namespace to CID
    // this guy knows how to do the multihashes. https://discuss.libp2p.io/t/problem-with-dht-provide-using-bootstrap-nodes/1577/1
    let cid = CID.parse("bafkreifee6pk4r5ku5ax3jregr4vuai4zmhmq4hx6vtenumbwviavcjkti")
    //const provdr = await libp2p.contentRouting.provide(cid)
    //console.log("provided", provdr)
    for await (const provider of libp2p.contentRouting.findProviders(cid)) {
      console.log(provider.id, provider.multiaddrs)
    }
})
*/



  //let metamaskStuff: { selectedAccount: any, provider: ethers.providers.Web3Provider, hederanetworkType: string }
  /*
  if (true) {
    alert("There's no metamask or connected account")
  } else {
    const metamaskStuff = await metamaskHederaConnect();
    //console.log(metamaskStuff.selectedAccount)
    metamaskStuff.provider.getBalance(metamaskStuff.selectedAccount).then(balance => {
      //console.log(balance.toBigInt())
      window.balanceDiv.innerHTML = balance.toBigInt().toString()
    })
    
    */




  // grab a fresh topic.

  window.goAliveBtn.onclick = async () => {
    const createTopic = async (name:string) : Promise<string> => {
        const trx = await new TopicCreateTransaction()
        .setTopicMemo(name)
        .setTransactionMemo(name)
        .execute(hederaClient)
      const topic = await trx.getReceipt(hederaClient)
      const topicNumStr: string = (topic.topicId == null) ? "" : topic.topicId.num.toString();
      return topicNumStr   
    }

    const aliveTopicNumStr = await createTopic("alive");
    window.aliveTopicSpan.innerHTML = aliveTopicNumStr;
    window.aliveTopicSpan.href = `https://hashscan.io/testnet/topic/0.0.${aliveTopicNumStr}`
    
    const inVoiceTopicNumStr = await createTopic("in-Voice");
    window.inVoiceTopicSpan.innerHTML = inVoiceTopicNumStr;
    window.inVoiceTopicSpan.href = `https://hashscan.io/testnet/topic/0.0.${inVoiceTopicNumStr}`
    

    // get the geolocation from the browser so that it can be 
    // sent to the smart contract.
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        const myRandomLocation = randomLocation.randomCirclePoint(position.coords, 1000)
        setInterval(function () {
          new TopicMessageSubmitTransaction()
            .setTopicId(aliveTopicNumStr)
            .setMessage(`{\"location\":{"lat":${myRandomLocation.latitude},"lon":${myRandomLocation.longitude},"alt":0},\"own\":\""}`)
            .execute(hederaClient)
        }, 8_000);
      });
    } else {
      //x.innerHTML = "Geolocation is not supported by this browser.";
    }
    let announced = await tellHederaAboutAvailability(contractAddress, wl, aliveTopicNumStr, inVoiceTopicNumStr, libp2p.peerId.toString())
    if (announced == false) {
    }

  }


  /*
  const transaction = new TopicCreateTransaction()
    .setNodeAccountIds([AccountId.fromString("0.0.3")])

    .setSubmitKey(PublicKey.fromStringECDSA("0x02d682d634d99f9fae39c0893d3d8d2352e1ac2230d45c0a7ab15d9943666c10bd"))
    //.setNodeAccountIds([AccountId.fromString("0.0.3")])
    .setTransactionId(TransactionId.generate("0.0.1583594"))



  //.setInitialBalance(Hbar.fromTinybars(1000));

  //Freeze the transaction for signing;

  //The transaction cannot be modified after this point
  const freezeTransaction = transaction.freeze();

  console.log(freezeTransaction.toString());
  //freezeTransaction.toBytes
  const signature = await metamaskStuff.provider.getSigner().signMessage(Buffer.from(freezeTransaction.toBytes()).toString("base64"))
  //const signatureTx = await metamaskStuff.provider.getSigner().signTransaction( ).toString("base64"))

  const signed = freezeTransaction.addSignature(PublicKey.fromStringECDSA("0x02d682d634d99f9fae39c0893d3d8d2352e1ac2230d45c0a7ab15d9943666c10bd"), uint8ArrayFromString(signature))
  // const vierifySigns = await freezeTransaction.getSignaturesAsync()

  const dondeal = await signed.getTransactionHash();
  const result = await freezeTransaction.execute(hederaClient);
  let conn: any = null;
  
  */


  // on click send a high5
  window.connectBtn.onclick = async () => {
    try {
      //console.log(libp2p)

      let dialInfo = await getPhoneNumber(window.peerInput.value, contractAddress, wl)
      if (dialInfo == null) {
        alert("address not providing service")
        return;
      }
      console.log(dialInfo)

      const topicInfo = await axios.get(`https://testnet.mirrornode.hedera.com/api/v1/topics/${dialInfo.aliveTopic}/messages?limit=3&order=desc`);
      const encryptedDialAddr: string = JSON.parse(atob(topicInfo.data.messages[0].message)).own

      //var ciphertext = encryptedDialAddr;
      //var key = "passphrasewhichneedstobe32bytes!";
      //var iv = "my16digitIvKey12";
      const iv = CryptoJS.enc.Hex.parse(encryptedDialAddr.substr(0, 32))
      const ct = CryptoJS.enc.Hex.parse(encryptedDialAddr.substr(32))
      const key = CryptoJS.enc.Utf8.parse("passphrasewhichneedstobe32bytes!")
      // @ts-ignore !!!!!!!! IMPORTANT IF YOU USE TYPESCRIPT COMPILER
      const decrypted = CryptoJS.AES.decrypt({ ciphertext: ct }, key, {
        mode: CryptoJS.mode.CBC,
        iv: iv
      })

      //console.log("Result : " + decrypted.toString(CryptoJS.enc.Utf8))
      const mas = decrypted.toString(CryptoJS.enc.Utf8).replaceAll(/\[|\]/g, "").split(" ").filter(m => m.includes('webtransport'))[0] + "/p2p/" + dialInfo.peerId
      const ma = multiaddr(mas);
      console.log("The multiaddress is" + ma);

      //const conn = await libp2p.dial(ma);
      //let rpeer = peerIdFromString("12D3KooWRLtcFUPnjDfk2wDTwe6ukPKikAF4WXz5WaHA4S3K4dW2");
      //const pstore = await libp2p.peerStore.all()
      //console.log(pstore)
      //const peerfound = await libp2p.peerRouting.findPeer(rpeer)
      // representation of "seller" as a CID because go does a translation of namespace to CID
      //let cid = CID.parse("bafkreifee6pk4r5ku5ax3jregr4vuai4zmhmq4hx6vtenumbwviavcjkti")

      //const provdr = await libp2p.contentRouting.provide(cid)
      //console.log("provided", provdr)
      //for await (const provider of libp2p.contentRouting.findProviders(cid)) {
      //  console.log(provider.id, provider.multiaddrs)
      // }

      conn = await libp2p.dial(ma);
      //console.log("connected  "+libp2p.peerId.toString())
      const stream = await conn.newStream(['/nrn-protocol-id/1.0.0']);
      //console.log("Sending 'hey' to peer");
      const start = performance.now();
      pipe(
        // Source data
        [uint8ArrayFromString('hey\n')],
        // Write to the stream, and pass its output to the next function
        stream,
        // Sink function
        async function (source) {
          // For each chunk of data
          for await (const data of source) {
            // Output the data
            const end = performance.now();
            updateConnList('received echo from peer:' + uint8ArrayToString(data.subarray()) + " in " + (end - start) + " ms")
          }
        }
      )
    } catch (e) {
      alert("That multiaddr is botched " + e);
    }
  }

  window.sayHiBtn.onclick = async () => {
    const stream = await conn.newStream(['/nrn-protocol-id/1.0.0']);

    const start = performance.now();
    pipe(
      // Source data
      [uint8ArrayFromString('hey\n')],
      // Write to the stream, and pass its output to the next function
      stream,
      // Sink function
      async function (source) {
        // For each chunk of data
        for await (const data of source) {
          // Output the data
          const end = performance.now();
          updateConnList('received echo from peer:' + uint8ArrayToString(data.subarray()) + " in " + (end - start) + " ms")
        }
      }
    )
  }

  // get the geolocation from the browser so that it can be 
  // sent to the smart contract.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position)
      let o = randomLocation.randomCirclePoint(position.coords, 1000)
      console.log(o)
    });
  } else {
    //x.innerHTML = "Geolocation is not supported by this browser.";
  }

  libp2p.addEventListener('peer:connect', (_connection) => {
    updateConnList()
  })
  libp2p.addEventListener('peer:disconnect', (_connection) => {
    updateConnList()
  })

  function updateConnList(message?: string) {
    const addrs = libp2p.getConnections().map(c => c.remoteAddr.toString())
    if (addrs.length > 0) {
      //window.downloadCidWrapperEl.hidden = false
      window.connlistWrapperEl.hidden = false
      window.connlistEl.innerHTML = '';
      addrs.forEach(a => {
        const li = document.createElement('li')
        li.innerText = `addr:${a} - pingtime:${message}`;
        window.connlistEl.appendChild(li)
      })
    } else {
      //window.downloadCidWrapperEl.hidden = true
      window.connlistWrapperEl.hidden = true
      window.connlistEl.innerHTML = ''
    }
  }
  /*
   window.fetchBtn.onclick = async () => {
     const c = CID.parse(window.cidInput.value)
     window.statusEl.hidden = false
     const val = await bitswap.want(c)
     window.statusEl.hidden = true
 
     window.downloadEl.href = window.URL.createObjectURL(new Blob([val], { type: 'bytes' }))
     window.downloadEl.hidden = false
   }
   */
  // eslint-disable-next-line no-console
}
)()
