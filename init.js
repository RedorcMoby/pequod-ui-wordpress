
let achab = "https://pequod-server-development.herokuapp.com"
jQuery(document).ready(function() {
    init();
    console.log("Init")
    initialClean()
    jQuery('#connect-wallet-button a').click(async function(event) {
        event.preventDefault();
        await onConnect()
        let walletInfo = await evaluateWalletInfo()
        getMirrorWallet(walletInfo.wallet, walletInfo.chainId).then(async mirrorWallet => {
            let customerServerInfo = await getCustomerInfo(walletInfo.wallet, walletInfo.chainId)
            await updatePageCustomerInfo(walletInfo, customerServerInfo)
            await activateDynamicSwapForm(walletInfo, customerServerInfo)
        })
    })
    console.log("ready")
})
