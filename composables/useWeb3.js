import { ethers } from "ethers";
import abi from "~/assets/contract.json";

export const useContractNFTs = () => {
  if (typeof window.ethereum === "undefined") {
    throw new Error("Ethereum provider not found. Please install MetaMask.");
  }

  // Conectar a Ethereum a través del proveedor de MetaMask
  const provider = new ethers.BrowserProvider(window.ethereum);

  // Direccion del contrato
  const contractAddress = "0xd705aCe869e4530c9Add3ff4317CBd2F918bC0F8"; // sepolia

  // Instancia del contrato usando solo el provider
  const contract = new ethers.Contract(contractAddress, abi, provider);

  const contractWithSigner = async () => {
    const signer = await provider.getSigner();
    return contract.connect(signer);
  };

  return { contract, provider, contractWithSigner };
};
