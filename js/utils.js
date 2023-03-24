//const CURRENCY = "❤️"
//const CURRENCY_POW = "💖"
const CURRENCY = "⭐"
const CURRENCY_POW = "🌟"


// Page Controllers
function pageControllerBasicProblemTemplate(){
  templateId = getTemplateId();
  results = templateMapping[templateId]["controller"]();
  document.getElementById("p1").innerHTML = results;
  reqTime = getTimeMs();
}

function pageControllerAdd(){
  updatePerformance();
  min_num = 1
  max_num = 50

  v1 = randRange(min_num, max_num)
  v2 = randRange(min_num, max_num)

  r = v1 + v2;
  return formatCalcString(v1, "+", v2)
}

function pageControllerSub(){
  updatePerformance();
  min_num = 1
  max_num = 50

  pv1 = randRange(min_num, max_num)
  pv2 = randRange(min_num, max_num)

  if (pv1 < pv2) {
      v1 = pv2
      v2 = pv1
  } else {
      v1 = pv1
      v2 = pv2
  }

  r = v1 - v2;
  return formatCalcString(v1, "-", v2)
}

function pageControllerMul(){
  updatePerformance();
  v1 = randRange(0, 10)
  v2 = randRange(1, 10)

  r = v1 * v2;
  return formatCalcString(v1, "x", v2)
}

function pageControllerDiv(){
  updatePerformance();
  r = randRange(0, 5)
  v2 = randRange(1, 10)

  t = r * v2;
  return formatCalcString(t, "/", v2)
}

function pageControllerRandom(){
  updatePerformance();

  let pool = [
    pageControllerAdd,
    pageControllerSub,
    pageControllerMul,
    pageControllerDiv
  ]
  selection = getRandomInt(pool.length)
  return pool[selection]()
}

function pageControllerShop(){
  updatePerformance();
  updateScoreBoosterText();
}

function pageControllerAdmin(){
    updatePerformance();
}

function updateScoreBoosterText(){
  level = getScoreBooster();
  next_level = level + 1
  price = getScoreBoosterPrice();
  text = `${CURRENCY_POW} Hjärtförstärkare (Nivå ${next_level}), pris: ${price} ${CURRENCY}`
  button = document.getElementById("buyScoreBoosterButton")
  button.innerHTML = text
  if(getScore() < price){
    button.disabled = true
  }
}

const templateMapping = {
  "0": {"controller": pageControllerRandom, "header": "Blandade uppgifter 🔀"},
  "1": {"controller": pageControllerAdd, "header": "Addition ➕"},
  "2": {"controller": pageControllerSub, "header": "Subtraktion ➖"},
  "3": {"controller": pageControllerMul, "header": "Multiplikation ✖️"},
  "4": {"controller": pageControllerDiv, "header": "Division ➗"}
}

// Helper functions
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function handleResponseSubmit() {;
    respTime = getTimeMs();
    duration = respTime - reqTime;
    resp = document.getElementById("resp").value;
    correct = resp == r
    if(correct) {
      reward = getReward();
      bonus = getTimeBonusReward(duration, reward);
      total = reward + bonus
      addScore(total);
      bonus_text = ""
      if (bonus) {
        bonus_text = ` + ${bonus} (tidsbonus) = ${total}`
      }
      responseText = `✅ Rätt! Du har vunnit ${reward}${bonus_text} ${CURRENCY}`
      document.getElementById('resp').ariaInvalid = false;
    } else {
      penalty = getReward();
      addScore(-1 * penalty);
      responseText = `❌ Fel! Rätt svar var ${r}. Du förlorade ${penalty} ${CURRENCY}`;
      document.getElementById('resp').ariaInvalid = true;
    }
    document.getElementById("p2").innerHTML = responseText;
    document.getElementById("resp").disabled = true;
    document.getElementById("submit-button").disabled = true;
    document.getElementById("refresh-button").hidden = false;
    document.getElementById("refresh-button").focus();

    updatePerformance();
    return false;
}

function getStoredInt(name, default_value=0){
    value = parseInt(window.localStorage.getItem(name));
    if(!value){
      value = default_value;
      window.localStorage.setItem(name, value)
    }
    return value;
}

function incStoredInt(name, value){
  current_value = getStoredInt(name);
  new_value = Math.max(current_value + value, 0);
  window.localStorage.setItem(name, new_value);
  return new_value;
}

function setStoredInt(name, value){
  window.localStorage.setItem(name, value);
}

function getScore(){
    return getStoredInt('score_v1')
}

function addScore(score) {
  return incStoredInt('score_v1', score)
}

function getScoreBooster(){
  return getStoredInt('score_booster_level_v1')
}

function getReward(){
  return 10 + getScoreBooster();
}

function incrementScoreBooster(levels=1){
  return incStoredInt('score_booster_level_v1', levels)
}

function updatePerformance(){
  reward = getReward();
  score = getScore();
  document.getElementById("score").innerHTML = `${score} ${CURRENCY}`;
  rewardElement = document.getElementById("reward");
  if(rewardElement){
    rewardElement.innerHTML = `${reward} ${CURRENCY_POW}`;
  }
  progress = document.getElementById("scoreProgress")
  if(progress) {
    progress.value = score;
    progress.max = getScoreBoosterPrice()
  }
}

function getParams(){
  const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });
  return params
}

function getTemplateId(){
  params = getParams();
  templateId = params.template_id;
  if(!templateId) {
    templateId = "0"
  }
  return templateId;
}


function renderTemplateHeader(){
  templateId = getTemplateId();
  header = templateMapping[templateId]["header"]
  updateTemplateHeader(header)
}


function updateTemplateHeader(header){
    document.getElementById("template_header").innerHTML = header;
}

function getScoreBoosterPrice(){
  level = getScoreBooster();
  base = 100
  return Math.round(base * Math.pow(1.15, level));
}

function buyScoreBooster(){
  price = getScoreBoosterPrice()
  level = getScoreBooster()
  score = getScore()
  if(score < price){
    return
  }
  addScore(-1*price)
  incrementScoreBooster()
  updatePerformance();
  updateScoreBoosterText();
}

function formatCalcString(v1, comp_string, v2) {
    return v1 + " " + comp_string + " " + v2 + " = ?"
}

function randRange(min_int, max_int) {
  return min_int + getRandomInt(max_int)
}

function getTimeMs(){
  return new Date().getTime();
}

function getTimeBonusReward(duration, reward){
  bonus = 0
  if (duration <= 2000) {
    bonus = reward * 10
  } else if (duration <= 4000) {
    bonus = reward * 5
  } else if (duration <= 6000) {
    bonus = Math.round(reward * 3)
  } else if (duration <= 8000) {
    bonus = Math.round(reward * 2)
  } else if (duration <= 10000) {
    bonus = Math.round(reward * 1)
  }
  console.log(`${duration} ms => ${bonus} stars`)
  return bonus
}


// Minion
function pageControllerMinion(){
  updatePerformance();
  updateMinion();
}

function getMinionSize(){
    return getStoredInt('minion_size_v1', 1);
}

function addMinionSize(amount){
  return incStoredInt('minion_size_v1', amount)
}

function setMinionSize(value){
  if(value < 1){
    value = 1;
  }
  return setStoredInt('minion_size_v1', value)
}

function getMinionUpdatedAt(){
  return getStoredInt('minion_updated_at_v1', getTimeMs());
}

function setUpdatedAt(value){
  return setStoredInt('minion_updated_at_v1', value);
}

function getMinionFeedPrice(){
  return 20*getMinionSize();
}

function getMinionHungerPeriod(){
  return getStoredInt('minion_hunger_period_v1', 86400);
}

function setMinionHungerPeriod(value){
  return setStoredInt('minion_hunger_period_v1', value);
}

function updateMinion(){
  minionSize = getMinionSize();
  canNotFeed = !canFeed();
  price = getMinionFeedPrice();
  numberOfMinions = Math.floor(minionSize / 5);
  checkMinionHunger();
  for(let i=0; i<9; i++){
    elementId = `minionGrid${i}`
    subminionSize = Math.max(Math.min((minionSize - i*5), 5), 0);
    fontSize = subminionSize * 10;
    document.getElementById(elementId).style.fontSize = `${fontSize}px`
  }
  document.getElementById("feedMinionButton").disabled = canNotFeed;
  document.getElementById("feedMinionButton").innerHTML = `Mata - ${price} ${CURRENCY}`
}

function checkMinionHunger(){
  updatedAt = getMinionUpdatedAt();
  period_seconds = getMinionHungerPeriod();
  diff_seconds = Math.round((getTimeMs() - updatedAt)/1000);
  if(diff_seconds > period_seconds) {
    numberOfPeriods = Math.floor(diff_seconds / period_seconds);
    setUpdatedAt(getTimeMs());
    minionIncreaseSize(-1*numberOfPeriods);
  }
  console.log(`Updated at: ${updatedAt}, Diff: ${diff_seconds} seconds`);
}

function canFeed(){
  afford = getScore() >= getMinionFeedPrice()
  maxSizeNotReached = getMinionSize() < 5*9;
  return afford && maxSizeNotReached
}

function minionIncreaseSize(amount){
  size = getMinionSize()
  if((size + amount) <= 0){
    setMinionSize(1);
  } else {
    addMinionSize(amount);
  }
  updateMinion();
}

function minionFeed(){
  if (!canFeed()){
    return
  }
  price = getMinionFeedPrice()
  addScore(-1*getMinionFeedPrice());
  addMinionSize(1);
  setUpdatedAt(getTimeMs());
  updateMinion();
  updatePerformance();
}

// Admin
function adminAddScore(score){
  addScore(score);
  updatePerformance();
}

function adminAddScoreBooster(levels){
  incrementScoreBooster(levels);
  updatePerformance();
}

function adminSimulateCorrectResponse(){
  addScore(getReward());
  updatePerformance();
}

function adminReset(){
  window.localStorage.clear();
  updatePerformance();
}

function adminSetMinionHungerPeriod(value){
  setMinionHungerPeriod(value);
}
