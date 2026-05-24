// config.js - 여기만 수정하면 모든 계산기에 즉시 적용됩니다.

const USER_STATS = {
  baseAtk: 1074,
  critRate: 0.22,
  critDmg: 1.73
};

// 치명피해 수치를 %로 변환하는 공식
function getCritDmgRate(value) {
    return 154.97 + (0.0137 * value);
}

// 스탯 점수 계산 공식
function getStatWeight(key, value, isPercent) {
    const wi = STAT_KEY_MAP[key];
    const weight = getW(wi);
    const val = (isPercent ? value * 0.1 : value);
    
    // 치명타 관련 % 옵션은 보너스 가중치 적용
    if (isPercent && key.includes('critical')) {
        return val * (weight / 10) * 2.0; 
    }
    return val * (weight / 10);
}
