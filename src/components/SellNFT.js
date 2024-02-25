// import Navbar from "./Navbar";
// import { useState } from "react";
// import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";

// import NFT from '../NFT.json';


// export default function SellNFT () {
//     const [formParams, updateFormParams] = useState({ name: '', description: ''
// });
//     const [fileURL, setFileURL] = useState(null);
//     const ethers = require("ethers");
//     const [message, updateMessage] = useState('');




//     async function disableButton() {
//         const listButton = document.getElementById("list-button")
//         listButton.disabled = true
//         listButton.style.backgroundColor = "grey";
//         listButton.style.opacity = 0.3;
//     }

//     async function enableButton() {
//         const listButton = document.getElementById("list-button")
//         listButton.disabled = false
//         listButton.style.backgroundColor = "#A500FF";
//         listButton.style.opacity = 1;
//     }

//     //This function uploads the NFT image to IPFS
//     async function OnChangeFile(e) {

//         var file = e.target.files[0];
//         console.log(file);
//         //check for file extension
//         try {
//             //upload the file to IPFS
//             disableButton();
//             updateMessage("Uploading image.. please dont click anything!")
//             const response = await uploadFileToIPFS(file);
//             if(response.success === true) {
//                 enableButton();
//                 updateMessage("")
//                 console.log("Uploaded image to Infura: ", response.IpfsURL)
//                 setFileURL(response.IpfsURL);
//             }
//         }
//         catch(e) {
//             console.log("Error during file upload", e);
//         }
//     }

//     //This function uploads the metadata to IPFS
//     async function uploadMetadataToIPFS() {
//         const {name, description} = formParams;
//         //Make sure that none of the fields are empty
//         if( !name || !description  || !fileURL)
//         {
//             updateMessage("Please fill all the fields!")
//             return -1;
//         }

//         const nftJSON = {
//             name, description, image: fileURL
//         }

//         try {
//             //upload the metadata JSON to IPFS
//             const response = await uploadJSONToIPFS(nftJSON);
//             if(response.success === true){
//                 console.log("Uploaded JSON to Infura: ", response)
//                 return response.IpfsURL;
//             }
//         }
//         catch(e) {
//             console.log("error uploading JSON metadata:", e)
//         }
//     }

//     async function listNFT(e) {
//         e.preventDefault();

//         //Upload data to IPFS
//         try {
//             const metadataURL = await uploadMetadataToIPFS();

//             if(metadataURL === -1){
//                 return;
//             }

//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();
//             console.log(signer)
//             disableButton();
//             updateMessage("Uploading NFT(takes 5 mins).. please dont click anything!")

//             let Nftcontract = new ethers.Contract(NFT.address, NFT.abi, signer)


//             //actually create the NFT
//             let transaction = await Nftcontract.mintToken(metadataURL)
//             console.log("------------------",transaction);
//             const tx=await transaction.wait();
//             console.log("txxxxxxxxxx--------",tx)
//             const event =tx.events[0];
//             const tokenId=event.args[2];


//             alert("Successfully Minted your NFT!");

//             enableButton();
//             updateMessage("");
//             updateFormParams({ name: '', description: ''});

//             window.location.replace("/profile")
//             return tokenId;

//         }
//         catch(e) {
//             alert( "Upload error"+e )
//         }
//     }


//     console.log("Working", process.env);
//     return (
//         <div className="">
//         <Navbar/>
//         <div className="flex flex-col place-items-center mt-10" id="nftForm">
//             <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
//             <h3 className="text-center font-bold text-purple-500 mb-8">Upload your NFT to the marketplace</h3>
//                 <div className="mb-4">
//                     <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="name">NFT Name</label>
//                     <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Axie#4563" onChange={e => updateFormParams({...formParams, name: e.target.value})} value={formParams.name}></input>
//                 </div>
//                 <div className="mb-6">
//                     <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="description">NFT Description</label>
//                     <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" cols="40" rows="5" id="description" type="text" placeholder="Axie Infinity Collection" value={formParams.description} onChange={e => updateFormParams({...formParams, description: e.target.value})}></textarea>
//                 </div>
//                 <div>
//                     <label className="block text-purple-500 text-sm font-bold mb-2" htmlFor="image">Upload Image (&lt;500 KB)</label>
//                     <input type={"file"} onChange={OnChangeFile}></input>
//                 </div>

//                 <br></br>
//                 <div className="text-red-500 text-center">{message}</div>
//      <button onClick={listNFT} className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg" id="list-button">
//                     List NFT
//                 </button> 

//             </form>
//         </div>
//         </div>
//     )
// }



import React, { useState } from "react";
import Navbar from "./Navbar";
import { uploadFileToIPFS, uploadJSONToIPFS } from "../pinata";
import NFT from "../NFT.json";

export default function SellNFT() {
  const [formParams, updateFormParams] = useState({ name: "", description: "" });
  const [fileURL, setFileURL] = useState(null);
  const [batchSize, setBatchSize] = useState(1); // New state for batch size
  const ethers = require("ethers");
  const [message, updateMessage] = useState("");

  async function disableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = true;
    listButton.style.backgroundColor = "grey";
    listButton.style.opacity = 0.3;
  }

  async function enableButton() {
    const listButton = document.getElementById("list-button");
    listButton.disabled = false;
    listButton.style.backgroundColor = "#A500FF";
    listButton.style.opacity = 1;
  }

  async function OnChangeFile(e) {
    var file = e.target.files[0];
    console.log(file);
    //check for file extension
    try {
      //upload the file to IPFS
      disableButton();
      updateMessage("Uploading image.. please don't click anything!");
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        enableButton();
        updateMessage("");
        console.log("Uploaded image to Infura: ", response.IpfsURL);
        setFileURL(response.IpfsURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  async function uploadMetadataToIPFS() {
    const { name, description } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !description || !fileURL) {
      updateMessage("Please fill all the fields!");
      return -1;
    }

    const nftJSON = {
      name,
      description,
      image: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Uploaded JSON to Infura: ", response);
        return response.IpfsURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  async function listNFT(e) {
    e.preventDefault();
    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();

      if (metadataURL === -1) {
        return;
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log(signer);
      disableButton();
      updateMessage("Uploading NFT (takes 5 mins).. please don't click anything!");
      // console.log(NFT.abi)
      let Nftcontract = new ethers.Contract(NFT.address, NFT.abi, signer);

      let transaction = await Nftcontract.mintNFT(metadataURL, batchSize); // Passing batchSize as the second argument
      console.log(transaction.hash);
      console.log(transaction.getBlockNumber)
      console.log("------------------", transaction);
      const tx = await transaction.wait();
      console.log("txxxxxxxxxx--------", tx);
      const event = tx.events[0];
      const tokenId = event.args[2];

      alert("Successfully Minted your NFT!");

      enableButton();
      updateMessage("");
      updateFormParams({ name: "", description: "" });

      // window.location.replace("/profile");
      return tokenId;
    } catch (e) {
      alert("Upload error" + e);
    }
  }

  console.log("Working", process.env);
  return (
    <div className="">
      <Navbar />
      <div className="flex flex-col place-items-center mt-10" id="nftForm">
        <form className="bg-white shadow-md rounded px-8 pt-4 pb-8 mb-4">
          <h3 className="text-center font-bold text-purple-500 mb-8">
            Upload your NFT to the marketplace
          </h3>
          <div className="mb-4">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="name"
            >
              NFT Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              type="text"
              placeholder="Axie#4563"
              onChange={(e) =>
                updateFormParams({ ...formParams, name: e.target.value })
              }
              value={formParams.name}
            ></input>
          </div>
          <div className="mb-6">
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="description"
            >
              NFT Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              cols="40"
              rows="5"
              id="description"
              type="text"
              placeholder="Axie Infinity Collection"
              value={formParams.description}
              onChange={(e) =>
                updateFormParams({
                  ...formParams,
                  description: e.target.value,
                })
              }
            ></textarea>
          </div>
          <div>
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="image"
            >
              Upload Image (&lt;500 KB)
            </label>
            <input type={"file"} onChange={OnChangeFile}></input>
          </div>
          <br />
          <div className="text-red-500 text-center">{message}</div>
          <div>
            <label
              className="block text-purple-500 text-sm font-bold mb-2"
              htmlFor="batchSize"
            >
              Number of NFTs to Mint
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="batchSize"
              type="number"
              min="1"
              placeholder="Enter batch size"
              onChange={(e) => setBatchSize(parseInt(e.target.value))}
              value={batchSize}
            />
          </div>
          <br />
          <button
            onClick={listNFT}
            className="font-bold mt-10 w-full bg-purple-500 text-white rounded p-2 shadow-lg"
            id="list-button"
          >
            MintNFT
          </button>
        </form>
      </div>
    </div>
  );
}


