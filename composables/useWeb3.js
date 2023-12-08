import Web3 from "web3";
import abi from "~/assets/contract.json";

// try import from pubilic folder

export const useContractNFTs = () => {
  //const {data } = await useFetch("/Contracts/ABIS/contract.json")
  const web3 = new Web3(window.ethereum);
  return new web3.eth.Contract(
    abi,
    "0x44152b5Cb390dC56B471c2dEd5fFD9D54B2d2483"
  );
};
