  import React, { useState, useEffect } from 'react';
  import axios from 'axios';

  const CryptoSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [allCoins, setAllCoins] = useState([]);
    const [filteredCoins, setFilteredCoins] = useState([]);
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [coinData, setCoinData] = useState(null);
    const [priceConvert, setPriceConvert] = useState('');
    const [calculatedMarketCap, setCalculatedMarketCap] = useState(null);
    const [multiplier, setMultiplier] = useState('');
    const [calculatedPrice, setCalculatedPrice] = useState(null); 
    const [error, setError] = useState(null);

    useEffect(() => {
      const fetchAllCoins = async () => {
        try {
          const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
          setAllCoins(response.data);
        } catch (err) {
          setError('Error fetching full coin list');
          console.error(err);
        }
      };
      fetchAllCoins();
    }, []);

    useEffect(() => {
      if (searchTerm) {
        const filtered = allCoins.filter(coin =>
          coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCoins(filtered);
      } else {
        setFilteredCoins([]);
      }
    }, [searchTerm, allCoins]);

    useEffect(() => {
      const fetchCoinData = async () => {
        if (selectedCoin) {
          try {
            const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${selectedCoin.id}`);
            setCoinData(response.data);
          } catch (err) {
            setError('Error fetching coin data');
            console.error(err);
          }
        }
      };
      fetchCoinData();
    }, [selectedCoin]);

    const handleMultiplierChange = (e) => {
      const multiplierValue = e.target.value;
      setMultiplier(multiplierValue);
    
      if (coinData && multiplierValue) {
        const currentPrice = coinData.market_data.current_price.usd;
        const circulatingSupply = coinData.market_data.circulating_supply;
        const maxSupply = coinData.market_data.max_supply;
    
        const newPrice = currentPrice * multiplierValue;
    
        const supplyToUse = circulatingSupply || maxSupply;
    
        const newMarketCap = supplyToUse ? newPrice * supplyToUse : null;
    
        setCalculatedPrice(newPrice);
        setCalculatedMarketCap(newMarketCap);
      }
    };

    const handlePriceConvert = (e) => {
      const newPrice = e.target.value;
      setPriceConvert(newPrice);

      if (coinData) {
        const circulatingSupply = coinData.market_data.circulating_supply;
        const maxSupply = coinData.market_data.max_supply;
        const marketCap = coinData.market_data.market_cap.usd;
        const fullyDilutedMarketCap = coinData.market_data.fully_diluted_valuation?.usd;

        if (circulatingSupply && newPrice) {
          setCalculatedMarketCap(newPrice * circulatingSupply);
        } else if (fullyDilutedMarketCap && maxSupply) {
          setCalculatedMarketCap(newPrice * maxSupply);
        } else {
          setCalculatedMarketCap(null); 
        }
      }
    };

    const handleSearchChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const handleCoinSelect = (coin) => {
      setSelectedCoin(coin);
      setSearchTerm('');
      setFilteredCoins([]);
    };

    return (
      <div className="p-4">
        <h1 className="text-7xl text-center font-bold font-handjet">
          TOKO<span className="text-red-500">NOCAP</span>
        </h1>

        <div className="p-4 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for a cryptocurrency..."
            className="p-4 border border-gray-300 rounded-full w-1/3 font-handjet text-2xl"
          />
        </div>

        {filteredCoins.length > 0 && (
          <div className='flex justify-center'>
            <ul className="border border-gray-300 max-h-48 overflow-y-auto rounded-md mb-4 bg-white w-1/3 font-handjet text-xl">
              {filteredCoins.slice(0, 50).map(coin => (
                <li
                  key={coin.id}
                  onClick={() => handleCoinSelect(coin)}
                  className="cursor-pointer p-2 border-b border-gray-200 hover:bg-gray-100"
                >
                  {coin.name} ({coin.symbol.toUpperCase()})
                </li>
              ))}
            </ul>
          </div>
        )}

        {coinData && selectedCoin && (
          <div className='flex justify-center'>
            <div className='rounded-lg w-1/3 bg-gradient-to-r from-red-500 to-pink-500'>
              <div className='rounded-lg bg-white m-4 p-4'>
                <h2 className="text-xl font-bold flex items-center">
                  <img
                    src={coinData.image.large}
                    alt={`${selectedCoin.name} logo`}
                    className="w-10 h-10 rounded-full mr-4"
                  />
                  {selectedCoin.name} ({selectedCoin.symbol.toUpperCase()})
                </h2>
                <p className="text-lg">Price: ${coinData.market_data.current_price.usd.toLocaleString()}</p>
                <p className="text-lg">Market Cap: {coinData.market_data.market_cap.usd ? `$${coinData.market_data.market_cap.usd.toLocaleString()}` : 'N/A'}</p>
                <p className="text-lg">Fully Diluted Market Cap: {coinData.market_data.fully_diluted_valuation?.usd ? `$${coinData.market_data.fully_diluted_valuation.usd.toLocaleString()}` : 'N/A'}</p>
              </div>

              <div className='rounded-lg bg-white m-4 p-3'>
                <div className="p-2">
                  <h1 className="font-handjet text-2xl pl-4">Price:</h1>
                  <input
                    type="text"
                    value={priceConvert}
                    onChange={handlePriceConvert}
                    placeholder="Input New Price"
                    className="px-4 py-3 border border-gray-300 rounded-full w-full font-handjet text-2xl"
                  />
                </div>
                {calculatedMarketCap ? (
                  <div className="text-lg mt-1">
                    <p>New Market Cap: ${calculatedMarketCap.toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="text-lg mt-1">
                    <p></p>
                  </div>
                )}
              </div>

              <div className='rounded-lg bg-white m-4 p-3'>
                <div className="p-2">
                  <h1 className="font-handjet text-2xl pl-4">Multiplier:</h1>
                  <input
                    type="text"
                    value={multiplier}
                    onChange={handleMultiplierChange}
                    placeholder="Input Multiplier"
                    className="px-4 py-3 border border-gray-300 rounded-full w-full font-handjet text-2xl"
                  />
                </div>

                {calculatedPrice ? (
                  <div className="text-lg mt-1">
                    <p>New Price: ${calculatedPrice.toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="text-lg mt-1">
                    <p></p>
                  </div>
                )}

                {calculatedMarketCap ? (
                  <div className="text-lg mt-1">
                    <p>New Market Cap: ${calculatedMarketCap.toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="text-lg mt-1">
                    <p></p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* {error && <p className="text-red-500">{error}</p>} */}
      </div>
    );
  };

  export default CryptoSearch;
