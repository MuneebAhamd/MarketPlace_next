import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';
import MarketplaceJSON from '../NFT.json';
import Navbar from './Navbar';
import { GetIpfsUrlFromPinata } from '../utils';
import Table from 'react-bootstrap/Table';

export default function SoldPage() {
  const [data, setData] = useState({});
  const [dataFetched, setDataFetched] = useState(false);
  const [message, updateMessage] = useState('');
  const [activity, setActivity] = useState([]);
  const [priceHistoryFetched, setPriceHistoryFetched] = useState(false);

  const params = useParams();
  
  const tokenId = params.tokenId;

  async function getNFTData(tokenId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
      const tokenURI = await contract.tokenURI(tokenId);
      const tokenURIWithIpfs = GetIpfsUrlFromPinata(tokenURI);
      const meta = await axios.get(tokenURIWithIpfs);
      const tokenDetails = await contract.getTokenDetails(tokenId);
      
      const item = {
        tokenId: tokenId,
        seller: tokenDetails.owner,
        image: meta.data.image,
        name: meta.data.name,
        description: meta.data.description,
        price: ethers.utils.formatEther(tokenDetails.price),
        sold: tokenDetails.isSold.toString(),
        creator: tokenDetails.creator,
        history: tokenDetails.ownershipHistory,
      };

      setData(item);
      setDataFetched(true);
      updateMessage('');
    } catch (error) {
      console.log('Error fetching NFT data:', error);
    }
  }

  async function getNFTActivity(tokenId) {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer);
      const { priceHistory } = await contract.getTokenDetails(tokenId);

      const combinedHistory = [];
      let count=0;
      for (let i = 0; i < priceHistory.length; i++) {
        if (priceHistory !== undefined) {
          combinedHistory.push({
            from: data.history[count],
            to: data.history[count + 1],
            price: ethers.utils.formatEther(priceHistory[i].toString())
          });
          count=count+2;
        }
      
      }

      setActivity(combinedHistory);
      setPriceHistoryFetched(true);
    } catch (error) {
      console.log('Error fetching NFT activity:', error);
    }
  }
  console.log(activity)

  useEffect(() => {
    if (!dataFetched) {
      getNFTData(tokenId);
    } else if (!priceHistoryFetched) {
      getNFTActivity(tokenId);
    }
  }, [dataFetched, priceHistoryFetched, tokenId]);

  


  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <div className="flex ml-20 mt-40" style={{ alignContent: 'center', justifyContent: 'center' }}>
        <img src={data.image} alt="" className="w-2/5" style={{ height: '60vh', width: '60vh', borderRadius: '10px' }} />
        <div className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5" style={{ height: '60vh',width: '60vh' }}>
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>Price: <span className="">{data.price + ' ETH'}</span></div>
          <div>Status: Sold</div>
          <div>Buyer: <span className="text-sm">{data.seller}</span></div>
          <div>Creator: <span className="text-sm">{data.creator}</span></div>
          <div><div className="text-green text-center mt-3">{message}</div></div>
          <div>
            
          </div>
        </div>
      </div>
      <center>
      <h1 style={{textAlign:"center",marginTop:"5%",marginBottom:'5%',marginLeft:'5%',fontSize:"25px",fontWeight:"bold",color:'#fff'}}>Item Activity</h1>
      
      <Table striped bordered hover style={{
  marginTop: "1%",
  width: "150px",
  background: "transparent",
  color: "white",
  border: "1px solid white",
  borderRadius: "10px",
  marginLeft: "6%",
  marginBottom:"5%",
  
}}>
  <thead style={{ background: "transparent", paddingTop: "10px" }}>
    <tr>
      <th style={{paddingTop:'40px',paddingBottom:'50px',paddingRight:'50px',paddingLeft:'50px'}}>From</th>
      <th style={{paddingTop:'40px',paddingBottom:'50px',paddingRight:'50px',paddingLeft:'50px'}}>To</th>
      <th style={{paddingTop:'40px',paddingBottom:'50px',paddingRight:'50px',paddingLeft:'50px'}}>Price</th>
    </tr>
  </thead>
  <tbody>
    {activity.map((item, index) => (
      <tr key={index}>
        <td style={{ paddingLeft: "50px",paddingBottom:'50px',paddingLeft:"50px",paddingTop:"0px"}}>{item.from}</td>
        <td style={{ paddingLeft: "50px",paddingBottom:'50px',paddingTop:"0px"}}>{item.to}</td>
        <td style={{ paddingLeft: "70px",paddingBottom:'50px', paddingTop: "0%",paddingRight:'30px' }}>{item.price}&nbsp;ETH</td>
      </tr>
    ))}
  </tbody>
</Table>
</center>

    </div>
  );
}
