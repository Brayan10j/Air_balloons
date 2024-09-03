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

  const connect = async () => {
    try {
      // Solicitar acceso a la cuenta del usuario
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Intentar cambiar a la cadena de Ethereum deseada
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId }],
      });
    } catch (error) {
      if (error.code === 4902) {
        try {
          // Si la cadena no está disponible, intenta agregarla
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
        console.error("Error connecting to Web3:", error);
      }
    }
  };

  // Llamar la función de conexión inicial
  await connect();

  // Detectar cambios en la cuenta y en la red
  window.ethereum.on("accountsChanged", async (accounts) => {
    console.log("Cuentas cambiadas:", accounts);
    await connect(); // Volver a solicitar acceso y cambiar la cadena
  });

  window.ethereum.on("chainChanged", async (chainId) => {
    console.log("Red cambiada:", chainId);
    await connect(); // Volver a solicitar acceso y cambiar la cadena
  });
};
