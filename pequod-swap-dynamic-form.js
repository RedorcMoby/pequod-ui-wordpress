function activateDynamicSwapForm(walletInfo, customerServerInfo) {
    const settingBalanceInfo = function() {
        jQuery('input#amount-input').keyup(function(v) {
            let bnbInfo = tokenInfo(customerServerInfo, 'BNB')
            jQuery('#amount-input span').text(`Amount (${(Number(bnbInfo.currentPrice) * Number(v.target.value)).toFixed(2)} USDT)`)
        })
        jQuery('#balance-input span').text(`Balance ${balanceFor(customerServerInfo, 'BNB')}`)
    }
    settingBalanceInfo()
}