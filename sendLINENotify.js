// LINE Notifyのトークン
const notifyToken = "***";

// テストグループ用LINE Notifyトークン
const test_notifyToken = "***";

// LINEに含める項目の数：上限 -> "対応希望日"まで
const maxResLength = 8

function autoLine(e) {

  // すべての質問と回答を取得する
  const itemResponses = e.response.getItemResponses();

  // 個々の質問と回答を格納するための空配列を宣言する
  const questionAndAnswers = [];

  // 個々の質問と回答を取得する
  for(let i = 0; i < maxResLength + 1; i++) {
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
  
  // 管理者にLINEを送信する
  sendLine(notifyToken, body);
}

function sendLine(token, body) {

  // JSON形式でメッセージをPOST
  const options =
   {
     "method"  : "post",
     "payload" : {
        "message": body,
        }, 
     "headers" : {
        "Authorization" : "Bearer " + token
        }
   };

   UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}