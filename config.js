// config.js - 데미지 계산 및 스탯 최적화 설정

// 1. 유저 캐릭터 기본 스탯 (본인의 F2 정보로 수정 가능)
const USER_STATS = {
  baseAtk: 1074,
  critRate: 0.22,
  critDmg: 1.73
};

// 2. 실제 데이터 기반 데미지 효율 상수
const STAT_EFFICIENCY = {
    CRIT_DMG_SLOPE: 0.0137, // 치명피해 수치 1당 데미지 상승 효율
    CRIT_RATE_FACTOR: 0.01, // 치명확률 가중치 보정값
};

// 3. 치명피해 수치를 %로 변환하는 공식
function getCritDmgRate(value) {
    return 154.97 + (0.0137 * value);
}

// 4. 스탯 가중치 및 효율 점수 계산 함수
function getStatWeight(key, value, isPercent) {
    const wi = STAT_KEY_MAP[key];
    const weight = getW(wi); // 0, 10, 100, 1000 (무시~핵심)
    const val = (isPercent ? value * 0.1 : value);
    
    // 기본 점수 계산
    let score = val * (weight / 10);
    
    // 핵심(1000)으로 설정된 스탯의 경우 데이터 기반 가중치 부여
    if (weight >= 1000) {
        if (key.includes('critical-damage')) {
            // 치명피해는 도출된 효율 상수를 곱하여 스케일링
            return score * (STAT_EFFICIENCY.CRIT_DMG_SLOPE * 1000); 
        }
        if (key.includes('critical-base')) {
            return score * (STAT_EFFICIENCY.CRIT_RATE_FACTOR * 1000);
        }
    }
    
    return score;
}

// 5. 안전한 데이터 저장 함수
function saveSelection() {
  if (selected.size === 0) {
    alert('❌ 저장할 인연이 없습니다. 인연을 먼저 선택해주세요.');
    return;
  }
  if (confirm(`${selected.size}개의 인연을 저장하시겠습니까?\n(기존 저장 데이터는 덮어씌워집니다.)`)) {
    try {
      localStorage.setItem('bns_selected', JSON.stringify([...selected]));
      alert(`✅ ${selected.size}개의 인연이 성공적으로 저장되었습니다!`);
    } catch(e) {
      alert('저장 실패: ' + e.message);
    }
  }
}

// 6. 안전한 데이터 불러오기 함수
function loadSelection() {
  const data = localStorage.getItem('bns_selected');
  if (!data) {
    alert('❌ 저장된 데이터가 없습니다.');
    return;
  }
  if (confirm('저장된 인연 데이터를 불러오시겠습니까?\n(현재 선택된 인연은 모두 초기화됩니다.)')) {
    try {
      const keys = JSON.parse(data);
      selected.clear();
      keys.forEach(k => selected.add(k));
      renderList();
      alert(`✅ ${selected.size}개의 인연을 성공적으로 불러왔습니다!`);
    } catch(e) {
      alert('불러오기 실패: ' + e.message);
    }
  }
}
