export const useConnectWeb3 = async () => {
  try {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: "0x13881" }],
    });
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x13881",
              chainName: "Mumbai",
              rpcUrls: [
                "https://matic-mumbai.chainstacklabs.com",
                "https://rpc-mumbai.matic.today",
              ],
            },
          ],
        });
      } catch (addError) {
        console.log(addError);
      }
    } else {
      console.log(switchError);
    }
  }
};
