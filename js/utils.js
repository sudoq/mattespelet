// Page Controllers
function pageControllerBasicProblemTemplate(){
  templateId = getTemplateId();
  results = templateMapping[templateId]["controller"]();
  document.getElementById("p1").innerHTML = results;
}

function pageControllerAdd(){
  updatePerformance();
  min_num = 1
  max_num = 20

  v1 = randRange(min_num, max_num)
  v2 = randRange(min_num, max_num)

  r = v1 + v2;
  return formatCalcString(v1, "+", v2)
}

function pageControllerSub(){
  updatePerformance();
  min_num = 1
  max_num = 20

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
  v1 = randRange(0, 6)
  v2 = randRange(1, 10)

  r = v1 * v2;
  return formatCalcString(v1, "x", v2)
}

function pageControllerDiv(){
  updatePerformance();
  r = randRange(0, 5)
  v2 = randRange(1, 5)

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
  text = `✨ Stjärnförstärkare (Nivå ${next_level}), pris: ${price} ⭐`
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
    resp = document.getElementById("resp").value;
    correct = resp == r
    added_score = 0
    if(correct) {
      added_score = withScoreBooster(10);
      addScore(added_score);
      responseText = `✅ Rätt svar Elliot, bra jobbat! ${added_score} ⭐ till dig!`
      document.getElementById('resp').ariaInvalid = false;
    } else {
      responseText = `❌ Fel, rätt svar var ${r}`;
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

function getStoredInt(name){
    value = parseInt(window.localStorage.getItem(name));
    if(!value){
      value = 0
      window.localStorage.setItem(name, value)
    }
    return value;
}

function incStoredInt(name, value){
  current_value = getStoredInt(name);
  new_value = current_value + value;
  window.localStorage.setItem(name, new_value);
  return new_value;
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

function incrementScoreBooster(levels=1){
  return incStoredInt('score_booster_level_v1', levels)
}

function withScoreBooster(score){
  return score + getScoreBooster();
}

function updatePerformance(){
  level = getScoreBooster()
  score = getScore()
  document.getElementById("score").innerHTML = `${score} ⭐`
  document.getElementById("level").innerHTML = `${level} ✨`
  progress = document.getElementById("scoreProgress")
  progress.value = score;
  progress.max = getScoreBoosterPrice()
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
  added_score = 10 + getScoreBooster();
  addScore(added_score);
  updatePerformance();
}

function adminReset(){
  window.localStorage.clear();
  updatePerformance();
}
