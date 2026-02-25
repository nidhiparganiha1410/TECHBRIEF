
import React from 'react';
import { MOCK_STOCKS } from '../services/mockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StockTicker: React.FC = () => {
  const stocks = [...MOCK_STOCKS, ...MOCK_STOCKS]; // Duplicate for seamless scroll

  return (
    <div className="bg-slate-900 text-white py-2 overflow-hidden whitespace-nowrap border-b border-slate-800">
      <div className="inline-flex animate-scroll">
        {stocks.map((stock, idx) => (
          <div key={idx} className="flex items-center px-8 border-r border-slate-700">
            <span className="font-bold mr-2">{stock.symbol}</span>
            <span className="mr-2 font-mono">${stock.price.toFixed(2)}</span>
            <span className={`flex items-center text-sm ${stock.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {stock.change >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
              {Math.abs(stock.change).toFixed(2)} ({stock.changePercent.toFixed(2)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTicker;
