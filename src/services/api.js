// API 服務層
// 用於與後端 API 進行通訊

// API 基礎 URL（可以從環境變數讀取）
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// 通用請求函數
async function request(endpoint, options = {}) {
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

// ==================== 模擬數據（後備方案）====================

import {
  mockUser,
  mockNotices,
  mockBanners,
  mockCategories,
  mockGames,
} from "../mockData.js";

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
