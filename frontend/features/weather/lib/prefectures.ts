export type Prefecture = {
  id: string;
  name: string;
  region: JapanRegion;
};

export type JapanRegion =
  | 'hokkaido' // 北海道
  | 'tohoku' // 東北
  | 'kanto' // 関東
  | 'chubu' // 中部
  | 'kinki' // 近畿
  | 'chugoku' // 中国
  | 'shikoku' // 四国
  | 'kyushu' // 九州
  | 'okinawa'; // 沖縄

export const prefecturesList: Prefecture[] = [
  { id: 'hokkaido', name: '北海道', region: 'hokkaido' },

  // 東北地方
  { id: 'aomori', name: '青森県', region: 'tohoku' },
  { id: 'iwate', name: '岩手県', region: 'tohoku' },
  { id: 'miyagi', name: '宮城県', region: 'tohoku' },
  { id: 'akita', name: '秋田県', region: 'tohoku' },
  { id: 'yamagata', name: '山形県', region: 'tohoku' },
  { id: 'fukushima', name: '福島県', region: 'tohoku' },

  // 関東地方
  { id: 'ibaraki', name: '茨城県', region: 'kanto' },
  { id: 'tochigi', name: '栃木県', region: 'kanto' },
  { id: 'gunma', name: '群馬県', region: 'kanto' },
  { id: 'saitama', name: '埼玉県', region: 'kanto' },
  { id: 'chiba', name: '千葉県', region: 'kanto' },
  { id: 'tokyo', name: '東京都', region: 'kanto' },
  { id: 'kanagawa', name: '神奈川県', region: 'kanto' },

  // 中部地方
  { id: 'niigata', name: '新潟県', region: 'chubu' },
  { id: 'toyama', name: '富山県', region: 'chubu' },
  { id: 'ishikawa', name: '石川県', region: 'chubu' },
  { id: 'fukui', name: '福井県', region: 'chubu' },
  { id: 'yamanashi', name: '山梨県', region: 'chubu' },
  { id: 'nagano', name: '長野県', region: 'chubu' },
  { id: 'gifu', name: '岐阜県', region: 'chubu' },
  { id: 'shizuoka', name: '静岡県', region: 'chubu' },
  { id: 'aichi', name: '愛知県', region: 'chubu' },

  // 近畿地方
  { id: 'mie', name: '三重県', region: 'kinki' },
  { id: 'shiga', name: '滋賀県', region: 'kinki' },
  { id: 'kyoto', name: '京都府', region: 'kinki' },
  { id: 'osaka', name: '大阪府', region: 'kinki' },
  { id: 'hyogo', name: '兵庫県', region: 'kinki' },
  { id: 'nara', name: '奈良県', region: 'kinki' },
  { id: 'wakayama', name: '和歌山県', region: 'kinki' },

  // 中国地方
  { id: 'tottori', name: '鳥取県', region: 'chugoku' },
  { id: 'shimane', name: '島根県', region: 'chugoku' },
  { id: 'okayama', name: '岡山県', region: 'chugoku' },
  { id: 'hiroshima', name: '広島県', region: 'chugoku' },
  { id: 'yamaguchi', name: '山口県', region: 'chugoku' },

  // 四国地方
  { id: 'tokushima', name: '徳島県', region: 'shikoku' },
  { id: 'kagawa', name: '香川県', region: 'shikoku' },
  { id: 'ehime', name: '愛媛県', region: 'shikoku' },
  { id: 'kochi', name: '高知県', region: 'shikoku' },

  // 九州地方
  { id: 'fukuoka', name: '福岡県', region: 'kyushu' },
  { id: 'saga', name: '佐賀県', region: 'kyushu' },
  { id: 'nagasaki', name: '長崎県', region: 'kyushu' },
  { id: 'kumamoto', name: '熊本県', region: 'kyushu' },
  { id: 'oita', name: '大分県', region: 'kyushu' },
  { id: 'miyazaki', name: '宮崎県', region: 'kyushu' },
  { id: 'kagoshima', name: '鹿児島県', region: 'kyushu' },

  // 沖縄地方
  { id: 'okinawa', name: '沖縄県', region: 'okinawa' },
];

// 地方ごとの都道府県を取得するヘルパー関数
export const getPrefecturesByRegion = (region: JapanRegion): Prefecture[] => {
  return prefecturesList.filter((prefecture) => prefecture.region === region);
};
