import { ConnectButton , useConnection } from 'arweave-wallet-kit'
import React from 'react'
import { Link, json } from 'react-router-dom'
import {
  result,
  results,
  message,
  spawn,
  monitor,
  unmonitor,
  dryrun,
  createDataItemSigner
} from "@permaweb/aoconnect";

const Home = () => {



    const { connected, connect, disconnect } = useConnection();
    const LoomProcess = "inSyMPJA-dxAQ_E9Mw5wElBi6vZ_tXJ9OfM63Yk0Ods"
    const aoSigner = createDataItemSigner(window.arweaveWallet);

    const GenerateRandomPostion = () => {
      return [Math.random() * 3 ,  0 , Math.random() * 3]
    }
    const GenerateRandomHexColor = () => {
      return  "#" + Math.floor(Math.random()*16777215).toString(16); // i dont know what  this code means but it  works
    }

  

  async function loomConnect(){
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);

    const res = await message({
      process: LoomProcess,
      tags: [{name: "Action", value: "Connect" },],
      // data:  json
      signer: aoSigner,
      // data: window.arweaveWallet.getActiveAddress(),
    });
    console.log("Loom  result", res);

    const msgResult = await result({
      process: LoomProcess,
      message: res,
    });


    console.log(msgResult);}



  return (
    <div className='flex items-center justify-center h-full  text-center'>
        <section className=' text-center flex items-center justify-center  flex-col  '>

        <h1 className=' text-2xl '>Welcome to Loom</h1>
         {connected ? (
          <button >
            <Link to="/loom" >
              <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' onClick={loomConnect} >
              Explore Loom </button>
            </Link>
          </button>
        ) : (
          
        <ConnectButton
//   accent="rgb(255, 0, 0)"
profileModal={true}
showBalance={false}
showAddress={false}
showProfilePicture={true}
/>
        )}
        
        
</section>
    </div>
  )
}

export default Home