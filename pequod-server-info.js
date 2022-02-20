async function getCustomerInfo(wallet, chainId) {
    return (await axios.get(`${achab}/multichain/users/${wallet}/${chainId}/info`)).data
}

async function getPhraseToSign(wallet, chainId) {
    return (await axios.get(`${achab}/multichain/wallets/phraseToSignForChain/${wallet}/${chainId}`)).data
}

async function getMirrorWallet(wallet, chainId) {
    let bnbMirrorWallet = (await axios.get(`${achab}/multichain/wallets/mirror/${wallet}/${chainId}`)).data
    if (bnbMirrorWallet === "") {
        let phraseToSign = await getPhraseToSign(wallet, chainId)
        return signPhrase(wallet, phraseToSign).then(signed => {
            return axios.post(`${achab}/multichain/wallets/init`, {wallet: wallet, chainId: chainId, signed: signed})
        })
    } else
        return Promise.resolve(bnbMirrorWallet)
}