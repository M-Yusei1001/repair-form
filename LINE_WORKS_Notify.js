const CLIENT_ID = getEnvVariables("LW_CLIENT_ID");
const CLIENT_SECRET = getEnvVariables("LW_CLIENT_SECRET");
const BOT_ID = getEnvVariables("LW_BOT_ID");
const CHANNEL_ID = getEnvVariables("LW_CHANNEL_ID");

const maxResLen = 8

function sendLWNotify(e) {

  // すべての質問と回答を取得する
  const itemResponses = e.response.getItemResponses();

  // 個々の質問と回答を格納するための空配列を宣言する
  const questionAndAnswers = [];

  // 個々の質問と回答を取得する
  for(let i = 0; i < maxResLen + 1; i++) {
    // 質問のタイトルを取得する
    const questionTitle = itemResponses[i].getItem().getTitle();

    // 回答を取得する
    let answer = itemResponses[i].getResponse();
    
    // 未回答なら"未回答"にする
    if(!answer) answer = "未回答";

    questionAndAnswers.push("【" + questionTitle + "】\n" + answer + "\n");
  }

  // LINEの本文
  const body = "\n依頼フォームに回答がありました。\n" + "\n" + questionAndAnswers.join("\n");
  
  // メッセージ送信する
  const token = JSON.parse(getAccessToken())
  sendMessage(token.access_token, body);
}

// LINE WORKSの認可サーバーからService AccountのAccess Tokenを取得する
function getAccessToken(){
  const jwt = generateJWT();

  const payload = {
    "assertion": jwt,
    "grant_type": "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "client_id": CLIENT_ID,
    "client_secret": CLIENT_SECRET,
    "scope": "bot bot.message",
  }
  const options = {
    "method": "post",
    "Content-Type" : "application/x-www-form-urlencoded",
    "Content-Length": JSON.stringify(payload).length,
    "muteHttpExceptions": true,
    "payload": payload,
  }

  Logger.log(options)
  const response = UrlFetchApp.fetch("https://auth.worksmobile.com/oauth2/v2.0/token", options);
  Logger.log(response.getContentText());
  return response
}

function sendMessage(token, body) {
  const content = {
    "content":{
      "type":"text",
      "text": body,
    }
  };

  const options = {
    "method":"post",
    "headers":{
      "Content-Type":"application/json; charset=UTF-8",
      "Authorization": "Bearer" + " " + token,
    },
    "payload":JSON.stringify(content)
  };

  Logger.log(options)
  Logger.log(`https://www.worksapis.com/v1.0/bots/${BOT_ID}/channels/${CHANNEL_ID}/messages`)

  UrlFetchApp.fetch(`https://www.worksapis.com/v1.0/bots/${BOT_ID}/channels/${CHANNEL_ID}/messages`, options);
}