// constants/items.ts
export interface BiboItem {
  key: string;
  nameKo: string;
  searchQuery: string;
  purpose: string;
  purposeKo: string;
  emoji: string;
  description: string;
}

export const BIBO_ITEMS: Record<string, BiboItem> = {
  sunflower: {
    key: "sunflower",
    nameKo: "황금 해바라기 액자",
    searchQuery: "해바라기액자",
    purpose: "Wealth",
    purposeKo: "재물운 상승",
    emoji: "🌻",
    description: "황금빛 해바라기는 재물의 기운을 끌어당기는 대표 풍수 아이템입니다.",
  },
  plant: {
    key: "plant",
    nameKo: "공기정화 식물 (금전수)",
    searchQuery: "금전수",
    purpose: "Vitality",
    purposeKo: "생기 보충",
    emoji: "🪴",
    description: "살아있는 식물은 정체된 기운을 순환시키고 생기를 불어넣습니다.",
  },
  light: {
    key: "light",
    nameKo: "코너 스탠드 조명",
    searchQuery: "장스탠드",
    purpose: "Yang Energy",
    purposeKo: "양기 보충",
    emoji: "💡",
    description: "어두운 구석은 음기가 정체됩니다. 빛으로 양기를 채워야 합니다.",
  },
  curtain: {
    key: "curtain",
    nameKo: "현관/방문 가림막 커튼",
    searchQuery: "가림막커튼",
    purpose: "Blocking Bad Energy",
    purposeKo: "살기 차단",
    emoji: "🪟",
    description: "문을 통해 들어오는 직선 기운(살기)을 부드럽게 분산시킵니다.",
  },
  chime: {
    key: "chime",
    nameKo: "현관 풍경종",
    searchQuery: "현관풍경",
    purpose: "Sound Purification",
    purposeKo: "맑은 기운",
    emoji: "🔔",
    description: "맑은 소리는 탁한 기운을 깨뜨리고 공간을 정화합니다.",
  },
  poster: {
    key: "poster",
    nameKo: "감성 패브릭 포스터",
    searchQuery: "패브릭포스터",
    purpose: "Covering/Softening",
    purposeKo: "비보 (가림)",
    emoji: "🖼️",
    description: "거울, 빈 벽, 흉한 것을 가려 기운의 흐름을 안정시킵니다.",
  },
  diffuser: {
    key: "diffuser",
    nameKo: "천연 아로마 디퓨저",
    searchQuery: "아로마디퓨저",
    purpose: "Scent Purification",
    purposeKo: "공간 정화",
    emoji: "🕯️",
    description: "천연 향은 공간의 탁한 기운을 정화하고 안정감을 줍니다.",
  },
  bedding: {
    key: "bedding",
    nameKo: "호텔식 화이트 침구",
    searchQuery: "호텔침구",
    purpose: "Health/Sleep",
    purposeKo: "건강운 강화",
    emoji: "🛏️",
    description: "깨끗한 침구는 수면의 질을 높이고 건강운을 회복시킵니다.",
  },
  air_purifier: {
    key: "air_purifier",
    nameKo: "공기청정기",
    searchQuery: "공기청정기",
    purpose: "Air Purification",
    purposeKo: "탁기 제거",
    emoji: "🌬️",
    description: "탁한 공기는 기의 흐름을 방해합니다. 과학적으로 공기를 정화하세요.",
  },
  mood_light: {
    key: "mood_light",
    nameKo: "LED 무드등",
    searchQuery: "무드등",
    purpose: "Sleep/Relaxation",
    purposeKo: "수면 안정",
    emoji: "🌙",
    description: "은은한 조명은 수면 환경을 개선하고 불안한 기운을 진정시킵니다.",
  },
};

export const VALID_KEYS = Object.keys(BIBO_ITEMS);
