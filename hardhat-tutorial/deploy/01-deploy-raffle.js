const { network, ethers } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../helper-hardhat-config");
const { verify } = require("../utils/verify");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("0.02");
module.exports = async function ({ getNamedAccounts, deployments }) {
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();
  const chainId = network.config.chainId; //   -----
  let vrfCoordinatorV2Address, subscriptionId, vrfCoordinatorV2Mock;

  if (developmentChains.includes(network.name)) {
    vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock");
    vrfCoordinatorV2Address = vrfCoordinatorV2Mock.address;
    const transactionResponse = await vrfCoordinatorV2Mock.createSubscription(); // --------
    const transactionReceipt = await transactionResponse.wait(1);
    subscriptionId = transactionReceipt.events[0].args.subId; // -----------
    // Fund the subscription
    // Usually, you'd need the Link token on real network
    await vrfCoordinatorV2Mock.fundSubscription(
      // ---------
      subscriptionId,
      VRF_SUB_FUND_AMOUNT
    );
  } else {
    vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
    subscriptionId = networkConfig[chainId]["subscriptionId"];
  }

  const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"];
  const interval = networkConfig[chainId].interval;
  const entranceFee = networkConfig[chainId]["entranceFee"];
  const gaseLane = networkConfig[chainId]["gasLane"];
  const args = [
    vrfCoordinatorV2Address,
    entranceFee,
    gaseLane,
    subscriptionId,
    callbackGasLimit,
    interval,
  ];
  console.log("deploying raffle")
  const raffle = await deploy("Raffle", {
    from: deployer,
    args: args,
    log: true,
    waitConfirmations: network.config.blockConfirmations || 1,
  });

  console.log("-------------------------------");
  console.log("Raffle deployed!");
  console.log("-------------------------------");
  // await vrfCoordinatorV2Mock.addConsumer(subscriptionId, raffle.address);
  if (
    !developmentChains.includes(network.name) &&
    process.env.POLYGONSCAN_API_KEY
  ) {
    log("Verifying...");
    await verify(raffle.address, args);

    log("___________________________________");
  }
};
module.exports.tags = ["all", "raffle"];
