// src/Main.js
import React, { useRef } from 'react'
import { Parallax, ParallaxLayer } from '@react-spring/parallax'
import { useWeb3React } from '@web3-react/core';
import { NavLink } from 'react-router-dom';
import PrizeDistribution from '../components/PrizeDistribution';
import CountdownToMidnight from '../components/CountdownToMidnight';
import shiba1 from '../assets/images/logo.png';
import shiba2 from '../assets/images/logo_2.png';
import shiba3 from '../assets/images/prize_distribution.png';
import { ContractAddresses } from '../web3/contractAddresses';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faTicket } from '@fortawesome/free-solid-svg-icons';
import WalletConnector from '../components/WalletConnector';

const Main = () => {

  const parallax = useRef(null);
  const { account } = useWeb3React();

  return (
    <div className='bg-gray-800'>
      <Parallax pages={4} ref={parallax}>

        <ParallaxLayer
          offset={0.3}
          speed={1.5}
        >

          <div className='w-full text-center'>
            <h1 className='text-4xl font-extrabold text-yellow-600'>Lucky Shiba</h1>
            <p className='text-2xl font-bold text-white mt-4'>The lottery game designed with GPT-4</p>
          </div>

        </ParallaxLayer>

        <ParallaxLayer
          offset={0.75}
          speed={1.5}
        >

          <div className='w-full text-white flex items-center justify-center cursor-pointer' onClick={() => parallax.current.scrollTo(.5)}>
            <div
              className='w-32 mx-4'
              style={{
                borderBottom: "1px solid white",
                height: "1px"
              }}>
            </div>
            <div className='mt-1 animate__animated animate__infinite animate__bounce'>
              <FontAwesomeIcon icon={faCaretDown} size="3x"></FontAwesomeIcon>
            </div>
            <div
              className='w-32 mx-4'
              style={{
                borderBottom: "1px solid white",
                height: "1px"
              }}>
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={0.9}
          speed={0.5}
          style={{ width: '25%', marginLeft: '15%' }}
        >
          <img
            src={shiba1}
            alt="Lotto Shiba"
            className="rounded-full object-cover"
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={0.9}
          speed={0.5}
          style={{ width: '35%', marginLeft: '50%' }}
        >
          <div className='bg-gray-600 p-4 rounded-xl'>
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">Lucky Shiba</h1>            
            <h2 className="mb-8 text-2xl font-bold text-yellow-500">
              {ContractAddresses.LuckyShiba}
            </h2>
            <p className="mb-8 text-xl text-white">
              A decentralized lottery game built on the Polygon blockchain using
              Solidity, OpenZeppelin, and Chainlink VRF for randomness.
            </p>

            <p className="mb-8 text-xl text-white">
              The contract allows players to participate in a lottery.
              Winning numbers are drawn daily using a secure random number generator provided by
              Chainlink VRF. The prizes are distributed among the winners based on
              the number of correct guesses.
            </p>
            <h2 className="text-2xl font-bold text-yellow-500">Time until next draw</h2>
            <div>
              <CountdownToMidnight />
            </div>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={1.5}
          speed={0.2}
          style={{ width: '25%', marginLeft: '65%' }}
        >
          <img
            src={shiba2}
            alt="Lotto Shiba"
            className="rounded-full object-cover"
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={1.4}
          speed={0.1}
          style={{ width: '35%', marginLeft: '15%' }}
        >
          <div className='p-4 bg-gray-600 rounded-xl'>
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">Lucky Shiba Token</h1>
            <h2 className="mb-8 text-2xl font-bold text-yellow-500">
              {ContractAddresses.LuckyShibaToken}
            </h2>
            <p className="mb-8 text-xl text-white">
              Offers a unique ERC-20 utility token designed to reward and empower its holders in the world of decentralized lottery. LST is the heart of the Lucky Shiba lottery game, offering an interactive and rewarding experience for its users.
            </p>

            <h2 className="mb-8 text-2xl font-bold text-yellow-500">
              Tokenomics:
            </h2>

            <ul className='list-disc text-xl ml-8 mb-8 text-white'>
              <li>Total Supply: <strong>1,000,000 LST</strong></li>
              <li>Reserve Holdings: <strong>700,000 LST</strong></li>
              <li>Lottery Distribution: <strong>300,000 LST</strong></li>
            </ul>

            <p className="mb-8 text-xl text-white">
              Lucky Shiba Token is strategically structured with a limited supply to maintain value and exclusivity. Out of the 1,000,000 total LST supply, 700,000 tokens are locked down in a secure reserve smart contract for future distribution.
            </p>
            <p className="mb-8 text-xl text-white">
              The remaining 300,000 LST tokens are distributed to players of the Lucky Shiba lottery game. Every time a user participates in the lottery and purchases a ticket, the Lucky Shiba lottery smart contract mints 1 LST token and sends it to the player, creating an engaging and rewarding gaming experience.
            </p>
            <p className="mb-4 text-xl text-white">
              In each lottery game round, 5% of the prize pool is distributed to LST holders who participate in the given round. The token holder distribution is calculated based on the proportion of tokens held by each participating player relative to the total tokens held by all players who participated in the game. This ensures a fair distribution of rewards and encourages players to actively participate in the lottery game.
            </p>
          </div>
        </ParallaxLayer>

        <ParallaxLayer
          offset={2.4}
          speed={0.15}
          style={{ width: '25%', marginLeft: '15%' }}
        >
          <img
            src={shiba3}
            alt="Lotto Shiba"
            className="rounded-full object-cover"
          />
        </ParallaxLayer>

        <ParallaxLayer
          offset={2.3}
          speed={0.25}
          style={{ width: '35%', marginLeft: '50%' }}
        >

          <div className='p-4 bg-gray-600 rounded-xl'>
            <h1 className="text-4xl font-bold mb-8 text-yellow-600">Prize Distribution</h1>
            <p className="mb-8 text-xl text-white">
              The prize distribution in the game allocates different portions of the total prize pool to winners based on their number of correct guesses. The breakdown is as follows:
            </p>
            <div class="mx-auto mb-8 mx-8 bg-white rounded">
              <PrizeDistribution />
            </div>
            <h2 className="text-2xl mb-4 font-bold text-yellow-500">Token holder rewards</h2>
            <p className="mb-4 text-xl text-white">The token holder distribution is calculated based on the proportion of tokens held by each participating player relative to the total tokens held by all players who participated in the game.</p>
          </div>

        </ParallaxLayer>


        <ParallaxLayer
          offset={3.4}
          speed={-0.15}
        >
          <div className='w-full text-center'>
            <h1 className="text-4xl font-extrabold text-yellow-600">Let's play the game</h1>
            {account ? (
              <div className='mt-16'>
                <NavLink
                  to="/game"
                >
                  <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-6 rounded-xl animate__animated animate__infinite animate__headShake"
                  >
                    <FontAwesomeIcon icon={faTicket}></FontAwesomeIcon>
                    <span className='text-xl ml-3'>Buy a Ticket</span>
                  </button>
                </NavLink>
              </div>
            ) : (
              <div className='mt-16'>
                <WalletConnector isBig={true}></WalletConnector>
              </div>
            )}

          </div>
        </ParallaxLayer>

      </Parallax>
    </div >
  );
};

export default Main;
