export interface Prefecture {
  id: string;
  name: string;
  region: JapanRegion;
}

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
  { id: 'Hokkaido', name: '北海道', region: 'hokkaido' },

  // 東北地方
  { id: 'Aomori', name: '青森県', region: 'tohoku' },
  { id: 'Iwate', name: '岩手県', region: 'tohoku' },
  { id: 'Miyagi', name: '宮城県', region: 'tohoku' },
  { id: 'Akita', name: '秋田県', region: 'tohoku' },
  { id: 'Yamagata', name: '山形県', region: 'tohoku' },
  { id: 'Fukushima', name: '福島県', region: 'tohoku' },

  // 関東地方
  { id: 'Ibaraki', name: '茨城県', region: 'kanto' },
  { id: 'Tochigi', name: '栃木県', region: 'kanto' },
  { id: 'Gunma', name: '群馬県', region: 'kanto' },
  { id: 'Saitama', name: '埼玉県', region: 'kanto' },
  { id: 'Chiba', name: '千葉県', region: 'kanto' },
  { id: 'Tokyo', name: '東京都', region: 'kanto' },
  { id: 'Kanagawa', name: '神奈川県', region: 'kanto' },

  // 中部地方
  { id: 'Niigata', name: '新潟県', region: 'chubu' },
  { id: 'Toyama', name: '富山県', region: 'chubu' },
  { id: 'Ishikawa', name: '石川県', region: 'chubu' },
  { id: 'Fukui', name: '福井県', region: 'chubu' },
  { id: 'Yamanashi', name: '山梨県', region: 'chubu' },
  { id: 'Nagano', name: '長野県', region: 'chubu' },
  { id: 'Gifu', name: '岐阜県', region: 'chubu' },
  { id: 'Shizuoka', name: '静岡県', region: 'chubu' },
  { id: 'Aichi', name: '愛知県', region: 'chubu' },

  // 近畿地方
  { id: 'Mie', name: '三重県', region: 'kinki' },
  { id: 'Shiga', name: '滋賀県', region: 'kinki' },
  { id: 'Kyoto', name: '京都府', region: 'kinki' },
  { id: 'Osaka', name: '大阪府', region: 'kinki' },
  { id: 'Hyogo', name: '兵庫県', region: 'kinki' },
  { id: 'Nara', name: '奈良県', region: 'kinki' },
  { id: 'Wakayama', name: '和歌山県', region: 'kinki' },

  // 中国地方
  { id: 'Tottori', name: '鳥取県', region: 'chugoku' },
  { id: 'Shimane', name: '島根県', region: 'chugoku' },
  { id: 'Okayama', name: '岡山県', region: 'chugoku' },
  { id: 'Hiroshima', name: '広島県', region: 'chugoku' },
  { id: 'Yamaguchi', name: '山口県', region: 'chugoku' },

  // 四国地方
  { id: 'Tokushima', name: '徳島県', region: 'shikoku' },
  { id: 'Kagawa', name: '香川県', region: 'shikoku' },
  { id: 'Ehime', name: '愛媛県', region: 'shikoku' },
  { id: 'Kochi', name: '高知県', region: 'shikoku' },

  // 九州地方
  { id: 'Fukuoka', name: '福岡県', region: 'kyushu' },
  { id: 'Saga', name: '佐賀県', region: 'kyushu' },
  { id: 'Nagasaki', name: '長崎県', region: 'kyushu' },
  { id: 'Kumamoto', name: '熊本県', region: 'kyushu' },
  { id: 'Oita', name: '大分県', region: 'kyushu' },
  { id: 'Miyazaki', name: '宮崎県', region: 'kyushu' },
  { id: 'Kagoshima', name: '鹿児島県', region: 'kyushu' },

  // 沖縄地方
  { id: 'Okinawa', name: '沖縄県', region: 'okinawa' },
];

// 地方ごとの都道府県を取得するヘルパー関数
export const getPrefecturesByRegion = (region: JapanRegion): Prefecture[] => {
  return prefecturesList.filter((prefecture) => prefecture.region === region);
};
