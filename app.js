// Replace this with your actual contract address
const CONTRACT_ADDRESS = "0xb8c1d8f2ef5fb49720d2a9f99f77cf72e0e4c5da";

// Replace with your contract's ABI
const CONTRACT_ABI = [{"inputs":[{"internalType":"address","name":"_tokenAddress","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"big","type":"bool"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"BetBigSmall","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"payout","type":"uint256"}],"name":"Claim","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"resultBig","type":"bool"}],"name":"Draw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"roundId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"startBlock","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"closeBlock","type":"uint256"}],"name":"NewRound","type":"event"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"betBig","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"betSmall","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"currentRoundId","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"draw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"},{"internalType":"address","name":"user","type":"address"}],"name":"getBet","outputs":[{"internalType":"uint256","name":"big","type":"uint256"},{"internalType":"uint256","name":"small","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"roundId","type":"uint256"}],"name":"getRound","outputs":[{"internalType":"uint256","name":"startBlock","type":"uint256"},{"internalType":"uint256","name":"closeBlock","type":"uint256"},{"internalType":"uint256","name":"drawBlock","type":"uint256"},{"internalType":"bool","name":"drawn","type":"bool"},{"internalType":"bool","name":"resultBig","type":"bool"},{"internalType":"uint256","name":"totalBig","type":"uint256"},{"internalType":"uint256","name":"totalSmall","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"startNextRound","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"tokenAddress","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}]

let lotteryContract;
let userAccount;

async function connectMetamask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const web3 = new Web3(window.ethereum);
            const accounts = await web3.eth.requestAccounts();
            userAccount = accounts[0];

            lotteryContract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

            document.getElementById('wallet-status').textContent = '已连接MetaMask';
            document.getElementById('wallet-status').className = 'status connected';
            document.getElementById('account-address').textContent = userAccount.substring(0, 6) + '...' + userAccount.substring(userAccount.length - 4);
            document.getElementById('account-info').style.display = 'block';

            const balance = await web3.eth.getBalance(userAccount);
            const balanceBNB = (web3.utils.fromWei(balance, 'ether')).toFixed(4);
            document.getElementById('account-balance').textContent = balanceBNB;

            updateLotteryInfo();

        } catch (error) {
            console.error("连接失败:", error);
            alert('连接失败: ' + error.message);
        }
    } else {
        alert('请安装MetaMask钱包!');
    }
}

async function updateLotteryInfo() {
    if (!lotteryContract) return;

    try {
        const round = await lotteryContract.methods.currentRoundId().call();
        document.getElementById('current-round').textContent = round;
        console.log("当前轮次:", round);
    } catch (error) {
        console.error("获取彩票信息失败:", error);
    }
}

async function placeBet() {
    if (!userAccount) {
        alert('请先连接钱包!');
        return;
    }
    
    const betNumber = document.getElementById('bet-number').value;
    if (!betNumber || betNumber < 0 || betNumber > 999) {
        alert('请输入有效的三位数(0-999)!');
        return;
    }
    
    try {
        // Since we are using an ERC-20 token, we need to handle the amount differently.
        // The betBig and betSmall functions take a roundId and an amount.
        // Your code uses "bet(betNumber).send", which is for a different contract.
        // This part needs to be updated to match your contract's functions.
        alert('该功能需要根据您的合约函数进行修改！');

    } catch (error) {
        console.error('投注失败:', error);
        document.getElementById('status-text').textContent = '投注失败';
        alert('投注失败: ' + error.message);
    }
}

// 倒计时功能
function startCountdown() {
    let timeLeft = 5 * 60;
    const countdownElement = document.getElementById('countdown');
    
    function updateCountdown() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        countdownElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (--timeLeft < 0) {
            countdownElement.textContent = "开奖中...";
            setTimeout(() => {
                timeLeft = 5 * 60;
                updateCountdown();
            }, 3000);
        } else {
            setTimeout(updateCountdown, 1000);
        }
    }
    
    updateCountdown();
}

// 页面加载时初始化
window.addEventListener('load', function() {
    console.log("页面加载完成");
    startCountdown();
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', function(accounts) {
            if (accounts.length === 0) {
                document.getElementById('wallet-status').textContent = '未连接钱包';
                document.getElementById('wallet-status').className = 'status disconnected';
                document.getElementById('account-info').style.display = 'none';
                userAccount = null;
                lotteryContract = null;
            } else {
                connectMetamask();
            }
        });
        
        window.ethereum.on('chainChanged', function(chainId) {
            if (chainId !== '0x61') { // 检查是否是BSC测试网的Chain ID
                alert('请切换到BSC测试网！');
            }
        });
    }
});