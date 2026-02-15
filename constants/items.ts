// constants/items.ts
export interface BiboItem {
  key: string;
  nameKo: string;
  purpose: string;
  purposeKo: string;
  emoji: string;
  description: string;
  detailTip: string;
}

export const BIBO_ITEMS: Record<string, BiboItem> = {
  sunflower: {
    key: "sunflower",
    nameKo: "황금 해바라기 액자",
    purpose: "Wealth",
    purposeKo: "재물운 상승",
    emoji: "🌻",
    description: "황금빛 해바라기는 재물의 기운을 끌어당기는 대표 풍수 아이템입니다.",
    detailTip: "남쪽이나 동남쪽 벽에 걸면 재물운 상승 효과가 극대화됩니다.",
  },
  plant: {
    key: "plant",
    nameKo: "공기정화 식물 (금전수)",
    purpose: "Vitality",
    purposeKo: "생기 보충",
    emoji: "🪴",
    description: "살아있는 식물은 정체된 기운을 순환시키고 생기를 불어넣습니다.",
    detailTip: "방의 동쪽에 배치하면 건강운과 활력이 크게 향상됩니다.",
  },
  light: {
    key: "light",
    nameKo: "코너 스탠드 조명",
    purpose: "Yang Energy",
    purposeKo: "양기 보충",
    emoji: "💡",
    description: "어두운 구석은 음기가 정체됩니다. 빛으로 양기를 채워야 합니다.",
    detailTip: "방의 가장 어두운 코너에 놓으면 음양 균형이 맞춰집니다.",
  },
  curtain: {
    key: "curtain",
    nameKo: "현관/방문 가림막 커튼",
    purpose: "Blocking Bad Energy",
    purposeKo: "살기 차단",
    emoji: "🪟",
    description: "문을 통해 들어오는 직선 기운(살기)을 부드럽게 분산시킵니다.",
    detailTip: "현관에서 거실이 바로 보이는 구조라면 가림막이 필수입니다.",
  },
  chime: {
    key: "chime",
    nameKo: "현관 풍경종",
    purpose: "Sound Purification",
    purposeKo: "맑은 기운",
    emoji: "🔔",
    description: "맑은 소리는 탁한 기운을 깨뜨리고 공간을 정화합니다.",
    detailTip: "현관문 안쪽 상단에 달면 출입 시마다 공간이 정화됩니다.",
  },
  poster: {
    key: "poster",
    nameKo: "감성 패브릭 포스터",
    purpose: "Covering/Softening",
    purposeKo: "비보 (가림)",
    emoji: "🖼️",
    description: "거울, 빈 벽, 흉한 것을 가려 기운의 흐름을 안정시킵니다.",
    detailTip: "침대에서 보이는 거울이나 빈 벽을 가리는 것이 가장 효과적입니다.",
  },
  diffuser: {
    key: "diffuser",
    nameKo: "천연 아로마 디퓨저",
    purpose: "Scent Purification",
    purposeKo: "공간 정화",
    emoji: "🕯️",
    description: "천연 향은 공간의 탁한 기운을 정화하고 안정감을 줍니다.",
    detailTip: "라벤더, 유칼립투스 계열 향이 풍수적으로 가장 효과적입니다.",
  },
  bedding: {
    key: "bedding",
    nameKo: "호텔식 화이트 침구",
    purpose: "Health/Sleep",
    purposeKo: "건강운 강화",
    emoji: "🛏️",
    description: "깨끗한 침구는 수면의 질을 높이고 건강운을 회복시킵니다.",
    detailTip: "흰색 또는 연한 베이지톤 침구가 양기를 보충하는 데 최고입니다.",
  },
  air_purifier: {
    key: "air_purifier",
    nameKo: "공기청정기",
    purpose: "Air Purification",
    purposeKo: "탁기 제거",
    emoji: "🌬️",
    description: "탁한 공기는 기의 흐름을 방해합니다. 과학적으로 공기를 정화하세요.",
    detailTip: "침실과 거실 사이에 놓으면 기의 흐름이 원활해집니다.",
  },
  mood_light: {
    key: "mood_light",
    nameKo: "LED 무드등",
    purpose: "Sleep/Relaxation",
    purposeKo: "수면 안정",
    emoji: "🌙",
    description: "은은한 조명은 수면 환경을 개선하고 불안한 기운을 진정시킵니다.",
    detailTip: "침대 옆 협탁에 놓되, 노란빛(웜톤)이 수면운에 가장 좋습니다.",
  },
};

export const VALID_KEYS = Object.keys(BIBO_ITEMS);
