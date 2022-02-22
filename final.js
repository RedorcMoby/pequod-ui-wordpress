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
}function activateDynamicSwapForm(walletInfo, customerServerInfo) {
    const settingBalanceInfo = function() {
        jQuery('input#amount-input').keyup(function(v) {
            let bnbInfo = tokenInfo(customerServerInfo, 'BNB')
            jQuery('#amount-input span').text(`Amount (${(Number(bnbInfo.currentPrice) * Number(v.target.value)).toFixed(2)} USDT)`)
        })
        jQuery('#balance-input span').text(`Balance ${balanceFor(customerServerInfo, 'BNB')}`)
    }
    settingBalanceInfo()
}function hideAddress(address) {
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
}"use strict";

/**
 * Example JavaScript code that interacts with the page and Web3 wallets
 */
// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;
// Web3modal instance
let web3Modal
// Chosen wallet provider given by the dialog window
let provider;
// Address of the selected account
let selectedAccount;

/**
 * Setup the orchestra
 */
function init() {

    console.log("Initializing example");
    console.log("WalletConnectProvider is", WalletConnectProvider);
    console.log("Fortmatic is", Fortmatic);
    console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    if(location.protocol !== 'https:') {
        // https://ethereum.stackexchange.com/a/62217/620
        const alert = document.querySelector("#alert-error-https");
        alert.style.display = "block";
        document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
        return;
    }

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // Mikko's test key - don't copy as your mileage may vary
                infuraId: "8043bb2cf99347b1bfadfb233c5325c0",
            }
        },

        fortmatic: {
            package: Fortmatic,
            options: {
                // Mikko's TESTNET api key
                key: "pk_test_391E26A3B43A3350"
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

    console.log("Web3Modal instance is", web3Modal);
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {

    console.log("Opening a dialog", web3Modal);
    try {
        provider = await web3Modal.connect();
    } catch(e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        // fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        // fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
        // fetchAccountData();
    });

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);

    console.log("Web3 instance is", web3);

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts);
}

function getWeb3() {
    return new Web3(provider)
}

function initialClean() {
    jQuery('#div-trade').hide()
}
let achab = "https://pequod-server-development.herokuapp.com/"
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
