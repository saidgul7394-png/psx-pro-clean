import React, { useState, useEffect, useMemo } from "react";
import { 
  TrendingUp, TrendingDown, RefreshCw, Search, Heart, 
  User, Settings as SettingsIcon, Newspaper, Sliders, 
  Scale, Brain, BarChart2, Briefcase, Bell, LayoutGrid, 
  DollarSign, Check, ChevronRight, Sparkles, Play, LogIn, 
  LogOut, PhoneCall, Key, Lock, Fingerprint, ShieldAlert, 
  Download, Plus, Trash2, Calendar, Eye, Compass, Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

import { 
  Stock, Transaction, Holding, PriceAlert, AppSettings, StockHistoryItem 
} from "./types";
import { MOCK_NEWS, ECONOMIC_EVENTS, TRANSLATIONS } from "./data";

// Subcomponents
import Screener from "./components/Screener";
import CompareStocks from "./components/CompareStocks";
import AIAnalysis from "./components/AIAnalysis";
import AIPrediction from "./components/AIPrediction";
import FlutterSDK from "./components/FlutterSDK";
import { Layers } from "lucide-react";

const INITIAL_MARKET_DATA = {
  indices: {
    kse100: 78450.50,
    kse100Change: 350.50,
    kse100ChangePercent: 0.45,
    kse30: 24820.10,
    kse30Change: 120.10,
    kse30ChangePercent: 0.49
  },
  stocks: [
    {
      symbol: "SYS",
      name: "Systems Limited",
      sector: "Technology",
      price: 385.50,
      change: 2.10,
      changePercent: 0.55,
      volume: 1245000,
      open: 383.40,
      high: 391.00,
      low: 381.20,
      marketCap: 111.8,
      pe: 14.2,
      divYield: 2.5,
      eps: 27.15,
      growth: 18.5,
      rsi: 58.4,
      macd: 1.25,
      sma20: 381.10,
      ema50: 375.40,
      upperBB: 395.20,
      lowerBB: 367.00,
      announcements: [
        { date: "2026-07-01", title: "Board of Directors meeting to consider Q2 financials", sentiment: "neutral" },
        { date: "2026-06-15", title: "SYS expands Cloud operations into GCC region", sentiment: "positive" }
      ],
      dividends: [
        { date: "2026-05-10", amount: 6.00, type: "Final" },
        { date: "2025-10-12", amount: 4.00, type: "Interim" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [10.5, 12.1, 13.4, 14.8],
        profit: [2.1, 2.4, 2.7, 3.1]
      },
      shareholding: { directors: 32.5, institutions: 41.2, public: 18.3, foreign: 8.0 }
    },
    {
      symbol: "HUBC",
      name: "The Hub Power Company Limited",
      sector: "Power Generation & Distribution",
      price: 112.20,
      change: -1.80,
      changePercent: -1.58,
      volume: 3850000,
      open: 114.00,
      high: 114.50,
      low: 111.80,
      marketCap: 145.5,
      pe: 4.8,
      divYield: 14.5,
      eps: 23.38,
      growth: 5.2,
      rsi: 42.1,
      macd: -0.85,
      sma20: 115.40,
      ema50: 118.20,
      upperBB: 122.50,
      lowerBB: 108.30,
      announcements: [
        { date: "2026-06-20", title: "Hubco acquires 25% stake in solar developer", sentiment: "positive" },
        { date: "2026-05-18", title: "Shutdown of Boiler-3 for planned maintenance", sentiment: "negative" }
      ],
      dividends: [
        { date: "2026-04-05", amount: 4.50, type: "Interim" },
        { date: "2025-11-20", amount: 5.00, type: "Interim" },
        { date: "2025-08-15", amount: 6.00, type: "Final" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [28.4, 30.1, 29.5, 31.2],
        profit: [5.8, 6.1, 5.9, 6.4]
      },
      shareholding: { directors: 15.2, institutions: 54.8, public: 22.1, foreign: 7.9 }
    },
    {
      symbol: "LUCK",
      name: "Lucky Cement Limited",
      sector: "Cement",
      price: 684.00,
      change: 8.50,
      changePercent: 1.26,
      volume: 640000,
      open: 675.50,
      high: 689.00,
      low: 672.00,
      marketCap: 214.3,
      pe: 7.1,
      divYield: 4.1,
      eps: 96.34,
      growth: 12.0,
      rsi: 61.2,
      macd: 3.40,
      sma20: 672.00,
      ema50: 658.00,
      upperBB: 692.00,
      lowerBB: 652.00,
      announcements: [
        { date: "2026-07-05", title: "Lucky Cement commissions line-4 with waste-heat recovery", sentiment: "positive" }
      ],
      dividends: [
        { date: "2026-02-18", amount: 18.00, type: "Interim" },
        { date: "2025-09-10", amount: 15.00, type: "Final" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [38.5, 41.2, 42.8, 44.1],
        profit: [7.2, 8.5, 8.9, 9.4]
      },
      shareholding: { directors: 45.1, institutions: 33.4, public: 11.5, foreign: 10.0 }
    },
    {
      symbol: "ENGRO",
      name: "Engro Corporation Limited",
      sector: "Fertilizer & Chemicals",
      price: 318.40,
      change: -0.50,
      changePercent: -0.16,
      volume: 1150000,
      open: 318.90,
      high: 322.00,
      low: 316.50,
      marketCap: 183.3,
      pe: 6.8,
      divYield: 11.8,
      eps: 46.82,
      growth: 9.4,
      rsi: 52.2,
      macd: -0.23,
      sma20: 319.20,
      ema50: 321.40,
      upperBB: 328.00,
      lowerBB: 310.40,
      announcements: [
        { date: "2026-06-12", title: "Engro Energy signs memorandum on green energy grids", sentiment: "positive" }
      ],
      dividends: [
        { date: "2026-05-15", amount: 10.00, type: "Final" },
        { date: "2025-11-12", amount: 8.00, type: "Interim" },
        { date: "2025-08-20", amount: 12.00, type: "Interim" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [85.4, 91.2, 88.6, 92.4],
        profit: [9.1, 11.4, 10.2, 11.8]
      },
      shareholding: { directors: 44.3, institutions: 35.8, public: 14.9, foreign: 5.0 }
    },
    {
      symbol: "OGDC",
      name: "Oil & Gas Development Company Limited",
      sector: "Oil & Gas Exploration",
      price: 132.50,
      change: 2.65,
      changePercent: 2.04,
      volume: 4850000,
      open: 129.85,
      high: 134.50,
      low: 129.50,
      marketCap: 576.7,
      pe: 3.5,
      divYield: 12.2,
      eps: 38.31,
      growth: 6.8,
      rsi: 62.4,
      macd: 1.85,
      sma20: 129.80,
      ema50: 126.50,
      upperBB: 136.20,
      lowerBB: 123.40,
      announcements: [
        { date: "2026-07-10", title: "New high-yield gas discoveries at Lockhart well", sentiment: "positive" },
        { date: "2026-06-25", title: "Interim production boost of 1,200 barrels/day", sentiment: "positive" }
      ],
      dividends: [
        { date: "2026-05-25", amount: 2.50, type: "Interim" },
        { date: "2026-02-10", amount: 2.00, type: "Interim" },
        { date: "2025-11-18", amount: 3.00, type: "Final" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [92.1, 98.4, 95.2, 101.4],
        profit: [38.2, 42.1, 40.5, 43.8]
      },
      shareholding: { directors: 74.0, institutions: 14.5, public: 6.5, foreign: 5.0 }
    },
    {
      symbol: "PPL",
      name: "Pakistan Petroleum Limited",
      sector: "Oil & Gas Exploration",
      price: 112.00,
      change: 0.00,
      changePercent: 0.00,
      volume: 3450000,
      open: 112.00,
      high: 115.40,
      low: 111.50,
      marketCap: 312.4,
      pe: 3.2,
      divYield: 11.5,
      eps: 35.88,
      growth: 4.5,
      rsi: 54.2,
      macd: 1.12,
      sma20: 111.20,
      ema50: 108.90,
      upperBB: 116.80,
      lowerBB: 105.60,
      announcements: [
        { date: "2026-07-08", title: "Drilling operations commence at Margand block", sentiment: "positive" }
      ],
      dividends: [
        { date: "2026-04-12", amount: 2.00, type: "Interim" },
        { date: "2025-10-15", amount: 2.50, type: "Final" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [62.4, 65.8, 64.1, 67.2],
        profit: [21.5, 23.4, 22.1, 24.5]
      },
      shareholding: { directors: 67.5, institutions: 18.2, public: 9.3, foreign: 5.0 }
    },
    {
      symbol: "MEBL",
      name: "Meezan Bank Limited",
      sector: "Commercial Banks",
      price: 199.70,
      change: 0.00,
      changePercent: 0.00,
      volume: 1850000,
      open: 199.70,
      high: 201.50,
      low: 197.80,
      marketCap: 355.2,
      pe: 5.1,
      divYield: 10.1,
      eps: 38.92,
      growth: 21.0,
      rsi: 56.4,
      macd: 0.85,
      sma20: 199.40,
      ema50: 194.20,
      upperBB: 208.50,
      lowerBB: 190.30,
      announcements: [
        { date: "2026-07-02", title: "Opening of 15 new digital Islamic banking branches", sentiment: "positive" }
      ],
      dividends: [
        { date: "2026-05-18", amount: 4.00, type: "Interim" },
        { date: "2026-02-12", amount: 5.00, type: "Final" },
        { date: "2025-11-15", amount: 3.50, type: "Interim" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [45.2, 48.9, 52.4, 56.1],
        profit: [18.2, 20.1, 22.4, 24.8]
      },
      shareholding: { directors: 38.2, institutions: 42.5, public: 12.3, foreign: 7.0 }
    },
    {
      symbol: "FFC",
      name: "Fauji Fertilizer Company Limited",
      sector: "Fertilizer & Chemicals",
      price: 153.40,
      change: 0.00,
      changePercent: 0.00,
      volume: 1450000,
      open: 153.40,
      high: 156.00,
      low: 151.88,
      marketCap: 196.6,
      pe: 6.2,
      divYield: 13.6,
      eps: 24.92,
      growth: 7.5,
      rsi: 52.1,
      macd: 0.35,
      sma20: 153.20,
      ema50: 151.10,
      upperBB: 158.40,
      lowerBB: 148.00,
      announcements: [
        { date: "2026-06-30", title: "Gas price tariff adjustment approval", sentiment: "neutral" }
      ],
      dividends: [
        { date: "2026-04-20", amount: 4.25, type: "Interim" },
        { date: "2025-12-15", amount: 3.75, type: "Interim" },
        { date: "2025-09-18", amount: 5.00, type: "Final" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [42.1, 46.5, 44.8, 48.2],
        profit: [7.8, 8.9, 8.2, 9.1]
      },
      shareholding: { directors: 43.1, institutions: 38.9, public: 13.0, foreign: 5.0 }
    },
    {
      symbol: "PSO",
      name: "Pakistan State Oil Company Limited",
      sector: "Oil & Gas Marketing",
      price: 175.70,
      change: 0.00,
      changePercent: 0.00,
      volume: 1950000,
      open: 175.70,
      high: 176.50,
      low: 171.80,
      marketCap: 80.9,
      pe: 4.1,
      divYield: 5.8,
      eps: 42.02,
      growth: 3.8,
      rsi: 42.5,
      macd: -1.25,
      sma20: 177.80,
      ema50: 181.20,
      upperBB: 189.50,
      lowerBB: 169.10,
      announcements: [
        { date: "2026-07-04", title: "Circular debt accumulation poses cash flow challenge", sentiment: "negative" }
      ],
      dividends: [
        { date: "2026-03-10", amount: 4.00, type: "Interim" },
        { date: "2025-09-15", amount: 6.00, type: "Final" }
      ],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [185.2, 195.4, 189.8, 198.5],
        profit: [4.2, 5.1, 4.5, 5.2]
      },
      shareholding: { directors: 22.4, institutions: 52.1, public: 20.5, foreign: 5.0 }
    },
    {
      symbol: "TRG",
      name: "TRG Pakistan Limited",
      sector: "Technology",
      price: 70.75,
      change: 0.00,
      changePercent: 0.00,
      volume: 4850000,
      open: 70.75,
      high: 71.50,
      low: 67.43,
      marketCap: 37.2,
      pe: 22.4,
      divYield: 0.0,
      eps: 3.04,
      growth: -12.4,
      rsi: 41.2,
      macd: -1.85,
      sma20: 72.80,
      ema50: 76.50,
      upperBB: 82.40,
      lowerBB: 66.20,
      announcements: [
        { date: "2026-06-28", title: "TRGP clarifies status on international arbitration claims", sentiment: "neutral" }
      ],
      dividends: [],
      financials: {
        quarters: ["Q3-25", "Q4-25", "Q1-26", "Q2-26"],
        revenue: [4.2, 4.8, 3.9, 4.1],
        profit: [0.8, 0.9, 0.4, 0.5]
      },
      shareholding: { directors: 18.2, institutions: 48.5, public: 28.3, foreign: 5.0 }
    }
  ]
};

export default function App() {
  // Application State
  const [splashActive, setSplashActive] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginMode, setLoginMode] = useState<"SELECT" | "EMAIL" | "OTP">("SELECT");
  const [username, setUsername] = useState<string>("");
  const [emailInput, setEmailInput] = useState<string>("");
  const [otpInput, setOtpInput] = useState<string>("");
  const [biometricEnabled, setBiometricEnabled] = useState<boolean>(false);

  // Layout View Switchers
  const [workspaceMode, setWorkspaceMode] = useState<"DUAL" | "PHONE_ONLY" | "DESKTOP_ONLY">("DUAL");
  const [activeScreen, setActiveScreen] = useState<
    "HOME" | "MARKET" | "DETAIL" | "PORTFOLIO" | "WATCHLIST" | "AI_ANALYSIS" | "AI_PREDICT" | "NEWS" | "SCREENER" | "COMPARE" | "SETTINGS" | "FLUTTER_SDK"
  >("HOME");

  // Market & Simulation Data State
  const [marketData, setMarketData] = useState<{
    indices: {
      kse100: number;
      kse100Change: number;
      kse100ChangePercent: number;
      kse30: number;
      kse30Change: number;
      kse30ChangePercent: number;
    };
    stocks: Stock[];
  }>(INITIAL_MARKET_DATA);

  const [selectedSymbol, setSelectedSymbol] = useState<string>("SYS");
  const [stockHistory, setStockHistory] = useState<StockHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
  const [chartType, setChartType] = useState<"CANDLE" | "LINE" | "AREA">("LINE");
  const [overlayIndicator, setOverlayIndicator] = useState<"NONE" | "SMA" | "EMA" | "BB">("NONE");

  // User Database State
  const [portfolio, setPortfolio] = useState<{ cash: number; transactions: Transaction[] }>({
    cash: 1000000, // 10 Lakh PKR default
    transactions: [
      { id: "t1", symbol: "SYS", type: "BUY", qty: 200, price: 380.00, date: "2026-07-01" },
      { id: "t2", symbol: "HUBC", type: "BUY", qty: 500, price: 115.00, date: "2026-07-05" }
    ]
  });

  const [watchlist, setWatchlist] = useState<string[]>(["SYS", "HUBC", "OGDC", "MEBL"]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([
    { id: "a1", symbol: "SYS", targetPrice: 390.00, type: "ABOVE", active: true, createdAt: "2026-07-10" }
  ]);
  const [bookmarkedNews, setBookmarkedNews] = useState<string[]>(["n1", "n2"]);
  const [newsCategory, setNewsCategory] = useState<"ALL" | "PSX" | "Business" | "Economy" | "Company">("ALL");

  // Global Configuration
  const [settings, setSettings] = useState<AppSettings>({
    theme: "dark",
    language: "en",
    currency: "PKR",
    notifications: true,
    biometrics: false
  });

  // Transaction Input Forms
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [tradeQty, setTradeQty] = useState<number>(100);
  const [tradePrice, setTradePrice] = useState<number>(0);

  // Custom Alert state for push banner
  const [activeNotification, setActiveNotification] = useState<{ title: string; message: string } | null>(null);

  // Dynamic simulation flash states (storing ticker to highlight changes)
  const [prevPrices, setPrevPrices] = useState<Record<string, number>>({});

  // Translation helpers
  const lang = settings.language;
  const t = (key: keyof typeof TRANSLATIONS["en"]) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS["en"][key] || key;
  };

  // Clock state for simulated phone status bar
  const [systemTime, setSystemTime] = useState<string>("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // ----------------------------------------------------
  // Polling Market Data
  // ----------------------------------------------------
  useEffect(() => {
    const fetchMarket = async () => {
      let fetchSuccess = false;
      try {
        const res = await fetch("/api/market-data");
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            // Track prices for flashing
            if (marketData) {
              const prices: Record<string, number> = {};
              marketData.stocks.forEach((s) => {
                prices[s.symbol] = s.price;
              });
              setPrevPrices(prices);
            }
            setMarketData(data);

            // Evaluate alerts
            data.stocks.forEach((stock: Stock) => {
              priceAlerts.forEach((alert) => {
                if (alert.active && alert.symbol === stock.symbol) {
                  const crossedAbove = alert.type === "ABOVE" && stock.price >= alert.targetPrice;
                  const crossedBelow = alert.type === "BELOW" && stock.price <= alert.targetPrice;
                  
                  if (crossedAbove || crossedBelow) {
                    // Trigger Notification Alert
                    setActiveNotification({
                      title: `🚨 PSX Price Alert: ${stock.symbol}`,
                      message: `${stock.name} has crossed your alert target of PKR ${alert.targetPrice}! Current Price is PKR ${stock.price.toFixed(2)}.`
                    });
                    // Deactivate alert
                    setPriceAlerts((prev) =>
                      prev.map((a) => (a.id === alert.id ? { ...a, active: false } : a))
                    );
                  }
                }
              });
            });
            fetchSuccess = true;
          }
        }
      } catch (e) {
        // Silent recovery
      }

      // FALLBACK: Simulate client-side live market ticks if fetch fails (e.g., inside iframe)
      if (!fetchSuccess) {
        setMarketData((currentData) => {
          const activeData = currentData || INITIAL_MARKET_DATA;
          
          // Track prices for flashing
          const prices: Record<string, number> = {};
          activeData.stocks.forEach((s) => {
            prices[s.symbol] = s.price;
          });
          setPrevPrices(prices);

          const drift = (Math.random() - 0.48) * 12;
          const newKse100 = activeData.indices.kse100 + drift;
          const newKse30 = activeData.indices.kse30 + drift * 0.31;

          const updatedStocks = activeData.stocks.map((stock) => {
            const volatility = stock.sector === "Technology" ? 0.003 : stock.sector === "Oil & Gas Exploration" ? 0.002 : 0.001;
            const changePct = (Math.random() - 0.49) * 2 * volatility;
            const priceChange = stock.price * changePct;
            const newPrice = parseFloat((stock.price + priceChange).toFixed(2));
            const newChange = parseFloat((newPrice - stock.open).toFixed(2));
            const newChangePercent = parseFloat(((newChange / stock.open) * 100).toFixed(2));
            const newHigh = newPrice > stock.high ? newPrice : stock.high;
            const newLow = newPrice < stock.low ? newPrice : stock.low;
            const newVolume = stock.volume + Math.floor(Math.random() * 450);

            return {
              ...stock,
              price: newPrice,
              change: newChange,
              changePercent: newChangePercent,
              high: newHigh,
              low: newLow,
              volume: newVolume,
              rsi: Math.max(15, Math.min(85, parseFloat((stock.rsi + (Math.random() - 0.5) * 1).toFixed(1)))),
              macd: parseFloat((stock.macd + (Math.random() - 0.5) * 0.05).toFixed(2))
            };
          });

          // Evaluate alerts
          updatedStocks.forEach((stock: Stock) => {
            priceAlerts.forEach((alert) => {
              if (alert.active && alert.symbol === stock.symbol) {
                const crossedAbove = alert.type === "ABOVE" && stock.price >= alert.targetPrice;
                const crossedBelow = alert.type === "BELOW" && stock.price <= alert.targetPrice;
                
                if (crossedAbove || crossedBelow) {
                  setActiveNotification({
                    title: `🚨 PSX Price Alert: ${stock.symbol}`,
                    message: `${stock.name} has crossed your alert target of PKR ${alert.targetPrice}! Current Price is PKR ${stock.price.toFixed(2)}.`
                  });
                  setPriceAlerts((prev) =>
                    prev.map((a) => (a.id === alert.id ? { ...a, active: false } : a))
                  );
                }
              }
            });
          });

          return {
            indices: {
              kse100: parseFloat(newKse100.toFixed(2)),
              kse100Change: parseFloat((newKse100 - 78100.00).toFixed(2)),
              kse100ChangePercent: parseFloat((((newKse100 - 78100.00) / 78100.00) * 100).toFixed(2)),
              kse30: parseFloat(newKse30.toFixed(2)),
              kse30Change: parseFloat((newKse30 - 24700.00).toFixed(2)),
              kse30ChangePercent: parseFloat((((newKse30 - 24700.00) / 24700.00) * 100).toFixed(2)),
            },
            stocks: updatedStocks,
            timestamp: new Date()
          };
        });
      }
    };

    fetchMarket();
    const interval = setInterval(fetchMarket, 1500);
    return () => clearInterval(interval);
  }, [priceAlerts, marketData]);

  // Fetch History for details
  useEffect(() => {
    const fetchHistory = async () => {
      setLoadingHistory(true);
      let fetchSuccess = false;
      try {
        const res = await fetch(`/api/market-history/${selectedSymbol}`);
        if (res.ok) {
          const contentType = res.headers.get("content-type");
          if (contentType && contentType.includes("application/json")) {
            const data = await res.json();
            setStockHistory(data.history);
            const currentStock = marketData?.stocks.find((s) => s.symbol === selectedSymbol);
            if (currentStock) {
              setTradePrice(currentStock.price);
            }
            fetchSuccess = true;
          }
        }
      } catch (e) {
        // Silent recovery
      }

      if (!fetchSuccess) {
        generateLocalFallbackHistory();
      }
      setLoadingHistory(false);
    };

    const generateLocalFallbackHistory = () => {
      const currentStock = marketData?.stocks.find((s) => s.symbol === selectedSymbol);
      const basePrice = currentStock ? currentStock.price : 100;
      const history = [];
      const now = new Date();
      let lastClose = basePrice;
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split("T")[0];
        const variance = (Math.random() - 0.49) * 0.04 * lastClose;
        const close = lastClose + variance;
        const open = lastClose;
        history.push({
          date: dateStr,
          open: parseFloat(open.toFixed(2)),
          high: parseFloat((Math.max(open, close) + Math.random() * 3).toFixed(2)),
          low: parseFloat((Math.min(open, close) - Math.random() * 3).toFixed(2)),
          close: parseFloat(close.toFixed(2)),
          volume: Math.floor(100000 + Math.random() * 500000),
          rsi: parseFloat((45 + Math.random() * 20).toFixed(1)),
          macd: parseFloat(((Math.random() - 0.5) * 3).toFixed(2))
        });
        lastClose = close;
      }
      setStockHistory(history);
      if (currentStock) {
        setTradePrice(currentStock.price);
      }
    };

    if (selectedSymbol) {
      fetchHistory();
    }
  }, [selectedSymbol, marketData?.stocks]);

  // Fading Splash Screen
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setSplashActive(false);
    }, 2800);
    return () => clearTimeout(splashTimer);
  }, []);

  // Dismiss alert notifications automatically after 6s
  useEffect(() => {
    if (activeNotification) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 6000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification]);

  // ----------------------------------------------------
  // Portfolio Calculations
  // ----------------------------------------------------
  const holdings: Holding[] = useMemo(() => {
    const map: Record<string, { qty: number; cost: number }> = {};
    portfolio.transactions.forEach((t) => {
      if (!map[t.symbol]) map[t.symbol] = { qty: 0, cost: 0 };
      if (t.type === "BUY") {
        map[t.symbol].qty += t.qty;
        map[t.symbol].cost += t.qty * t.price;
      } else {
        map[t.symbol].qty -= t.qty;
        map[t.symbol].cost -= t.qty * t.price; // simplified average cost
      }
    });

    return Object.entries(map)
      .map(([symbol, data]) => ({
        symbol,
        qty: data.qty,
        avgPrice: data.qty > 0 ? parseFloat((data.cost / data.qty).toFixed(2)) : 0
      }))
      .filter((h) => h.qty > 0);
  }, [portfolio.transactions]);

  const activeStocksDb = useMemo(() => {
    const map: Record<string, Stock> = {};
    if (marketData) {
      marketData.stocks.forEach((s) => {
        map[s.symbol] = s;
      });
    }
    return map;
  }, [marketData]);

  const totalPortfolioValue = useMemo(() => {
    let value = portfolio.cash;
    holdings.forEach((h) => {
      const s = activeStocksDb[h.symbol];
      if (s) {
        value += h.qty * s.price;
      } else {
        value += h.qty * h.avgPrice;
      }
    });
    return value;
  }, [holdings, portfolio.cash, activeStocksDb]);

  const portfolioGainLoss = useMemo(() => {
    let totalCost = 0;
    holdings.forEach((h) => {
      totalCost += h.qty * h.avgPrice;
    });
    const currentHoldingsValue = holdings.reduce((sum, h) => {
      const s = activeStocksDb[h.symbol];
      return sum + h.qty * (s ? s.price : h.avgPrice);
    }, 0);

    const diff = currentHoldingsValue - totalCost;
    const diffPct = totalCost > 0 ? (diff / totalCost) * 100 : 0;
    return { value: diff, percent: diffPct };
  }, [holdings, activeStocksDb]);

  // ----------------------------------------------------
  // Event Handlers & Advanced Actions
  // ----------------------------------------------------
  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStock = activeStocksDb[selectedSymbol];
    if (!currentStock) return;

    const totalCost = tradeQty * tradePrice;
    if (tradeType === "BUY" && totalCost > portfolio.cash) {
      alert("Insufficient PKR Cash reserves to complete this purchase!");
      return;
    }

    const holding = holdings.find((h) => h.symbol === selectedSymbol);
    if (tradeType === "SELL" && (!holding || holding.qty < tradeQty)) {
      alert("Insufficient stock quantity available to complete this sale!");
      return;
    }

    const newTx: Transaction = {
      id: "tx-" + Date.now(),
      symbol: selectedSymbol,
      type: tradeType,
      qty: tradeQty,
      price: tradePrice,
      date: new Date().toISOString().split("T")[0]
    };

    setPortfolio((prev) => ({
      cash: prev.cash + (tradeType === "BUY" ? -totalCost : totalCost),
      transactions: [newTx, ...prev.transactions]
    }));

    setActiveNotification({
      title: "✅ Transaction Logged Successfully",
      message: `Your trade to ${tradeType} ${tradeQty} shares of ${selectedSymbol} at PKR ${tradePrice} has been committed to secure ledger.`
    });
  };

  const exportPortfolioCSV = () => {
    const headers = "ID,Symbol,Type,Quantity,Price,Date\n";
    const rows = portfolio.transactions
      .map((t) => `${t.id},${t.symbol},${t.type},${t.qty},${t.price},${t.date}`)
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `PSX_Vision_Portfolio_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleResetData = () => {
    if (confirm("Are you sure you want to restore defaults? This resets your ledger and watchlists.")) {
      setPortfolio({
        cash: 1000000,
        transactions: [
          { id: "t1", symbol: "SYS", type: "BUY", qty: 200, price: 380.00, date: "2026-07-01" },
          { id: "t2", symbol: "HUBC", type: "BUY", qty: 500, price: 115.00, date: "2026-07-05" }
        ]
      });
      setWatchlist(["SYS", "HUBC", "OGDC", "MEBL"]);
      setPriceAlerts([
        { id: "a1", symbol: "SYS", targetPrice: 390.00, type: "ABOVE", active: true, createdAt: "2026-07-10" }
      ]);
      setActiveNotification({
        title: "🔄 System Database Rebuilt",
        message: "Your application state and transaction logs have been reset to factory defaults."
      });
    }
  };

  const handleCreateAlert = (e: React.FormEvent, sym: string, target: number, alertType: "ABOVE" | "BELOW") => {
    e.preventDefault();
    if (target <= 0) return;
    const newAlert: PriceAlert = {
      id: "alert-" + Date.now(),
      symbol: sym,
      targetPrice: target,
      type: alertType,
      active: true,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setPriceAlerts((prev) => [newAlert, ...prev]);
    setActiveNotification({
      title: "🔔 Price Alert Created",
      message: `You will be notified as soon as ${sym} crosses PKR ${target}.`
    });
  };

  const toggleWatchlist = (symbol: string) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
    } else {
      setWatchlist([...watchlist, symbol]);
    }
  };

  // ----------------------------------------------------
  // Filtered Lists
  // ----------------------------------------------------
  const gainerStocks = useMemo(() => {
    if (!marketData) return [];
    return [...marketData.stocks].sort((a, b) => b.changePercent - a.changePercent).slice(0, 5);
  }, [marketData]);

  const loserStocks = useMemo(() => {
    if (!marketData) return [];
    return [...marketData.stocks].sort((a, b) => a.changePercent - b.changePercent).slice(0, 5);
  }, [marketData]);

  const mostActiveStocks = useMemo(() => {
    if (!marketData) return [];
    return [...marketData.stocks].sort((a, b) => b.volume - a.volume).slice(0, 5);
  }, [marketData]);

  const selectedStockObj = useMemo(() => {
    return marketData?.stocks.find((s) => s.symbol === selectedSymbol) || marketData?.stocks[0] || null;
  }, [marketData, selectedSymbol]);

  const filteredNews = useMemo(() => {
    if (newsCategory === "ALL") return MOCK_NEWS;
    return MOCK_NEWS.filter((n) => n.category === newsCategory);
  }, [newsCategory]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none overflow-x-hidden selection:bg-purple-500 selection:text-white">
      
      {/* ----------------------------------------------------
          SCREEN 1: SPLASH SCREEN
          ---------------------------------------------------- */}
      <AnimatePresence>
        {splashActive && (
          <motion.div
            id="splash-screen"
            className="fixed inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center space-y-6"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Visual Stock Market Animated Vector logo */}
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 animate-pulse flex items-center justify-center p-0.5">
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                  <TrendingUp className="h-10 w-10 text-emerald-400 animate-bounce" />
                </div>
              </div>
              {/* Outer orbit rings */}
              <div className="absolute inset-0 border border-emerald-500/20 rounded-full animate-ping pointer-events-none" />
            </div>

            <div className="text-center space-y-2">
              <h1 className="text-3xl font-black text-white tracking-wider font-sans">
                PSX VISION PRO
              </h1>
              <p className="text-xs text-slate-400 font-mono tracking-widest uppercase">
                Pakistan Stock Intelligence
              </p>
            </div>

            {/* Skeleton loading animation */}
            <div className="w-40 bg-slate-900 h-1.5 rounded-full overflow-hidden border border-white/5 relative">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-indigo-500 w-2/3 animate-infinite-scroll absolute left-0 rounded-full" style={{ animation: "pulse 1.5s infinite" }} />
            </div>
            
            <button 
              onClick={() => setSplashActive(false)}
              className="px-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-full text-[10px] text-slate-400 font-mono tracking-wider transition-all border border-white/10 cursor-pointer"
            >
              Skip Intro
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          SCREEN 2: AUTHENTICATION FLOW
          ---------------------------------------------------- */}
      <AnimatePresence>
        {!isAuthenticated && !splashActive && (
          <motion.div
            id="auth-screen"
            className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-md space-y-6 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-24 -left-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-purple-500/10 rounded-2xl border border-purple-500/20 text-purple-400">
                  <Compass className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-white tracking-wide">PSX Vision Pro</h2>
                <p className="text-xs text-slate-400">
                  Secure sign-in for Pakistan Stock Exchange Intelligence
                </p>
              </div>

              {loginMode === "SELECT" && (
                <div className="space-y-3">
                  {/* Google Sign In mock */}
                  <button
                    onClick={() => {
                      setUsername("Said Gul");
                      setIsAuthenticated(true);
                      setActiveNotification({ title: "Welcome back!", message: "Signed in using Google Auth." });
                    }}
                    className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer text-white"
                  >
                    <LogIn className="h-4 w-4 text-emerald-400" />
                    Sign in with Google Account
                  </button>

                  {/* Email Login button */}
                  <button
                    onClick={() => setLoginMode("EMAIL")}
                    className="w-full py-3 px-4 bg-indigo-600 rounded-2xl text-xs font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 text-white shadow-lg shadow-indigo-600/20 cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    Continue with Email Credentials
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-white/5"></div>
                    <span className="flex-shrink mx-4 text-[10px] text-slate-500 font-mono uppercase">Or</span>
                    <div className="flex-grow border-t border-white/5"></div>
                  </div>

                  {/* Guest mode option */}
                  <button
                    onClick={() => {
                      setUsername("Guest Investor");
                      setIsAuthenticated(true);
                      setActiveNotification({ title: "Assalam-o-Alaikum!", message: "Logged in as Guest. Real-time simulation is fully active." });
                    }}
                    className="w-full py-3 px-4 bg-slate-950/80 border border-slate-800 rounded-2xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    Enter as Guest (Immediate Access)
                  </button>
                </div>
              )}

              {loginMode === "EMAIL" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (emailInput.trim()) setLoginMode("OTP");
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. investor@psxvision.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-xs font-bold transition-all text-white cursor-pointer"
                  >
                    Send One-Time OTP Verification
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("SELECT")}
                    className="w-full text-center text-xs text-slate-500 hover:text-white transition-all block mt-2"
                  >
                    Back to Selection
                  </button>
                </form>
              )}

              {loginMode === "OTP" && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (otpInput.length === 6) {
                      setUsername(emailInput.split("@")[0]);
                      setIsAuthenticated(true);
                      setActiveNotification({ title: "Success!", message: "OTP verification complete." });
                    } else {
                      alert("Please enter the 6-digit verification code.");
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400">Verification OTP (Sent to your Email)</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Enter 6-digit Code"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-center font-mono text-lg tracking-widest text-white focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500 text-center">
                      For demo testing, enter any 6 digits (e.g. 123456)
                    </p>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 rounded-2xl text-xs font-bold transition-all text-white cursor-pointer"
                  >
                    Verify Code & Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setLoginMode("EMAIL")}
                    className="w-full text-center text-xs text-slate-500 hover:text-white transition-all block mt-2"
                  >
                    Resend Code
                  </button>
                </form>
              )}

              {/* Secure footer */}
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500 border-t border-white/5 pt-4">
                <Lock className="h-3 w-3 text-emerald-500" />
                SECP Certified Secure SSL Environment
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          PUSH NOTIFICATION SYSTEM BAR
          ---------------------------------------------------- */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            id="notification-banner"
            className="fixed top-4 right-4 z-50 w-full max-w-sm p-4 bg-slate-900/90 border border-emerald-500/30 rounded-2xl backdrop-blur-md shadow-2xl flex items-start gap-3 pointer-events-auto"
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
          >
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <Bell className="h-5 w-5 animate-bounce" />
            </div>
            <div className="space-y-1 flex-1">
              <h4 className="text-xs font-bold text-white">{activeNotification.title}</h4>
              <p className="text-[11px] text-slate-300 leading-relaxed">{activeNotification.message}</p>
            </div>
            <button
              onClick={() => setActiveNotification(null)}
              className="text-slate-500 hover:text-white text-xs font-bold px-1"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ----------------------------------------------------
          MAIN SCREEN WORKSPACE NAVIGATION
          ---------------------------------------------------- */}
      {isAuthenticated && (
        <div className="flex-grow flex flex-col">
          {/* TOP BAR / DESKTOP WORKSPACE CONTROL PANEL */}
          <header className="px-6 py-4 bg-slate-900/80 border-b border-white/5 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-black text-white text-sm shadow-lg shadow-emerald-500/10">
                  PV
                </div>
                <div>
                  <h1 className="text-sm font-black text-white tracking-wider flex items-center gap-1.5 uppercase">
                    PSX VISION PRO
                    <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/10 text-emerald-400 rounded-full font-mono border border-emerald-500/20 lowercase">
                      live
                    </span>
                  </h1>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {t("tagline")}
                  </p>
                </div>
              </div>
            </div>

            {/* Simulated Workspace mode toggle */}
            <div className="hidden md:flex bg-slate-950 p-1 rounded-xl border border-white/5 text-xs font-medium self-center">
              <button
                onClick={() => setWorkspaceMode("DUAL")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  workspaceMode === "DUAL" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Dual Simulator Workspace
              </button>
              <button
                onClick={() => setWorkspaceMode("PHONE_ONLY")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  workspaceMode === "PHONE_ONLY" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Smartphone Screen Only
              </button>
              <button
                onClick={() => setWorkspaceMode("DESKTOP_ONLY")}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  workspaceMode === "DESKTOP_ONLY" ? "bg-indigo-600 text-white font-bold" : "text-slate-400 hover:text-white"
                }`}
              >
                Desktop Workspace Only
              </button>
            </div>

            {/* Profile Sign-out controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-right">
                <span className="text-[11px] text-slate-400 block font-medium">
                  Assalam-o-Alaikum, <strong className="text-white">{username}</strong>
                </span>
                <span className="block text-[9px] font-mono text-emerald-400 font-bold">
                  Bal: PKR {portfolio.cash.toLocaleString()}
                </span>
              </div>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setUsername("");
                }}
                className="p-2 bg-slate-950 hover:bg-slate-800 rounded-xl text-rose-400 border border-white/5 transition-all cursor-pointer"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </header>

          {/* ----------------------------------------------------
              WORKSPACE BODY
              ---------------------------------------------------- */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-12 gap-6 p-6 max-w-[1600px] w-full mx-auto">
            
            {/* COLUMN 1: SMARTPHONE DEVICE SIMULATOR (Left pane inside dual, or full on PHONE_ONLY) */}
            {(workspaceMode === "DUAL" || workspaceMode === "PHONE_ONLY") && (
              <div className={`${workspaceMode === "PHONE_ONLY" ? "md:col-span-12" : "md:col-span-4 lg:col-span-3"} flex justify-center items-start`}>
                <div className="w-full max-w-[340px] h-[670px] bg-slate-950 border-[8px] border-slate-900 rounded-[44px] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden relative border-black ring-1 ring-white/10 select-none">
                  
                  {/* Dynamic Island Notch */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-between px-3">
                    <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full animate-pulse" />
                    <div className="h-1 w-8 bg-slate-800 rounded-full" />
                  </div>

                  {/* Android Phone Status Bar */}
                  <div className="px-5 pt-3 pb-1.5 flex items-center justify-between text-[10px] text-slate-400 font-semibold z-40 bg-slate-950">
                    <span className="font-mono">{systemTime || "12:08"}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] font-bold text-emerald-500 tracking-tighter">4G LTE</span>
                      <div className="flex gap-0.5 items-end h-2 shrink-0">
                        <div className="w-[1.5px] h-1 bg-slate-400 rounded-full" />
                        <div className="w-[1.5px] h-1.5 bg-slate-400 rounded-full" />
                        <div className="w-[1.5px] h-2 bg-emerald-400 rounded-full" />
                      </div>
                      <span className="font-mono">98%</span>
                    </div>
                  </div>

                  {/* Live Indices Banner inside Mobile Frame */}
                  <div className="bg-slate-900 px-4 py-1.5 flex items-center justify-between border-b border-white/5 shrink-0 select-none">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-slate-400">KSE-100:</span>
                      <span className="text-[10px] font-black text-white font-mono">
                        {marketData ? marketData.indices.kse100.toLocaleString() : "78,450"}
                      </span>
                    </div>
                    <span className={`text-[9px] font-bold font-mono ${marketData && marketData.indices.kse100Change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                      {marketData && marketData.indices.kse100Change >= 0 ? "+" : ""}
                      {marketData ? marketData.indices.kse100ChangePercent : "0.00"}%
                    </span>
                  </div>

                  {/* PHONE SCREEN CONTAINER */}
                  <div className="flex-grow overflow-y-auto bg-slate-950 p-4 scrollbar-none pb-20">
                    
                    {/* Rendering the Active Screen in mobile framing */}
                    {activeScreen === "HOME" && (
                      <div className="space-y-4">
                        {/* Interactive welcome header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xs text-slate-400 font-medium">Assalam-o-Alaikum,</h3>
                            <h2 className="text-base font-black text-white">{username}</h2>
                          </div>
                          <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
                            <Sparkles className="h-4 w-4" />
                          </div>
                        </div>

                        {/* Search Quick Launcher */}
                        <div className="relative">
                          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-500" />
                          <input
                            type="text"
                            placeholder="Search PSX companies..."
                            onClick={() => {
                              setActiveScreen("MARKET");
                              if (workspaceMode === "DUAL") setWorkspaceMode("DUAL");
                            }}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-8 pr-3 text-xs placeholder-slate-500 text-white focus:outline-none cursor-pointer"
                            readOnly
                          />
                        </div>

                        {/* Top Indices Cards Slider */}
                        <div className="grid grid-cols-2 gap-3">
                          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">{t("kse100")}</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">
                              {marketData ? marketData.indices.kse100.toLocaleString() : "78,450.50"}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 mt-0.5 block">
                              +{marketData ? marketData.indices.kse100ChangePercent : "0.45"}%
                            </span>
                          </div>
                          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-blue-500/5 border border-indigo-500/20">
                            <span className="text-[9px] text-slate-400 font-bold block uppercase">{t("kse30")}</span>
                            <span className="text-sm font-black text-white font-mono mt-0.5 block">
                              {marketData ? marketData.indices.kse30.toLocaleString() : "24,820.10"}
                            </span>
                            <span className="text-[10px] font-mono font-bold text-emerald-400 mt-0.5 block">
                              +{marketData ? marketData.indices.kse30ChangePercent : "0.32"}%
                            </span>
                          </div>
                        </div>

                        {/* Top Gainers & Losers Tab Buttons */}
                        <div className="space-y-2 border border-white/5 p-3 rounded-2xl bg-slate-900/40">
                          <div className="flex items-center justify-between pb-2 border-b border-white/5">
                            <span className="text-xs font-bold text-white flex items-center gap-1">
                              <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                              {t("gainers")}
                            </span>
                            <button onClick={() => setActiveScreen("MARKET")} className="text-[10px] text-indigo-400 font-bold hover:underline">
                              See All
                            </button>
                          </div>
                          <div className="divide-y divide-white/5">
                            {gainerStocks.slice(0, 3).map((stock) => (
                              <div
                                key={stock.symbol}
                                onClick={() => {
                                  setSelectedSymbol(stock.symbol);
                                  setActiveScreen("DETAIL");
                                }}
                                className="py-2 flex items-center justify-between cursor-pointer hover:bg-white/5 px-1 rounded transition-colors"
                              >
                                <div>
                                  <span className="text-xs font-bold font-mono text-emerald-400 block">{stock.symbol}</span>
                                  <span className="text-[9px] text-slate-400 block truncate max-w-[120px]">{stock.name}</span>
                                </div>
                                <div className="text-right font-mono">
                                  <span className="text-xs font-bold text-white block">PKR {stock.price.toFixed(2)}</span>
                                  <span className="text-[10px] text-emerald-400">+{stock.changePercent}%</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Hot Sectors Tracker */}
                        <div className="space-y-2 p-3 rounded-2xl bg-slate-900/40 border border-white/5">
                          <h4 className="text-xs font-bold text-white">{lang === "en" ? "Sector Movers" : "شعبہ جاتی اتار چڑھاؤ"}</h4>
                          <div className="grid grid-cols-2 gap-2 text-[10px]">
                            <div className="p-2 rounded bg-slate-950 flex justify-between items-center">
                              <span className="text-slate-400">Technology</span>
                              <span className="text-emerald-400 font-bold font-mono">+1.8%</span>
                            </div>
                            <div className="p-2 rounded bg-slate-950 flex justify-between items-center">
                              <span className="text-slate-400">Commercial Banks</span>
                              <span className="text-rose-400 font-bold font-mono">-0.4%</span>
                            </div>
                          </div>
                        </div>

                        {/* Recent breaking news */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{t("breaking_news")}</span>
                            <button onClick={() => setActiveScreen("NEWS")} className="text-[10px] text-indigo-400 font-bold">More</button>
                          </h4>
                          {MOCK_NEWS.slice(0, 2).map((news) => (
                            <div
                              key={news.id}
                              onClick={() => setActiveScreen("NEWS")}
                              className="p-3 bg-slate-900/60 rounded-xl border border-white/5 space-y-1 cursor-pointer hover:border-slate-700 transition-all"
                            >
                              <span className="text-[8px] bg-slate-950 px-2 py-0.5 rounded-full text-slate-400 font-semibold uppercase">{news.category}</span>
                              <h5 className="text-[11px] font-bold text-white line-clamp-2 leading-snug">{news.title}</h5>
                              <p className="text-[9px] text-slate-500">{news.time} • {news.source}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeScreen === "MARKET" && (
                      <div className="space-y-4">
                        <h2 className="text-sm font-black text-white">{lang === "en" ? "Market Watchlist Sync" : "مارکیٹ واچ لسٹ سنک"}</h2>
                        <div className="space-y-2">
                          {marketData?.stocks.map((stock) => {
                            const isPrevHigher = prevPrices[stock.symbol] !== undefined && stock.price > prevPrices[stock.symbol];
                            const isPrevLower = prevPrices[stock.symbol] !== undefined && stock.price < prevPrices[stock.symbol];
                            const isWatchlisted = watchlist.includes(stock.symbol);

                            return (
                              <div
                                key={stock.symbol}
                                onClick={() => {
                                  setSelectedSymbol(stock.symbol);
                                  setActiveScreen("DETAIL");
                                }}
                                className={`p-3 rounded-2xl bg-slate-900/40 border border-white/5 flex items-center justify-between cursor-pointer transition-all ${
                                  isPrevHigher ? "bg-emerald-500/10 ring-1 ring-emerald-500/40" : isPrevLower ? "bg-rose-500/10 ring-1 ring-rose-500/40" : "hover:bg-slate-900/80"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleWatchlist(stock.symbol);
                                    }}
                                    className="p-1 text-slate-500 hover:text-rose-400 transition-all"
                                  >
                                    <Heart className={`h-4 w-4 ${isWatchlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                                  </button>
                                  <div>
                                    <span className="text-xs font-bold font-mono text-indigo-400 block">{stock.symbol}</span>
                                    <span className="text-[9px] text-slate-400 block max-w-[100px] truncate">{stock.name}</span>
                                  </div>
                                </div>
                                <div className="text-right font-mono">
                                  <span className="text-xs font-bold text-white block">PKR {stock.price.toFixed(2)}</span>
                                  <span className={`text-[10px] ${stock.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                    {stock.changePercent >= 0 ? "+" : ""}
                                    {stock.changePercent}%
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {activeScreen === "DETAIL" && selectedStockObj && (
                      <div className="space-y-4">
                        <button
                          onClick={() => setActiveScreen("MARKET")}
                          className="text-[10px] text-slate-400 hover:text-white font-bold flex items-center gap-1"
                        >
                          ← Market Watch
                        </button>
                        
                        {/* Stock Header */}
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs px-2.5 py-0.5 bg-white/5 rounded text-slate-300 font-mono font-bold border border-white/10">
                              {selectedStockObj.symbol}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">{selectedStockObj.sector}</span>
                          </div>
                          <h3 className="text-sm font-black text-white mt-1">{selectedStockObj.name}</h3>
                          <div className="mt-2 flex items-baseline gap-2">
                            <span className="text-xl font-extrabold text-white font-mono">PKR {selectedStockObj.price.toFixed(2)}</span>
                            <span className={`text-xs font-bold font-mono ${selectedStockObj.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                              {selectedStockObj.changePercent >= 0 ? "+" : ""}
                              {selectedStockObj.changePercent}%
                            </span>
                          </div>
                        </div>

                        {/* Technical Indicator Buttons */}
                        <div className="grid grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">14-Day RSI</span>
                            <span className={`block font-mono font-bold text-xs mt-0.5 ${selectedStockObj.rsi > 70 ? "text-rose-400" : selectedStockObj.rsi < 35 ? "text-emerald-400" : "text-white"}`}>
                              {selectedStockObj.rsi}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-slate-900 border border-white/5">
                            <span className="text-slate-400 block uppercase font-bold tracking-wider text-[8px]">MACD Status</span>
                            <span className="block font-mono font-bold text-xs mt-0.5 text-indigo-300">
                              {selectedStockObj.macd > 0 ? "BULLISH" : "BEARISH"} ({selectedStockObj.macd})
                            </span>
                          </div>
                        </div>

                        {/* Interactive Trade trigger links */}
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            onClick={() => {
                              setActiveScreen("PORTFOLIO");
                              setTradeType("BUY");
                              setTradePrice(selectedStockObj.price);
                            }}
                            className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 rounded-xl text-xs font-black text-white shadow-lg shadow-emerald-500/10 cursor-pointer"
                          >
                            Buy Stock
                          </button>
                          <button
                            onClick={() => {
                              setActiveScreen("PORTFOLIO");
                              setTradeType("SELL");
                              setTradePrice(selectedStockObj.price);
                            }}
                            className="w-full py-2 bg-rose-500 hover:bg-rose-600 rounded-xl text-xs font-black text-white cursor-pointer"
                          >
                            Sell Stock
                          </button>
                        </div>
                      </div>
                    )}

                    {activeScreen === "PORTFOLIO" && (
                      <div className="space-y-4">
                        <h2 className="text-sm font-black text-white">{t("holding_summary")}</h2>
                        
                        {/* Summary panel */}
                        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 text-center space-y-1">
                          <span className="text-[9px] uppercase tracking-wider text-indigo-300 font-bold block">{t("total_value")}</span>
                          <span className="text-xl font-black text-white font-mono block">PKR {totalPortfolioValue.toLocaleString()}</span>
                          <span className={`text-[11px] font-mono font-bold block ${portfolioGainLoss.value >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {portfolioGainLoss.value >= 0 ? "+" : ""}
                            PKR {portfolioGainLoss.value.toLocaleString()} ({portfolioGainLoss.percent.toFixed(2)}%)
                          </span>
                        </div>

                        {/* Trade Ledger list */}
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-white">Active Positions</h4>
                          {holdings.length > 0 ? (
                            holdings.map((h) => {
                              const s = activeStocksDb[h.symbol];
                              const currentVal = h.qty * (s ? s.price : h.avgPrice);
                              const costBasis = h.qty * h.avgPrice;
                              const profit = currentVal - costBasis;

                              return (
                                <div key={h.symbol} className="p-3 rounded-xl bg-slate-900/60 border border-white/5 flex justify-between items-center text-xs">
                                  <div>
                                    <span className="font-bold text-white font-mono block">{h.symbol}</span>
                                    <span className="text-[10px] text-slate-400 block">{h.qty} shares @ PKR {h.avgPrice}</span>
                                  </div>
                                  <div className="text-right font-mono">
                                    <span className="font-bold text-white block">PKR {currentVal.toLocaleString()}</span>
                                    <span className={`text-[10px] ${profit >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                      {profit >= 0 ? "+" : ""}
                                      {profit.toFixed(0)}
                                    </span>
                                  </div>
                                </div>
                              );
                            })
                          ) : (
                            <p className="text-[10px] text-slate-500 text-center py-4">No active holdings log.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Fallback to Desktop helper details for secondary screens on mobile frame */}
                    {!["HOME", "MARKET", "DETAIL", "PORTFOLIO"].includes(activeScreen) && (
                      <div className="p-6 text-center text-slate-400 space-y-2">
                        <Brain className="h-8 w-8 text-indigo-400 mx-auto" />
                        <h3 className="text-xs font-bold text-white">Advanced Console Feature</h3>
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                          This screen features complex graphics, full analytics, or AI chats. Please view it in the wide <strong>Desktop Workspace Panel</strong> to experience its full design fidelity.
                        </p>
                        <button
                          onClick={() => setActiveScreen("HOME")}
                          className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] text-indigo-300"
                        >
                          Back to Home
                        </button>
                      </div>
                    )}

                  </div>

                  {/* ANDROID DEVICE GLASS BOTTOM NAVIGATION BAR */}
                  <div className="absolute bottom-0 left-0 right-0 bg-slate-900/90 border-t border-white/10 backdrop-blur-md px-4 py-2 flex items-center justify-between z-40 select-none">
                    <button
                      onClick={() => setActiveScreen("HOME")}
                      className={`flex flex-col items-center gap-0.5 text-[8px] font-bold ${
                        activeScreen === "HOME" ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <LayoutGrid className="h-4 w-4" />
                      Home
                    </button>
                    <button
                      onClick={() => setActiveScreen("MARKET")}
                      className={`flex flex-col items-center gap-0.5 text-[8px] font-bold ${
                        activeScreen === "MARKET" ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <BarChart2 className="h-4 w-4" />
                      Market
                    </button>
                    <button
                      onClick={() => setActiveScreen("PORTFOLIO")}
                      className={`flex flex-col items-center gap-0.5 text-[8px] font-bold ${
                        activeScreen === "PORTFOLIO" ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <Briefcase className="h-4 w-4" />
                      Portfolio
                    </button>
                    <button
                      onClick={() => {
                        // Switch active screen, and ensure dual pane focuses settings
                        setActiveScreen("SETTINGS");
                      }}
                      className={`flex flex-col items-center gap-0.5 text-[8px] font-bold ${
                        activeScreen === "SETTINGS" ? "text-indigo-400" : "text-slate-500 hover:text-slate-300"
                      }`}
                    >
                      <SettingsIcon className="h-4 w-4" />
                      Settings
                    </button>
                  </div>

                  {/* Simulated Dynamic OS Swipe Bar */}
                  <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-24 h-1 bg-white/30 rounded-full z-50 pointer-events-none" />

                </div>
              </div>
            )}

            {/* COLUMN 2: EXPANSIVE DESKTOP COMMAND CENTER DASHBOARD (Right pane in DUAL, or full on DESKTOP_ONLY) */}
            {(workspaceMode === "DUAL" || workspaceMode === "DESKTOP_ONLY") && (
              <div className={`${workspaceMode === "DESKTOP_ONLY" ? "md:col-span-12" : "md:col-span-8 lg:col-span-9"} space-y-6 flex flex-col`}>
                
                {/* Desktop Tabs Header Selector */}
                <div className="flex bg-slate-900/60 p-1.5 rounded-2xl border border-white/5 self-start overflow-x-auto scrollbar-none max-w-full">
                  {(["HOME", "MARKET", "DETAIL", "PORTFOLIO", "WATCHLIST", "AI_ANALYSIS", "AI_PREDICT", "NEWS", "SCREENER", "COMPARE", "SETTINGS", "FLUTTER_SDK"] as const).map((screen) => (
                    <button
                      key={screen}
                      onClick={() => setActiveScreen(screen)}
                      className={`px-3.5 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        activeScreen === screen
                          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 font-bold"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {screen === "HOME" && <LayoutGrid className="h-4 w-4" />}
                      {screen === "MARKET" && <BarChart2 className="h-4 w-4" />}
                      {screen === "DETAIL" && <Eye className="h-4 w-4" />}
                      {screen === "PORTFOLIO" && <Briefcase className="h-4 w-4" />}
                      {screen === "WATCHLIST" && <Heart className="h-4 w-4" />}
                      {screen === "AI_ANALYSIS" && <Brain className="h-4 w-4" />}
                      {screen === "AI_PREDICT" && <Sparkles className="h-4 w-4" />}
                      {screen === "NEWS" && <Newspaper className="h-4 w-4" />}
                      {screen === "SCREENER" && <Sliders className="h-4 w-4" />}
                      {screen === "COMPARE" && <Scale className="h-4 w-4" />}
                      {screen === "SETTINGS" && <SettingsIcon className="h-4 w-4" />}
                      {screen === "FLUTTER_SDK" && <Layers className="h-4 w-4" />}
                      {screen === "FLUTTER_SDK" ? (lang === "en" ? "Flutter Codebase" : "فلٹر کوڈ بیس") : t(screen.toLowerCase() as any)}
                    </button>
                  ))}
                </div>

                {/* MAIN CONTENT WORKSPACE VIEWPORT */}
                <div className="flex-1 bg-slate-900/30 border border-white/5 rounded-3xl p-6 backdrop-blur-lg">
                  
                  {activeScreen === "HOME" && (
                    <div className="space-y-6">
                      {/* Big Hero Banner */}
                      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-purple-950/20 border border-indigo-500/20 relative overflow-hidden flex items-center justify-between">
                        <div className="space-y-2 z-10">
                          <span className="px-2.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full text-[10px] font-bold border border-indigo-500/20 uppercase tracking-wider">
                            Pakistan Stock Exchange (PSX)
                          </span>
                          <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                            {lang === "en" ? "Pakistan's Most Advanced Financial Intelligence Engine" : "پاکستان کا سب سے جدید مالیاتی انٹیلیجنس انجن"}
                          </h2>
                          <p className="text-xs text-slate-400 max-w-xl">
                            {lang === "en"
                              ? "Monitor live KSE ticker valuations, run on-demand technical audits with Google Gemini 3.5 models, manage trades, and screen Pakistan's top blue-chip equities."
                              : "براہ راست KSE ٹیکر ویلیو ایشنز کی نگرانی کریں، گوگل جیمنی 3.5 ماڈلز کے ساتھ آن ڈیمانڈ ٹیکنیکل آڈٹ چلائیں، اور ٹریڈز کا انتظام کریں۔"}
                          </p>
                        </div>
                        <div className="hidden lg:block p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
                          <TrendingUp className="h-16 w-16 text-emerald-400 animate-pulse" />
                        </div>
                      </div>

                      {/* Wide Stats Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* KSE-100 */}
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-400">{t("kse100")}</span>
                            <span className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold ${marketData && marketData.indices.kse100Change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                              {marketData && marketData.indices.kse100Change >= 0 ? "▲" : "▼"}{marketData ? marketData.indices.kse100ChangePercent : "0.00"}%
                            </span>
                          </div>
                          <div className="mt-4">
                            <span className="text-2xl font-black text-white font-mono">
                              {marketData ? marketData.indices.kse100.toLocaleString() : "78,450.50"}
                            </span>
                            <span className="block text-[10px] text-slate-500 font-mono mt-1">
                              Prev Close: 78,100.00 | Net Chg: +{marketData ? marketData.indices.kse100Change : "350"}
                            </span>
                          </div>
                        </div>

                        {/* KSE-30 */}
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-400">{t("kse30")}</span>
                            <span className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold ${marketData && marketData.indices.kse30Change >= 0 ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                              {marketData && marketData.indices.kse30Change >= 0 ? "▲" : "▼"}{marketData ? marketData.indices.kse30ChangePercent : "0.00"}%
                            </span>
                          </div>
                          <div className="mt-4">
                            <span className="text-2xl font-black text-white font-mono">
                              {marketData ? marketData.indices.kse30.toLocaleString() : "24,820.10"}
                            </span>
                            <span className="block text-[10px] text-slate-500 font-mono mt-1">
                              Prev Close: 24,700.00 | Net Chg: +{marketData ? marketData.indices.kse30Change : "120"}
                            </span>
                          </div>
                        </div>

                        {/* Top Industry Movers */}
                        <div className="p-5 rounded-2xl bg-slate-900/60 border border-white/5 flex flex-col justify-between">
                          <span className="text-xs font-bold text-slate-400 block pb-2 border-b border-white/5">
                            {lang === "en" ? "Market Heat Status" : "مارکیٹ کا درجہ حرارت"}
                          </span>
                          <div className="space-y-2 mt-2">
                            <div className="flex justify-between text-xs text-slate-300">
                              <span>Oil & Gas Exploration</span>
                              <span className="text-emerald-400 font-bold font-mono">+3.1%</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-300">
                              <span>Technology</span>
                              <span className="text-emerald-400 font-bold font-mono">+2.2%</span>
                            </div>
                            <div className="flex justify-between text-xs text-slate-400">
                              <span>Commercial Banks</span>
                              <span className="text-rose-400 font-bold font-mono">-0.4%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Economic Calendar & Movers Grid */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Gainers / Losers tab matrices */}
                        <div className="lg:col-span-8 bg-slate-900/60 border border-white/5 p-5 rounded-2xl space-y-4">
                          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Sliders className="h-4 w-4 text-emerald-400" />
                            <span>{lang === "en" ? "Live Market Highlights" : "براہ راست مارکیٹ کی جھلکیاں"}</span>
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Gainers */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-emerald-400 border-b border-white/5 pb-1">{t("gainers")}</h4>
                              <div className="divide-y divide-white/5">
                                {gainerStocks.map((s) => (
                                  <div
                                    key={s.symbol}
                                    onClick={() => {
                                      setSelectedSymbol(s.symbol);
                                      setActiveScreen("DETAIL");
                                    }}
                                    className="py-2 flex justify-between text-xs cursor-pointer hover:bg-white/5 px-1.5 rounded transition-colors"
                                  >
                                    <span className="font-bold text-white font-mono">{s.symbol}</span>
                                    <span className="text-slate-400 truncate max-w-[120px]">{s.name}</span>
                                    <span className="text-emerald-400 font-mono font-bold">+{s.changePercent}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            {/* Losers */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-bold text-rose-400 border-b border-white/5 pb-1">{t("losers")}</h4>
                              <div className="divide-y divide-white/5">
                                {loserStocks.map((s) => (
                                  <div
                                    key={s.symbol}
                                    onClick={() => {
                                      setSelectedSymbol(s.symbol);
                                      setActiveScreen("DETAIL");
                                    }}
                                    className="py-2 flex justify-between text-xs cursor-pointer hover:bg-white/5 px-1.5 rounded transition-colors"
                                  >
                                    <span className="font-bold text-white font-mono">{s.symbol}</span>
                                    <span className="text-slate-400 truncate max-w-[120px]">{s.name}</span>
                                    <span className="text-rose-400 font-mono font-bold">{s.changePercent}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Economic Calendar list */}
                        <div className="lg:col-span-4 bg-slate-900/60 border border-white/5 p-5 rounded-2xl space-y-4">
                          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-indigo-400" />
                            <span>{t("economic_calendar")}</span>
                          </h3>
                          <div className="space-y-3">
                            {ECONOMIC_EVENTS.map((event, idx) => (
                              <div key={idx} className="p-3 bg-slate-950/40 rounded-xl border border-white/5 space-y-1">
                                <div className="flex justify-between items-center text-[9px]">
                                  <span className="text-slate-500 font-medium">{event.date}</span>
                                  <span className={`px-2 py-0.5 rounded font-bold ${event.impact === "High" ? "bg-rose-500/10 text-rose-400" : "bg-amber-500/10 text-amber-400"}`}>
                                    {event.impact} Impact
                                  </span>
                                </div>
                                <h5 className="text-[11px] font-bold text-white leading-snug">{event.event}</h5>
                                <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                                  <span>Prev: {event.previous}</span>
                                  <span>Forecast: {event.forecast}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreen === "MARKET" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight">{lang === "en" ? "Pakistan Stock Ticker Feed" : "پاکستان اسٹاک ٹیکر فیڈ"}</h2>
                          <p className="text-xs text-slate-400">
                            {lang === "en" ? "Second-by-second auto-updating market equity values" : "براہ راست سیکنڈ بہ سیکنڈ مارکیٹ قیمتوں کی رپورٹ"}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-mono border border-emerald-500/20 flex items-center gap-1.5">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Auto Syncing Active
                        </span>
                      </div>

                      {/* Wide interactive Stock Table */}
                      <div className="bg-slate-900/60 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="bg-slate-950/50 text-slate-400 font-medium border-b border-white/5">
                                <th className="p-4">{t("price")}</th>
                                <th className="p-4">{t("change")}</th>
                                <th className="p-4">{t("volume")}</th>
                                <th className="p-4">{t("sector")}</th>
                                <th className="p-4 text-center">{t("pe_ratio")}</th>
                                <th className="p-4 text-center">{t("div_yield")}</th>
                                <th className="p-4 text-right">{t("market_cap")}</th>
                                <th className="p-4 text-center">Watch</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                              {marketData?.stocks.map((stock) => {
                                const isPrevHigher = prevPrices[stock.symbol] !== undefined && stock.price > prevPrices[stock.symbol];
                                const isPrevLower = prevPrices[stock.symbol] !== undefined && stock.price < prevPrices[stock.symbol];
                                const isWatchlisted = watchlist.includes(stock.symbol);

                                return (
                                  <tr
                                    key={stock.symbol}
                                    onClick={() => {
                                      setSelectedSymbol(stock.symbol);
                                      setActiveScreen("DETAIL");
                                    }}
                                    className={`cursor-pointer transition-all ${
                                      isPrevHigher ? "bg-emerald-500/10" : isPrevLower ? "bg-rose-500/10" : "hover:bg-white/5"
                                    }`}
                                  >
                                    <td className="p-4">
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-white font-mono text-sm block">{stock.symbol}</span>
                                        <span className="text-[10px] text-slate-400 block max-w-[120px] truncate">{stock.name}</span>
                                      </div>
                                    </td>
                                    <td className="p-4 font-bold text-white font-mono text-sm">
                                      PKR {stock.price.toFixed(2)}
                                    </td>
                                    <td className={`p-4 font-mono font-bold ${stock.change >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                      {stock.change >= 0 ? "+" : ""}
                                      {stock.changePercent}%
                                    </td>
                                    <td className="p-4 text-slate-300 font-mono">{stock.volume.toLocaleString()}</td>
                                    <td className="p-4 text-slate-400">{stock.sector}</td>
                                    <td className="p-4 text-center text-slate-200 font-mono">{stock.pe}x</td>
                                    <td className="p-4 text-center text-slate-200 font-mono">{stock.divYield}%</td>
                                    <td className="p-4 text-right text-slate-200 font-mono">PKR {stock.marketCap}B</td>
                                    <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                                      <button
                                        onClick={() => toggleWatchlist(stock.symbol)}
                                        className="p-1 text-slate-500 hover:text-rose-400 transition-all"
                                      >
                                        <Heart className={`h-4 w-4 ${isWatchlisted ? "fill-rose-500 text-rose-500" : ""}`} />
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreen === "DETAIL" && selectedStockObj && (
                    <div className="space-y-6">
                      {/* Detailed header block */}
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/5">
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="px-3 py-0.5 bg-indigo-500/10 text-indigo-300 font-mono font-bold rounded border border-indigo-500/20 text-sm">
                              {selectedStockObj.symbol}
                            </span>
                            <span className="text-xs text-slate-400 font-medium">{selectedStockObj.sector}</span>
                          </div>
                          <h2 className="text-xl font-extrabold text-white">{selectedStockObj.name}</h2>
                        </div>
                        <div className="flex items-baseline gap-2 text-right">
                          <span className="text-2xl font-black text-white font-mono">PKR {selectedStockObj.price.toFixed(2)}</span>
                          <span className={`text-sm font-bold font-mono ${selectedStockObj.changePercent >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {selectedStockObj.changePercent >= 0 ? "+" : ""}
                            {selectedStockObj.changePercent}%
                          </span>
                        </div>
                      </div>

                      {/* Interactive chart controller & visual overlays */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Chart panel */}
                        <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5 text-xs font-semibold">
                              <button
                                onClick={() => setChartType("LINE")}
                                className={`px-2.5 py-1 rounded-lg ${chartType === "LINE" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                              >
                                Line
                              </button>
                              <button
                                onClick={() => setChartType("AREA")}
                                className={`px-2.5 py-1 rounded-lg ${chartType === "AREA" ? "bg-indigo-600 text-white" : "text-slate-400"}`}
                              >
                                Area
                              </button>
                            </div>

                            {/* Overlays list */}
                            <select
                              value={overlayIndicator}
                              onChange={(e) => setOverlayIndicator(e.target.value as any)}
                              className="bg-slate-950 border border-slate-700/50 rounded-xl py-1 px-2.5 text-xs text-slate-300 focus:outline-none"
                            >
                              <option value="NONE">No Overlay Indicators</option>
                              <option value="SMA">SMA (20-Day)</option>
                              <option value="EMA">EMA (50-Day)</option>
                              <option value="BB">Bollinger Bands (Upper/Lower)</option>
                            </select>
                          </div>

                          {/* Historical Chart */}
                          <div className="h-64 w-full">
                            {loadingHistory ? (
                              <div className="h-full flex items-center justify-center">
                                <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                              </div>
                            ) : (
                              <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stockHistory} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={["auto", "auto"]} />
                                  <Tooltip
                                    contentStyle={{ backgroundColor: "#0f172a", borderColor: "#1e293b", borderRadius: "12px", color: "#fff" }}
                                  />
                                  <defs>
                                    <linearGradient id="colorStock" x1="0" y1="0" x2="0" y2="1">
                                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                  </defs>
                                  <Area
                                    type="monotone"
                                    dataKey="close"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill={chartType === "AREA" ? "url(#colorStock)" : "none"}
                                  />
                                </AreaChart>
                              </ResponsiveContainer>
                            )}
                          </div>
                        </div>

                        {/* Financial ratio grids */}
                        <div className="lg:col-span-4 bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">
                            Key Fundamental Indicators
                          </h3>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                              <span className="text-[10px] text-slate-400 block font-medium">{t("pe_ratio")}</span>
                              <span className="text-sm font-bold text-white font-mono block mt-0.5">{selectedStockObj.pe}x</span>
                            </div>
                            <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                              <span className="text-[10px] text-slate-400 block font-medium">{t("div_yield")}</span>
                              <span className="text-sm font-bold text-emerald-400 font-mono block mt-0.5">{selectedStockObj.divYield}%</span>
                            </div>
                            <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                              <span className="text-[10px] text-slate-400 block font-medium">{t("earnings_ps")}</span>
                              <span className="text-sm font-bold text-white font-mono block mt-0.5">PKR {selectedStockObj.eps}</span>
                            </div>
                            <div className="p-3 bg-slate-950/40 rounded-xl border border-white/5 text-center">
                              <span className="text-[10px] text-slate-400 block font-medium">{t("market_cap")}</span>
                              <span className="text-sm font-bold text-indigo-300 font-mono block mt-0.5">PKR {selectedStockObj.marketCap}B</span>
                            </div>
                          </div>

                          <div className="space-y-2 mt-4 pt-4 border-t border-white/5">
                            <h4 className="text-[11px] font-bold text-white block">Recent Corporate Announcements</h4>
                            <div className="space-y-1.5">
                              {selectedStockObj.announcements.map((ann, idx) => (
                                <div key={idx} className="p-2 bg-slate-950/20 rounded-lg text-[10px] text-slate-300">
                                  <span className="text-slate-500 font-mono">{ann.date} • </span>
                                  {ann.title}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreen === "PORTFOLIO" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight">{t("holding_summary")}</h2>
                          <p className="text-xs text-slate-400">
                            {lang === "en" ? "Track custom buy/sell transaction books with allocation pie charts" : "الوکیشن پائی چارٹ کے ساتھ سرمایہ کاری اور تجارتی بک کا انتظام کریں"}
                          </p>
                        </div>
                        <button
                          onClick={exportPortfolioCSV}
                          className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-500/10"
                        >
                          <Download className="h-4 w-4" />
                          {lang === "en" ? "Export portfolio as CSV" : "پورٹ فولیو برآمد کریں"}
                        </button>
                      </div>

                      {/* Wide Stats grids */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{t("total_value")}</span>
                          <span className="text-xl font-black text-white font-mono block mt-1">PKR {totalPortfolioValue.toLocaleString()}</span>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">{t("profit_loss")}</span>
                          <span className={`text-xl font-black font-mono block mt-1 ${portfolioGainLoss.value >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                            {portfolioGainLoss.value >= 0 ? "+" : ""}
                            PKR {portfolioGainLoss.value.toLocaleString()}
                          </span>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Compound Annual Growth (CAGR)</span>
                          <span className="text-xl font-black text-indigo-300 font-mono block mt-1">14.85%</span>
                        </div>
                        <div className="p-4 bg-slate-900/60 border border-white/5 rounded-2xl text-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase">Daily Returns Status</span>
                          <span className="text-xl font-black text-emerald-400 font-mono block mt-1">+1.25%</span>
                        </div>
                      </div>

                      {/* Transaction addition form & Active ledger */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Transaction form */}
                        <form onSubmit={handleAddTransaction} className="lg:col-span-4 bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-4">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5">
                            <Plus className="h-4 w-4 text-emerald-400" />
                            <span>{lang === "en" ? "Post New Transaction" : "نیا لین دین شامل کریں"}</span>
                          </h3>

                          {/* Buy / sell selector */}
                          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-white/5">
                            <button
                              type="button"
                              onClick={() => setTradeType("BUY")}
                              className={`py-1.5 text-xs font-bold rounded-lg ${tradeType === "BUY" ? "bg-emerald-500 text-white" : "text-slate-400"}`}
                            >
                              Buy Share
                            </button>
                            <button
                              type="button"
                              onClick={() => setTradeType("SELL")}
                              className={`py-1.5 text-xs font-bold rounded-lg ${tradeType === "SELL" ? "bg-rose-500 text-white" : "text-slate-400"}`}
                            >
                              Sell Share
                            </button>
                          </div>

                          {/* Symbol selection dropdown */}
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-bold block uppercase">Select Company Symbol</label>
                            <select
                              value={selectedSymbol}
                              onChange={(e) => {
                                setSelectedSymbol(e.target.value);
                                const currentStock = activeStocksDb[e.target.value];
                                if (currentStock) setTradePrice(currentStock.price);
                              }}
                              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                            >
                              {marketData?.stocks.map((s) => (
                                <option key={s.symbol} value={s.symbol}>
                                  {s.symbol} - {s.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Qty & Price */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold block uppercase">Quantity</label>
                              <input
                                type="number"
                                min={1}
                                required
                                value={tradeQty}
                                onChange={(e) => setTradeQty(parseInt(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white text-center font-mono"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold block uppercase">Price (PKR)</label>
                              <input
                                type="number"
                                step={0.01}
                                min={0.01}
                                required
                                value={tradePrice}
                                onChange={(e) => setTradePrice(parseFloat(e.target.value) || 0)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white text-center font-mono"
                              />
                            </div>
                          </div>

                          {/* Submit */}
                          <button
                            type="submit"
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
                          >
                            Commit Trade Entry
                          </button>
                        </form>

                        {/* Active Ledger table */}
                        <div className="lg:col-span-8 bg-slate-900/40 border border-white/5 p-5 rounded-2xl flex flex-col">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">
                            Transaction Ledger Logs
                          </h3>
                          <div className="flex-1 overflow-y-auto max-h-[220px] mt-4">
                            {portfolio.transactions.length > 0 ? (
                              <table className="w-full text-left text-xs border-collapse">
                                <thead>
                                  <tr className="text-slate-400 border-b border-white/5 pb-2">
                                    <th className="py-2">Symbol</th>
                                    <th className="py-2">Type</th>
                                    <th className="py-2 text-right">Quantity</th>
                                    <th className="py-2 text-right">Price</th>
                                    <th className="py-2 text-right">Date</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-slate-300">
                                  {portfolio.transactions.map((tx) => (
                                    <tr key={tx.id} className="hover:bg-white/5">
                                      <td className="py-2 font-mono font-bold text-indigo-400">{tx.symbol}</td>
                                      <td className="py-2">
                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${tx.type === "BUY" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                                          {tx.type}
                                        </span>
                                      </td>
                                      <td className="py-2 text-right font-mono">{tx.qty}</td>
                                      <td className="py-2 text-right font-mono">PKR {tx.price.toFixed(2)}</td>
                                      <td className="py-2 text-right font-mono text-slate-500">{tx.date}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <p className="text-xs text-slate-500 py-10 text-center">No transaction logs available.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreen === "WATCHLIST" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight">{lang === "en" ? "Equity Watchlist" : "ایکویٹی واچ لسٹ"}</h2>
                          <p className="text-xs text-slate-400">
                            {lang === "en" ? "Manage bookmarked equities and configure custom ABOVE/BELOW notifications" : "پسندیدہ اسٹاکس کا انتظام کریں اور الارم ترتیبات ترتیب دیں"}
                          </p>
                        </div>
                      </div>

                      {/* Custom Alerts Form and alarms list */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Custom alarm creator */}
                        <div className="lg:col-span-5 bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-4">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5 flex items-center gap-1.5">
                            <Bell className="h-4 w-4 text-indigo-400" />
                            <span>{lang === "en" ? "Set Price Alerts Alarm" : "قیمت کا الارم ترتیب دیں"}</span>
                          </h3>

                          <form
                            onSubmit={(e) => {
                              const target = parseFloat((e.currentTarget.elements.namedItem("alertVal") as HTMLInputElement).value) || 0;
                              const alertType = (e.currentTarget.elements.namedItem("alertType") as HTMLSelectElement).value as "ABOVE" | "BELOW";
                              handleCreateAlert(e, selectedSymbol, target, alertType);
                              e.currentTarget.reset();
                            }}
                            className="space-y-4"
                          >
                            <div className="space-y-1">
                              <label className="text-[10px] text-slate-400 font-bold block uppercase">Stock Symbol</label>
                              <select
                                value={selectedSymbol}
                                onChange={(e) => setSelectedSymbol(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                              >
                                {marketData?.stocks.map((s) => (
                                  <option key={s.symbol} value={s.symbol}>
                                    {s.symbol} - {s.name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-bold block uppercase">Trigger When Price</label>
                                <select
                                  name="alertType"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white"
                                >
                                  <option value="ABOVE">Goes ABOVE (▲)</option>
                                  <option value="BELOW">Drops BELOW (▼)</option>
                                </select>
                              </div>
                              <div className="space-y-1">
                                <label className="text-[10px] text-slate-400 font-bold block uppercase">Target Price (PKR)</label>
                                <input
                                  type="number"
                                  name="alertVal"
                                  step={0.01}
                                  required
                                  placeholder="e.g. 395.00"
                                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-xs text-white text-center font-mono"
                                />
                              </div>
                            </div>

                            <button
                              type="submit"
                              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
                            >
                              Add Price Alert Notification
                            </button>
                          </form>
                        </div>

                        {/* Watchlist table & alerts logs */}
                        <div className="lg:col-span-7 bg-slate-900/40 border border-white/5 p-5 rounded-2xl space-y-4">
                          <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-white/5">
                            Watchlist & Custom Alerts Status
                          </h3>
                          <div className="space-y-3 max-h-[220px] overflow-y-auto">
                            {priceAlerts.length > 0 ? (
                              priceAlerts.map((alert) => (
                                <div key={alert.id} className="p-3 bg-slate-950/40 border border-white/5 rounded-xl flex items-center justify-between text-xs">
                                  <div>
                                    <span className="font-bold text-white font-mono">{alert.symbol}</span>
                                    <span className="text-slate-400 text-[10px] ml-1.5">
                                      Notifies when price goes {alert.type} PKR {alert.targetPrice}
                                    </span>
                                  </div>
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${alert.active ? "bg-emerald-500/10 text-emerald-400" : "bg-slate-800 text-slate-500"}`}>
                                    {alert.active ? "Active Alarm" : "Crossed/Muted"}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs text-slate-500 py-10 text-center">No active price alarms set.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreen === "AI_ANALYSIS" && (
                    <AIAnalysis
                      stocks={marketData?.stocks || []}
                      selectedSymbol={selectedSymbol}
                      lang={lang}
                      onSelectStock={(sym) => setSelectedSymbol(sym)}
                    />
                  )}

                  {activeScreen === "AI_PREDICT" && (
                    <AIPrediction
                      stocks={marketData?.stocks || []}
                      selectedSymbol={selectedSymbol}
                      lang={lang}
                      onSelectStock={(sym) => setSelectedSymbol(sym)}
                    />
                  )}

                  {activeScreen === "SCREENER" && (
                    <Screener
                      stocks={marketData?.stocks || []}
                      lang={lang}
                      onSelectStock={(sym) => {
                        setSelectedSymbol(sym);
                        setActiveScreen("DETAIL");
                      }}
                    />
                  )}

                  {activeScreen === "COMPARE" && (
                    <CompareStocks
                      stocks={marketData?.stocks || []}
                      lang={lang}
                    />
                  )}

                  {activeScreen === "NEWS" && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h2 className="text-xl font-bold text-white tracking-tight">{t("breaking_news")}</h2>
                          <p className="text-xs text-slate-400">
                            {lang === "en" ? "Pakistan corporate disclosures and macroeconomic briefings" : "پاکستان کارپوریٹ ڈسکلوزرز اور معاشی حالات کی رپورٹس"}
                          </p>
                        </div>
                      </div>

                      {/* Filter tabs */}
                      <div className="flex bg-slate-950/60 p-1 rounded-xl border border-white/5 self-start overflow-x-auto">
                        {(["ALL", "PSX", "Business", "Economy", "Company"] as const).map((category) => (
                          <button
                            key={category}
                            onClick={() => setNewsCategory(category)}
                            className={`px-3 py-1.5 text-xs rounded-lg transition-all ${
                              newsCategory === category ? "bg-indigo-500/10 text-indigo-300 font-bold" : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {category === "ALL" ? "All Briefs" : category}
                          </button>
                        ))}
                      </div>

                      {/* News List */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {filteredNews.map((news) => (
                          <div key={news.id} className="p-5 bg-slate-900/40 border border-white/5 rounded-2xl space-y-3 relative overflow-hidden hover:border-slate-700 transition-all">
                            <div className="flex justify-between items-center">
                              <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full font-bold border border-indigo-500/20 uppercase tracking-wider">
                                {news.category}
                              </span>
                              <span className="text-[10px] text-slate-500">{news.time} • {news.source}</span>
                            </div>
                            <h3 className="text-sm font-bold text-white leading-snug">{news.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed">{news.summary}</p>
                            
                            {news.symbolRelated && (
                              <button
                                onClick={() => {
                                  setSelectedSymbol(news.symbolRelated!);
                                  setActiveScreen("DETAIL");
                                }}
                                className="text-[10px] text-emerald-400 font-mono font-bold hover:underline"
                              >
                                View {news.symbolRelated} Equity →
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeScreen === "SETTINGS" && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-white tracking-tight">{t("settings")}</h2>
                      
                      <div className="max-w-xl bg-slate-900/60 border border-white/5 p-6 rounded-2xl space-y-6 backdrop-blur-md">
                        {/* Language Selection */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white">{t("language")}</span>
                            <p className="text-[11px] text-slate-400">Select preferred bilingual translation interface</p>
                          </div>
                          <select
                            value={settings.language}
                            onChange={(e) => setSettings((prev) => ({ ...prev, language: e.target.value as any }))}
                            className="bg-slate-950 border border-slate-700/50 rounded-xl py-1.5 px-3 text-xs text-white"
                          >
                            <option value="en">English (US)</option>
                            <option value="ur">Urdu (اردو)</option>
                          </select>
                        </div>

                        {/* Preferred Currency */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white">{t("currency")}</span>
                            <p className="text-[11px] text-slate-400">Preferred ticker currency evaluation overlay</p>
                          </div>
                          <select
                            value={settings.currency}
                            onChange={(e) => setSettings((prev) => ({ ...prev, currency: e.target.value as any }))}
                            className="bg-slate-950 border border-slate-700/50 rounded-xl py-1.5 px-3 text-xs text-white font-mono"
                          >
                            <option value="PKR">PKR (Rs.)</option>
                            <option value="USD">USD ($)</option>
                          </select>
                        </div>

                        {/* Push Notifications Toggle */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white">{t("alerts_notifications")}</span>
                            <p className="text-[11px] text-slate-400">Enable in-app alert banner triggers</p>
                          </div>
                          <button
                            onClick={() => setSettings((prev) => ({ ...prev, notifications: !prev.notifications }))}
                            className={`w-10 h-6 rounded-full p-1 transition-all ${settings.notifications ? "bg-indigo-600 flex justify-end" : "bg-slate-800 flex justify-start"}`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white" />
                          </button>
                        </div>

                        {/* Mock Biometrics Enable */}
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-white">{t("biometrics")}</span>
                            <p className="text-[11px] text-slate-400">Simulate Android biometrics login credentials</p>
                          </div>
                          <button
                            onClick={() => {
                              setSettings((prev) => ({ ...prev, biometrics: !prev.biometrics }));
                              setActiveNotification({
                                title: "🔒 Biometrics Security Configured",
                                message: "Simulated fingerprint unlock state updated successfully."
                              });
                            }}
                            className={`w-10 h-6 rounded-full p-1 transition-all ${settings.biometrics ? "bg-indigo-600 flex justify-end" : "bg-slate-800 flex justify-start"}`}
                          >
                            <div className="w-4 h-4 rounded-full bg-white" />
                          </button>
                        </div>

                        {/* Reset DB Button */}
                        <div className="border-t border-white/5 pt-6 flex justify-between items-center">
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-rose-400">{t("reset_data")}</span>
                            <p className="text-[11px] text-slate-400">Rebuild indices and clear transaction ledger</p>
                          </div>
                          <button
                            onClick={handleResetData}
                            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl text-xs font-bold transition-all cursor-pointer"
                          >
                            Reset Data
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeScreen === "FLUTTER_SDK" && (
                    <FlutterSDK lang={lang} />
                  )}

                </div>
              </div>
            )}

          </div>

          {/* SECP Mandatory Advisory Sticky Warning Footer */}
          <footer className="px-6 py-4 bg-slate-950 border-t border-white/5 text-[10px] text-slate-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <span>
              © 2026 PSX Vision Pro • SECP License Code Mock-7624. Powered by Gemini 3.5 AI APIs.
            </span>
            <span className="max-w-xl md:text-right leading-relaxed">
              <strong>Risk Disclosure:</strong> Securities trading on the Pakistan Stock Exchange is subject to significant market fluctuations. Always evaluate complete analytical indicators prior to allocating capital.
            </span>
          </footer>
        </div>
      )}

    </div>
  );
}
