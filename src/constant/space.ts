/*
 * 空间状态
 */
export const SPACE_LEVEL_ENUM = {
  COMMON : 0,
  PROFESSIONAL: 1,
  FLAGSHIP: 2
}

export const SPACE_LEVEL_MAP : Record<number, string> = {
  0: '普通版',
  1: '专业版',
  2: '旗舰版'
}

export const SPACE_LEVEL_OPTIONS = Object.keys(SPACE_LEVEL_MAP).map((key) => {
  const value : number = Number(key);
  return {
    label: SPACE_LEVEL_MAP[value],
    value
  };
});
