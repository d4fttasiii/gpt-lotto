import React from 'react';
import logo from '../assets/images/logo_2.png';

const Token = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex">
        <div className="w-1/2 pr-8">
          <img src={logo} alt="Image" className="w-full h-full object-cover rounded-full" />
        </div>
        <div className="w-1/2">
          <h1 className="text-4xl font-bold mb-8 text-yellow-600">Lucky Shiba Token</h1>
          <div className="w-full mb-6">
            <p className="mb-8 text-xl text-green-400">
              Contract address: <strong>0x51492C4AdFa1236B261E4b1564EE596C2A3F3e4d</strong>
            </p>
          </div>
          <p>The Lucky Shiba Token (LST) has no association with any existing brands or products. This cryptocurrency is simply paying homage to the Shiba meme that many of us know and love.</p>
          <br />
          <p>The LST is not intended to have any intrinsic value or expectation of financial return. There is no formal team or roadmap for the token. The coin is purely for entertainment purposes and has no practical use. As a meme coin, the Lucky Shiba Token is designed to offer a fun and exciting way to engage with the Lucky Shiba meme and participate in lotteries using cryptocurrency.</p>
        </div>
      </div>
    </div>
  );
};

export default Token;
