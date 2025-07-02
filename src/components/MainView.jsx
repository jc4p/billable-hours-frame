
'use client';

import { useEffect, useState } from 'react';
import * as frame from '@farcaster/frame-sdk';
import themes from '@/config/themes';

export default function MainView({
  billableOptions,
  frameName,
  appUrl,
  recipientAddress,
  usdcContractAddress,
}) {
  const [userFid, setUserFid] = useState(null);
  const [status, setStatus] = useState('');
  const [currentTheme, setCurrentTheme] = useState('simple'); // Default theme

  useEffect(() => {
    const checkUserFid = () => {
      if (window.userFid) {
        setUserFid(window.userFid);
      } else {
        setTimeout(checkUserFid, 100);
      }
    };
    checkUserFid();
  }, []);

  useEffect(() => {
    const theme = themes[currentTheme];
    if (theme) {
      for (const [key, value] of Object.entries(theme)) {
        document.documentElement.style.setProperty(key, value);
      }
    }
  }, [currentTheme]);

  const handlePayment = async (amount, label) => {
    setStatus(`Processing payment for ${amount}...`);
    try {
      const accounts = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts || !accounts[0]) {
        throw new Error('No wallet connected');
      }

      const transferFunctionSignature = '0xa9059cbb';
      const recipientPadded = recipientAddress.slice(2).padStart(64, '0');
      const amountHex = (BigInt(amount) * BigInt(10 ** 6)).toString(16);
      const paddedAmount = amountHex.padStart(64, '0');
      const data = `${transferFunctionSignature}${recipientPadded}${paddedAmount}`;

      const txHash = await frame.sdk.wallet.ethProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: usdcContractAddress,
          data: data,
          value: '0x0'
        }]
      });

      setStatus('Verifying transaction...');

      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId: txHash, fid: userFid, amount, label })
      });

      const result = await response.json();

      if (result.success) {
        setStatus(`Payment successful! Transaction ID: ${result.transaction.transaction_hash}`);
      } else {
        setStatus(`Payment failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      setStatus(`Payment failed: ${error.message}`);
    }
  };

  return (
    <main className="container">
      <div className="theme-switcher top-left">
        <label htmlFor="theme-select">Theme: </label>
        <select id="theme-select" value={currentTheme} onChange={(e) => setCurrentTheme(e.target.value)}>
          {Object.keys(themes).map((themeName) => (
            <option key={themeName} value={themeName}>
              {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
            </option>
          ))}
        </select>
      </div>
      <h1>{frameName}</h1>
      <div className="options">
        {billableOptions.map((option, index) => (
          <button key={index} onClick={() => handlePayment(option.amount, option.title)} className="option-button">
            {option.title} - ${option.amount}
          </button>
        ))}
      </div>
      {status && <p className="status">{status}</p>}
      <div className="template-info">
        <h2>Update this template to make it your own!</h2>
        <p>Here's how to get started:</p>
        <ul>
          <li>Edit your environment variables in <code className="code-highlight">.env</code></li>
          <li>Configure your billable options in <code className="code-highlight">src/config/billableOptions.js</code></li>
          <li>Customize themes in <code className="code-highlight">src/config/themes.js</code></li>
          <li>Adjust global styles in <code className="code-highlight">src/app/globals.css</code></li>
        </ul>
      </div>
    </main>
  );
}
