

import { noise } from '@chainsafe/libp2p-noise'
import { createLibp2p, Libp2p } from 'libp2p'
import { webTransport } from '@libp2p/webtransport'
import { bootstrap } from '@libp2p/bootstrap'
import { tcp} from '@libp2p/tcp';
import { identity } from 'multiformats/hashes/identity'
import { peerIdFromKeys,peerIdFromString} from '@libp2p/peer-id'

//import { MemoryBlockstore } from 'blockstore-core/memory'
import { identifyService } from 'libp2p/identify'
//x§import { dcutrService } from 'libp2p/dcutr'
import { kadDHT } from '@libp2p/kad-dht'

//import { webRTCDirect, webRTC } from '@libp2p/webrtc'
//import { webSockets } from '@libp2p/websockets'



const bootstrapers = [
  '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
   '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa' 
]


export async function setupLibp2p (): Promise<{libp2p:Libp2p}>{
  
  //fixedPeerId = await peerIdFromKeys(pubKey,privKey);

  const node = await createLibp2p({
    //peerId: fixedPeerId,
    transports: [
      //webSockets(),
      webTransport(),
      
      //webRTC(),
      //webRTCDirect(), 
      ],
  
    services: { 
      //dht:  kadDHT(),
      //identify: identifyService(),
      //dcutr: dcutrService()
    },
    connectionEncryption: [noise()],
    //connectionManager:{addressSorter:true},
    // this is only necessary when dialing local addresses
    connectionGater: {
      denyDialMultiaddr: async () => false
    },
    /*
    peerDiscovery: [
      bootstrap({
        list: [ // a list of bootstrap peer multiaddrs to connect to on node startup
          "/ip4/104.131.131.82/tcp/4001/ipfs/QmaCpDMGvV2BGHeYERUEnRQAwe3N8SzbUtfsmvsqQLuvuJ",
          "/dnsaddr/bootstrap.libp2p.io/ipfs/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN",
          "/dnsaddr/bootstrap.libp2p.io/ipfs/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa"
        ],
        timeout: 1000, // in ms,
        tagName: 'bootstrap',
        tagValue: 50,
        tagTTL: 120000 // in ms
      })
    ]
    */
  })




  await node.start()

  return {libp2p: node};
}




