const { assert, expect } = require("chai");
const { getNamedAccounts, deployments, ethers, network } = require("hardhat");
const {
  developmentChains,
  networkConfig,
} = require("../../helper-hardhat-config");

developmentChains.includes(network.name)
  ? describe.skip
  : describe("Raffle Unit Test", function () {
      let raffle, raffleEntranceFee, deployer;

      beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer;
        raffle = await ethers.getContract("Raffle", deployer);
        raffleEntranceFee = await raffle.getEntranceFee();
      });
      describe("fulfillRandomness", function () {
        console.log("entered the function");
        it("work with live Chainlink Keepers and Chainlink VRF, we get a random winner", async function () {
          console.log("entering to the raffle");
          // enter the raffle
          const startingTimestamp = await raffle.getLatestTimeStamp();
          const accounts = await ethers.getSigners();

          // setup listener before we enter the raffle
          // just in case blockchain moves really fast
          await new Promise(async (resolve, reject) => {
            raffle.once("WinnerPicked", async () => {
              console.log("WinnerPicked event fired!");
              try {
                // add our asserts here
                const recentWinner = await raffle.getRecentWinner();
                const raffleState = await raffle.getRaffleState();
                const winnerEndingBalance = await accounts[0].getBalance();
                const endingTimeStamp = await raffle.getLatestTimeStamp();

                await expect(raffle.getPlayers(0)).to.be.reverted;
                console.log("get players");

                assert.equal(recentWinner.toString(), accounts[0].address);
                console.log("recent winner");
                assert.equal(raffleState, 0);
                console.log("raffle state");
                console.log("getting winner balance...");
                console.log(winnerEndingBalance);
                console.log(winnerStartingBalance);
                console.log(raffleEntranceFee);
                assert.equal(
                  winnerEndingBalance.toString(),
                  winnerStartingBalance.add(raffleEntranceFee).toString()
                );
                console.log("got winner balance");
                console.log("startingTimestamp: ", startingTimestamp.toString());
                console.log("ending Timestamp: ", endingTimeStamp.toString());
                expect(endingTimeStamp.toString() > startingTimestamp.toString());
                resolve();
              } catch (error) {
                console.log(error);
                reject(error);
              }
            });
            // then entering the raffle
            const tx = await raffle.enterRaffle({ value: raffleEntranceFee });
            await tx.wait(1);
            const winnerStartingBalance = await accounts[0].getBalance();
          });
        });
      });
    });
