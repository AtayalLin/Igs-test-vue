// API 服務層
// 用於與後端 API 進行通訊

// API 基礎 URL（可以從環境變數讀取）
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";
const USE_MOCK_API = String(import.meta.env.VITE_USE_MOCK_API || "true") === "true";

// 通用請求函數
async function request(endpoint, options = {}) {
  // 內建 Mock API 路由（可由環境變數切換）
  if (USE_MOCK_API) {
    return handleMockRequest(endpoint, options);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      // 可以在這裡添加認證 token
      // 'Authorization': `Bearer ${getToken()}`
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("API 請求失敗:", error);
    throw error;
  }
}

// GET 請求
async function get(endpoint) {
  return request(endpoint, { method: "GET" });
}

// POST 請求
async function post(endpoint, data) {
  return request(endpoint, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT 請求
async function put(endpoint, data) {
  return request(endpoint, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE 請求
async function del(endpoint) {
  return request(endpoint, { method: "DELETE" });
}

// ==================== API 接口 ====================

/**
 * 獲取大廳初始數據
 * GET /api/v1/lobby
 */
export async function getLobbyData() {
  try {
    return await get("/lobby");
  } catch (error) {
    console.error("獲取大廳數據失敗:", error);
    // 返回模擬數據作為後備
    return getMockLobbyData();
  }
}

/**
 * 根據分類獲取遊戲列表
 * GET /api/v1/games?category={id}
 */
export async function getGamesByCategory(categoryId) {
  try {
    return await get(`/games?category=${categoryId}`);
  } catch (error) {
    console.error("獲取遊戲列表失敗:", error);
    // 返回模擬數據作為後備
    return getMockGamesByCategory(categoryId);
  }
}

/**
 * 啟動遊戲
 * POST /api/v1/games/{gameId}/launch
 * @param {number} gameId - 遊戲 ID
 * @returns {Promise<{gameUrl: string, token: string}>}
 */
export async function launchGame(gameId) {
  try {
    const response = await post(`/games/${gameId}/launch`, { gameId });
    return response;
  } catch (error) {
    console.error("啟動遊戲失敗:", error);
    // 返回模擬數據作為後備
    return getMockGameLaunchData(gameId);
  }
}

/**
 * 更新收藏狀態
 * PUT /api/v1/games/{gameId}/favorite
 */
export async function updateFavoriteStatus(gameId, isFavorite) {
  try {
    return await put(`/games/${gameId}/favorite`, { isFavorite });
  } catch (error) {
    console.error("更新收藏狀態失敗:", error);
    return { success: true, isFavorite };
  }
}

/**
 * 獲取用戶餘額
 * GET /api/v1/user/balance
 */
export async function getUserBalance() {
  try {
    return await get("/user/balance");
  } catch (error) {
    console.error("獲取用戶餘額失敗:", error);
    // 返回模擬數據，帶有隨機變化
    return getMockUserBalance();
  }
}

// 模擬餘額數據（帶有隨機變化）
function getMockUserBalance() {
  // 基礎餘額
  const baseBalance = 996.0;
  // 隨機變化 (-50 到 +50)
  const change = (Math.random() - 0.5) * 100;
  const newBalance = Math.max(0, baseBalance + change);

  return {
    balance: parseFloat(newBalance.toFixed(2)),
    lastUpdate: new Date().toISOString(),
  };
}

/**
 * 搜尋遊戲
 * GET /api/v1/games/search?keyword={keyword}
 */
export async function searchGames(keyword) {
  try {
    return await get(`/games/search?keyword=${encodeURIComponent(keyword)}`);
  } catch (error) {
    console.error("搜尋遊戲失敗:", error);
    return { games: [] };
  }
}

// 分頁相關 API（錢包 / 商城 / 會員）
export async function getWalletInfo() {
  return USE_MOCK_API ? handleMockRequest('/wallet', { method: 'GET' }) : get('/wallet');
}

export async function getWalletTransactions() {
  return USE_MOCK_API ? handleMockRequest('/wallet/transactions', { method: 'GET' }) : get('/wallet/transactions');
}

export async function getShopProducts() {
  return USE_MOCK_API ? handleMockRequest('/shop/products', { method: 'GET' }) : get('/shop/products');
}

export async function getVipInfo() {
  return USE_MOCK_API ? handleMockRequest('/vip/info', { method: 'GET' }) : get('/vip/info');
}

// ==================== 模擬數據（後備方案）====================

import {
  mockUser,
  mockNotices,
  mockBanners,
  mockCategories,
  mockGames,
} from "../mockData.js";

// ---------- 內建 Mock API 實作 ----------
const FAVORITES_STORAGE_KEY = "game_hall_favorites";

function mockDelay(min = 200, max = 600) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise((r) => setTimeout(r, ms));
}

function loadFavoritesMap() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function saveFavoritesMap(map) {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(map));
  } catch {}
}

function syncMockFavoritesFromStorage() {
  const fav = loadFavoritesMap();
  Object.keys(mockGames).forEach((k) => {
    const list = mockGames[k];
    if (Array.isArray(list)) {
      list.forEach((g) => {
        if (typeof fav[g.id] === "boolean") g.isFavorite = fav[g.id];
      });
    }
  });
  mockGames.favorite = (mockGames.all || []).filter((g) => g.isFavorite);
}

function buildLobbyPayload() {
  syncMockFavoritesFromStorage();
  return {
    user: mockUser,
    notices: mockNotices,
    banners: mockBanners,
    categories: mockCategories,
    games: {
      featured: mockGames.slot.slice(0, 3),
      list: mockGames.slot,
    },
    unreadMessages: 99,
  };
}

function buildGamesByCategory(categoryId) {
  syncMockFavoritesFromStorage();
  return { games: mockGames[categoryId] || mockGames.all };
}

function buildSearchGames(keyword) {
  syncMockFavoritesFromStorage();
  const kw = String(keyword || "").toLowerCase();
  const list = (mockGames.all || []).filter(
    (g) =>
      g.name.toLowerCase().includes(kw) ||
      (g.description && g.description.toLowerCase().includes(kw)) ||
      (Array.isArray(g.tags) && g.tags.some((t) => String(t).toLowerCase().includes(kw)))
  );
  return { games: list };
}

function buildLaunch(gameId) {
  return {
    success: true,
    gameUrl: `https://game-server.example.com/game/${gameId}`,
    token: `mock_token_${gameId}_${Date.now()}`,
    gameId,
    expiresIn: 3600,
  };
}

async function handleMockRequest(endpoint, options = {}) {
  // 模擬延遲
  await mockDelay();

  const method = (options.method || "GET").toUpperCase();
  // 解析查詢字串
  const [path, queryStr] = endpoint.split("?");
  const searchParams = new URLSearchParams(queryStr || "");

  // 路由
  if (method === "GET" && path === "/lobby") {
    return buildLobbyPayload();
  }

  if (method === "GET" && path === "/games") {
    const category = searchParams.get("category") || "slot";
    return buildGamesByCategory(category);
  }

  if (method === "GET" && path === "/games/search") {
    const keyword = searchParams.get("keyword") || "";
    return buildSearchGames(keyword);
  }

  if (method === "GET" && path === "/user/balance") {
    return getMockUserBalance();
  }

  // Wallet
  if (method === 'GET' && path === '/wallet') {
    return {
      balance: getMockUserBalance().balance,
      currency: 'TWD',
      lastUpdate: new Date().toISOString(),
    };
  }
  if (method === 'GET' && path === '/wallet/transactions') {
    // 假交易紀錄
    const now = Date.now();
    return {
      items: Array.from({ length: 8 }).map((_, i) => ({
        id: `tx_${now - i * 86400000}`,
        type: i % 3 === 0 ? 'deposit' : i % 3 === 1 ? 'withdraw' : 'reward',
        amount: parseFloat(((Math.random() * 500 + 50) * (Math.random() > 0.5 ? 1 : -1)).toFixed(2)),
        time: new Date(now - i * 86400000).toISOString(),
        note: i % 3 === 0 ? '儲值' : i % 3 === 1 ? '提領' : '每日獎勵',
      })),
    };
  }

  // Shop
  if (method === 'GET' && path === '/shop/products') {
    return {
      products: [
        { id: 'pkg_1', name: '新手禮包', price: 99, desc: '入門好禮', tag: 'HOT' },
        { id: 'pkg_2', name: '進階禮包', price: 299, desc: '提升實力', tag: 'NEW' },
        { id: 'vip_month', name: 'VIP 月卡', price: 199, desc: '尊榮特權', tag: 'VIP' },
        { id: 'double_bonus', name: '雙倍加碼', price: 149, desc: '限時活動', tag: 'EVENT' },
      ],
    };
  }

  // VIP
  if (method === 'GET' && path === '/vip/info') {
    return {
      level: mockUser.vipLevel || 1,
      progress: Math.floor(Math.random() * 80) + 10, // 10~90%
      benefits: [
        '每日簽到雙倍獎勵',
        '專屬客服',
        '每週特別禮包',
      ],
    };
  }

  // /games/{id}/launch
  const launchMatch = path.match(/^\/games\/(\d+)\/launch$/);
  if (method === "POST" && launchMatch) {
    const gameId = Number(launchMatch[1]);
    return buildLaunch(gameId);
  }

  // /games/{id}/favorite
  const favMatch = path.match(/^\/games\/(\d+)\/favorite$/);
  if (method === "PUT" && favMatch) {
    const gameId = Number(favMatch[1]);
    let isFavorite = undefined;
    try {
      if (options.body) {
        const body = JSON.parse(options.body);
        isFavorite = !!body.isFavorite;
      }
    } catch {}

    const favMap = loadFavoritesMap();
    favMap[gameId] = !!isFavorite;
    saveFavoritesMap(favMap);
    syncMockFavoritesFromStorage();
    return { success: true, isFavorite: !!isFavorite };
  }

  // 預設：模擬 404
  throw new Error(`Mock API: Endpoint not found: ${method} ${endpoint}`);
}

function getMockLobbyData() {
  return {
    user: mockUser,
    notices: mockNotices,
    banners: mockBanners,
    categories: mockCategories,
    games: {
      featured: mockGames.slot.slice(0, 3),
      list: mockGames.slot,
    },
    unreadMessages: 99,
  };
}

function getMockGamesByCategory(categoryId) {
  return {
    games: mockGames[categoryId] || mockGames.all,
  };
}

function getMockGameLaunchData(gameId) {
  // 模擬遊戲啟動數據
  return {
    success: true,
    gameUrl: `https://game-server.example.com/game/${gameId}`,
    token: `mock_token_${gameId}_${Date.now()}`,
    gameId: gameId,
    expiresIn: 3600, // 1小時
  };
}

// ==================== WebSocket 連接（未來實現）====================

/**
 * 建立 WebSocket 連接
 * 用於即時更新餘額、通知等
 */
export function connectWebSocket() {
  // TODO: 實現 WebSocket 連接
  console.log("WebSocket 連接功能待實現");

  // const ws = new WebSocket('ws://localhost:3000/ws')
  //
  // ws.onopen = () => {
  //   console.log('WebSocket 已連接')
  // }
  //
  // ws.onmessage = (event) => {
  //   const data = JSON.parse(event.data)
  //   // 處理接收到的數據
  // }
  //
  // ws.onerror = (error) => {
  //   console.error('WebSocket 錯誤:', error)
  // }
  //
  // ws.onclose = () => {
  //   console.log('WebSocket 已斷開')
  // }
  //
  // return ws
}
