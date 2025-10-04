// 模擬用戶數據
export const mockUser = {
  nickname: "TestPlayer",
  avatarUrl: "https://i.pravatar.cc/40?img=1",
  vipLevel: 1,
  balance: 996.0,
};

// 模擬公告數據
export const mockNotices = [
  {
    id: 1,
    content:
      "2025/9月商城例行性維護公告，請注意遊戲服務時間調整。感謝您的配合！",
  },
  {
    id: 2,
    content: "新遊戲「麻將開胡2」正式上線！首週加碼送好禮，快來體驗吧！",
  },
];

// 模擬橫幅廣告數據
export const mockBanners = [
  {
    id: 1,
    link: "/promotion/mahjong-special",
  },
  {
    id: 2,
    link: "/promotion/arcade-newbie",
  },
  {
    id: 3,
    link: "/promotion/vip-exclusive",
  },
  {
    id: 4,
    link: "/promotion/slot-festival",
  },
];

// 模擬遊戲分類數據
export const mockCategories = [
  { id: "all", name: "全部" },
  { id: "favorite", name: "最愛" },
  { id: "slot", name: "電動" },
  { id: "arcade", name: "街機" },
  { id: "chess", name: "棋牌" },
];

// 模擬遊戲數據 - 更豐富的遊戲列表
export const mockGames = {
  all: [
    {
      id: 101,
      name: "麻將開胡2",
      imageUrl: "/assets/images/games/slots/mahjong-hero-o.webp",
      tags: ["加強送", "x1000"],
      layout: "large",
      category: "chess",
      description: "經典麻將遊戲，全新玩法",
      isFavorite: false,
    },
    {
      id: 102,
      name: "街機大戰",
      imageUrl: "/assets/images/games/arcade/street-battle-o.webp",
      tags: ["NEW"],
      layout: "small",
      category: "arcade",
      description: "懷舊街機，童年回憶",
      isFavorite: false,
    },
    {
      id: 103,
      name: "電動王者",
      imageUrl: "/assets/images/games/slots/electric-king-o.webp",
      tags: ["活動", "x1000"],
      layout: "large",
      category: "slot",
      description: "超高倍率，刺激體驗",
      isFavorite: false,
    },
    {
      id: 104,
      name: "心跳撲克",
      imageUrl: "/assets/images/games/cards/poker-heart-o.webp",
      tags: [],
      layout: "small",
      category: "chess",
      description: "經典撲克遊戲",
      isFavorite: false,
    },
    {
      id: 105,
      name: "歡樂電動",
      imageUrl: "/assets/images/games/slots/happy-slots-o.webp",
      tags: ["HOT"],
      layout: "small",
      category: "slot",
      description: "輕鬆娛樂，簡單上手",
      isFavorite: false,
    },
    {
      id: 106,
      name: "拳皇格鬥",
      imageUrl: "/assets/images/games/arcade/king-fighters-o.webp",
      tags: ["NEW"],
      layout: "small",
      category: "arcade",
      description: "經典格鬥遊戲",
      isFavorite: false,
    },
    {
      id: 107,
      name: "幸運轉輪",
      imageUrl: "/assets/images/games/slots/lucky-wheel-o.webp",
      tags: ["加碼送"],
      layout: "large",
      category: "slot",
      description: "轉出好運氣",
      isFavorite: false,
    },
    {
      id: 108,
      name: "德州撲克",
      imageUrl: "/assets/images/games/cards/texas-poker-o.webp",
      tags: [],
      layout: "small",
      category: "chess",
      description: "策略與運氣的完美結合",
      isFavorite: false,
    },
  ],
  slot: [
    {
      id: 103,
      name: "電動王者",
      imageUrl: "/assets/images/games/slots/electric-king-o.webp",
      tags: ["活動", "x1000"],
      layout: "large",
      category: "slot",
      description: "超高倍率，刺激體驗",
      isFavorite: false,
    },
    {
      id: 105,
      name: "歡樂電動",
      imageUrl: "/assets/images/games/slots/happy-slots-o.webp",
      tags: ["HOT"],
      layout: "small",
      category: "slot",
      description: "輕鬆娛樂，簡單上手",
      isFavorite: false,
    },
    {
      id: 107,
      name: "幸運轉輪",
      imageUrl: "/assets/images/games/slots/lucky-wheel-o.webp",
      tags: ["加碼送"],
      layout: "large",
      category: "slot",
      description: "轉出好運氣",
      isFavorite: false,
    },
  ],
  arcade: [
    {
      id: 102,
      name: "街機大戰",
      imageUrl: "/assets/images/games/arcade/street-battle-o.webp",
      tags: ["NEW"],
      layout: "small",
      category: "arcade",
      description: "懷舊街機，童年回憶",
      isFavorite: false,
    },
    {
      id: 106,
      name: "拳皇格鬥",
      imageUrl: "/assets/images/games/arcade/king-fighters-o.webp",
      tags: ["NEW"],
      layout: "small",
      category: "arcade",
      description: "經典格鬥遊戲",
      isFavorite: false,
    },
  ],
  chess: [
    {
      id: 101,
      name: "麻將開胡2",
      imageUrl: "/assets/images/games/slots/mahjong-hero-o.webp",
      tags: ["加強送", "x1000"],
      layout: "large",
      category: "chess",
      description: "經典麻將遊戲，全新玩法",
      isFavorite: false,
    },
    {
      id: 104,
      name: "心跳撲克",
      imageUrl: "/assets/images/games/cards/poker-heart-o.webp",
      tags: [],
      layout: "small",
      category: "chess",
      description: "經典撲克遊戲",
      isFavorite: false,
    },
    {
      id: 108,
      name: "德州撲克",
      imageUrl: "/assets/images/games/cards/texas-poker-o.webp",
      tags: [],
      layout: "small",
      category: "chess",
      description: "策略與運氣的完美結合",
      isFavorite: false,
    },
  ],
  favorite: [],
};

// 模擬聊天未讀消息數
export const mockUnreadMessages = 99;

// 模擬 API 響應格式
export const mockLobbyData = {
  user: mockUser,
  notices: mockNotices,
  banners: mockBanners,
  categories: mockCategories,
  games: {
    featured: mockGames.all.filter(
      (game) => game.tags.includes("HOT") || game.tags.includes("NEW")
    ),
    list: mockGames.slot, // 預設顯示電動分類
  },
  unreadMessages: mockUnreadMessages,
};
