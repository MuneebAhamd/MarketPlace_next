import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import MarketplaceJSON from "../NFT.json";
import axios from "axios";
import { useEffect, useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";
import Table from "react-bootstrap/Table";

export default function SellPage(props) {
  const [data, updateData] = useState({});
  const [dataFetched, updateDataFetched] = useState(false);
  const [message, updateMessage] = useState("");
  const [activity, setActivity] = useState([]);
  const [currAddress, updateCurrAddress] = useState("0x");
  async function getNFTData(tokenId) {
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const addr = await signer.getAddress();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(
      MarketplaceJSON.address,
      MarketplaceJSON.abi,
      signer
    );
    //create an NFT Token
    console.log("======tokenId=========", tokenId);
    var tokenURI = await contract.tokenURI(tokenId);
    const listedToken = await contract.getTokenCreatorById(tokenId);
    tokenURI = GetIpfsUrlFromPinata(tokenURI);
    let meta = await axios.get(tokenURI);
    const price = await contract
      .getTokenDetails(tokenId)
      .then((details) => details.price);
    const history = await contract.getTokenDetails(tokenId);
    console.log(history);
    const data = await contract.getTokenDetails(tokenId);
    console.log(data);
    meta = meta.data;
    console.log(meta);
    console.log(listedToken);
    let item = {
      tokenId: tokenId,
      seller: data.owner,
      image: meta.image,
      name: meta.name,
      description: meta.description,
      history: data.ownershipHistory,
      price: ethers.utils.formatEther(price),
    };
    console.log(item);
    updateData(item);
    updateDataFetched(true);
    console.log("address", addr);
    updateCurrAddress(addr);
  }

  async function getNFTActivity(tokenId) {
    try {
      const ethers = require("ethers");
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const { priceHistory } = await contract.getTokenDetails(tokenId);

      const combinedHistory = [];
      let count = 0;
      for (let i = 0; i < priceHistory.length; i++) {
        if (priceHistory !== undefined) {
          combinedHistory.push({
            from: data.history[count],
            to: data.history[count + 1],
            price: ethers.utils.formatEther(priceHistory[i].toString()),
          });
          count = count + 2;
        }
      }

      setActivity(combinedHistory);
      //   setPriceHistoryFetched(true);
    } catch (error) {
      console.log("Error fetching NFT activity:", error);
    }
  }
  console.log(activity);

  async function buyNFT(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );
      const salePrice = ethers.utils.parseUnits(data.price, "ether");
      updateMessage("Buying the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.purchaseToken(tokenId, {
        value: salePrice,
      });
      await transaction.wait();
      console.log(transaction.hash);
      alert("You successfully bought the NFT!");
      updateMessage("");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }
  async function cancel(tokenId) {
    try {
      const ethers = require("ethers");
      //After adding your Hardhat network to your metamask, this code will get providers and signers
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //Pull the deployed contract instance
      let contract = new ethers.Contract(
        MarketplaceJSON.address,
        MarketplaceJSON.abi,
        signer
      );

      updateMessage("Cancel the NFT... Please Wait (Upto 5 mins)");
      //run the executeSale function
      let transaction = await contract.unlistToken(tokenId);
      await transaction.wait();
      alert("You successfully Cancel the NFT!");
      updateMessage("");
      window.location.replace("/");
    } catch (e) {
      alert("Upload Error" + e);
    }
  }

  useEffect(() => {
    getNFTActivity(tokenId);
  });

  console.log("=================================datraimag====", data.image);
  const params = useParams();
  const tokenId = params.tokenId;
  if (!dataFetched) getNFTData(tokenId);
  if (typeof data.image == "string")
    data.image = GetIpfsUrlFromPinata(data.image);
  return (
    <div style={{ "min-height": "100vh" }}>
      <Navbar></Navbar>
      <div
        className="flex ml-20 mt-40"
        style={{ alignContent: "center", justifyContent: "center" }}
      >
        <img
          src={data.image}
          alt=""
          className="w-2/5"
          style={{ height: "50vh", width: "50vh", borderRadius: "10px" }}
        />
        <div
          className="text-xl ml-20 space-y-8 text-white shadow-2xl rounded-lg border-2 p-5"
          style={{ height: "50vh", width: "50vh" }}
        >
          <div>Name: {data.name}</div>
          <div>Description: {data.description}</div>
          <div>
            Price: <span className="">{data.price + " ETH"}</span>
          </div>
          <div>
            Seller: <span className="text-sm">{data.seller}</span>
          </div>
          <div>
            {currAddress !== data.owner && currAddress !== data.seller ? (
              <>
                <button
                  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={() => buyNFT(tokenId)}
                >
                  Buy this NFT
                </button>
              </>
            ) : (
              <>
                <button
                  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-sm"
                  onClick={() => cancel(tokenId)}
                >
                  Cancel
                </button>

                <div className="text-emerald-700">
                  You are the owner of this NFT
                </div>
              </>
            )}

            <div className="text-green text-center mt-3">{message}</div>
          </div>
        </div>
      </div>
      <center>
        <h1
          style={{
            textAlign: "center",
            marginTop: "5%",
            marginBottom: "5%",
            marginLeft: "5%",
            fontSize: "25px",
            fontWeight: "bold",
            color: "#fff",
          }}
        >
          Item Activity
        </h1>

        <Table
          striped
          bordered
          hover
          style={{
            marginTop: "1%",
            width: "150px",
            background: "transparent",
            color: "white",
            border: "1px solid white",
            borderRadius: "10px",
            marginLeft: "6%",
            marginBottom: "5%",
          }}
        >
          <thead style={{ background: "transparent", paddingTop: "10px" }}>
            <tr>
              <th
                style={{
                  paddingTop: "40px",
                  paddingBottom: "50px",
                  paddingRight: "50px",
                  paddingLeft: "50px",
                }}
              >
                From
              </th>
              <th
                style={{
                  paddingTop: "40px",
                  paddingBottom: "50px",
                  paddingRight: "50px",
                  paddingLeft: "50px",
                }}
              >
                To
              </th>
              <th
                style={{
                  paddingTop: "40px",
                  paddingBottom: "50px",
                  paddingRight: "50px",
                  paddingLeft: "50px",
                }}
              >
                Price
              </th>
            </tr>
          </thead>
          <tbody>
            {activity.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    paddingLeft: "50px",
                    paddingBottom: "50px",
                    paddingLeft: "50px",
                    paddingTop: "0px",
                  }}
                >
                  {item.from}
                </td>
                <td
                  style={{
                    paddingLeft: "50px",
                    paddingBottom: "50px",
                    paddingTop: "0px",
                  }}
                >
                  {item.to}
                </td>
                <td
                  style={{
                    paddingLeft: "70px",
                    paddingBottom: "50px",
                    paddingTop: "0%",
                    paddingRight: "30px",
                  }}
                >
                  {item.price}&nbsp;ETH
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </center>
    </div>
  );
}
