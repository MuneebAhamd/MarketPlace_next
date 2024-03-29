import {
    Link,
  } from "react-router-dom";
  import { GetIpfsUrlFromPinata } from "../utils";
function SellTile (data) {
    // console.log("===========id========",JSON.parse(data));
    
    const newTo = {
       
        pathname:"/SellPage/"+data.data.tokenId
    }
    const IPFSUrl = GetIpfsUrlFromPinata(data.data.image);
    console.log(IPFSUrl);
// console.log(data)
    return (
        <Link to={newTo}>
        <div className="border-2 ml-12 mt-5 mb-12 flex flex-col items-center rounded-lg w-48 md:w-72 shadow-2xl">
            <img src={IPFSUrl} alt="" className="w-72 h-80 rounded-lg object-cover" crossOrigin="anonymous" />
            <div className= "text-white w-full p-2 bg-gradient-to-t from-[#454545] to-transparent rounded-lg pt-5 -mt-20">
                <strong className="text-xl">{data.data.name}</strong>
                <p className="display-inline">
                    {data.data.description}
                </p>
                 <p className="display-inline">
                    {data.data.price}
                </p>
            </div>
        </div>
        </Link>
    )
}

export default SellTile;





