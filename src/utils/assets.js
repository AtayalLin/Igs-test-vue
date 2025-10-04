/**
 * 資源路徑工具函數
 * 用於處理圖片等靜態資源的路徑，確保在開發和生產環境都能正確載入
 */

/**
 * 獲取圖片資源的完整路徑
 * @param {string} path - 相對於 public 目錄的路徑，例如 'assets/images/games/slots/game1.webp'
 * @returns {string} 完整的圖片路徑
 */
export function getImageUrl(path) {
  // 移除開頭的斜線（如果有）
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // 在生產環境使用 base URL，開發環境直接使用路徑
  return import.meta.env.BASE_URL + cleanPath;
}

/**
 * 獲取背景圖片的 CSS url() 格式
 * @param {string} path - 相對於 public 目錄的路徑
 * @returns {string} CSS url() 格式的路徑
 */
export function getBackgroundImageUrl(path) {
  return `url("${getImageUrl(path)}")`;
}

/**
 * 預定義的圖片路徑常量
 */
export const IMAGE_PATHS = {
  // 背景圖片
  backgrounds: {
    main: 'assets/images/backgrounds/main-bg.webp',
    header: 'assets/images/backgrounds/header-bg.webp',
    footer: 'assets/images/backgrounds/footer-bg.webp',
    card: 'assets/images/backgrounds/card-bg.webp',
  },
  
  // UI 圖標
  icons: {
    vipCrown: 'assets/images/ui/icons/vip-crown.webp',
    goldCoin: 'assets/images/ui/icons/gold-coin.webp',
    playButton: 'assets/images/ui/icons/play-button.webp',
    searchIcon: 'assets/images/ui/icons/search-icon.webp',
  },
  
  // 徽章圖片
  badges: {
    hot: 'assets/images/ui/badges/hot-badge.webp',
    new: 'assets/images/ui/badges/new-badge.webp',
    event: 'assets/images/ui/badges/event-badge.webp',
    bonus: 'assets/images/ui/badges/bonus-badge.webp',
    multiplier: 'assets/images/ui/badges/multiplier-badge.webp',
  },
  
  // Banner 圖片
  banners: {
    banner1: 'assets/images/banners/banner-1.webp',
    banner2: 'assets/images/banners/banner-2.webp',
    banner3: 'assets/images/banners/banner-3.webp',
    banner4: 'assets/images/banners/banner-4.webp',
  },
};

