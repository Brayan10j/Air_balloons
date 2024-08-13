export const useConnectWeb3 = async () => {
  const chainId = "0xaa36a7"; // Sepolia Testnet
  const chainName = "Sepolia";
  const rpcUrls = [
    "wss://ethereum-sepolia-rpc.publicnode.com",
    "https://eth-sepolia.api.onfinality.io/public",
  ];

  if (typeof window.ethereum === "undefined") {
    console.error("Ethereum provider not found. Please install MetaMask.");
    return;
  }

  try {
    // Solicitar acceso a la cuenta del usuario
    await window.ethereum.request({ method: "eth_requestAccounts" });

    try {
      // Intentar cambiar a la cadena de Ethereum deseada
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (switchError) {
      // Si la cadena no está disponible en MetaMask, intenta agregarla
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId,
                chainName,
                rpcUrls,
              },
            ],
          });
        } catch (addError) {
          console.error("Error adding Ethereum chain:", addError);
        }
      } else {
        console.error("Error switching Ethereum chain:", switchError);
      }
    }
  } catch (error) {
    console.error("Error connecting to Web3:", error);
  }
};
