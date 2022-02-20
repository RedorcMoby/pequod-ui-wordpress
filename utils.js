function hideAddress(address) {
    return address.substring(0, 5) + "..." + address.substring(address.length - 4, address.length)
}

function tokenInfo(customerServerInfo, symbol) {
    let tokens = customerServerInfo.personalWallet.tokens.filter(t => t.symbol === symbol)
    if (tokens.length === 0)
        return {}
    return tokens[0]
}

function balanceFor(customerServerInfo, symbol) {
    return tokenInfo(customerServerInfo, symbol).amount.toFixed(6)
}