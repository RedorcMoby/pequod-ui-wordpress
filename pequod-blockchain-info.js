async function updatePageCustomerInfo(customerInfo, customerServerInfo) {
    jQuery('#connect-wallet-button a').text(hideAddress(customerInfo.wallet))
}

async function evaluateWalletInfo() {
    let eth = getWeb3().eth
    let account = (await eth.getAccounts())[0]
    let chainId = parseInt(eth.currentProvider.chainId, 16)
    return {wallet: account, chainId: chainId }
}

function signPhrase(account, phrase) {
    return getWeb3().eth.personal.sign(phrase, account, "");
}

