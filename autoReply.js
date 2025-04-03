// フォームの入力値を読み取る際のindex
// 質問がフォームの何番目にあるのか、0はじまりでカウントしたもの
const IDX_NAME = 0;               // 名前
const IDX_E_MAIL = 3;             // メアド
const IDX_PHONE = 4;              // 電話番号
const IDX_INQUIRY_CONTENT = 6;    // 依頼内容
const IDX_REQUEST_DATE = 7;       // 対応希望日
const IDX_REQUEST_DATE_SUB = 8;   // 対応希望日（営業時間外）

function autoReply(e) {

  // 入力データの取得
  const itemResponses = e.response.getItemResponses();
  
  const name = itemResponses[IDX_NAME].getResponse();
  const eMailAddr = itemResponses[IDX_E_MAIL].getResponse();
  const phoneNum = itemResponses[IDX_PHONE].getResponse();
  const content = itemResponses[IDX_INQUIRY_CONTENT].getResponse();
  let date = itemResponses[IDX_REQUEST_DATE].getResponse();
  const dateSub = itemResponses[IDX_REQUEST_DATE_SUB].getResponse();

  // 営業時間外を希望の場合
  if (date === "その他")
    date = "\n" + dateSub;

  // メール題名
  const subject = "【岩手大学生協PCサポートデスクRepair】" + name + " 様 お申込内容" + "【自動返信】";

  //メール本文
  const body = name + " 様\n\n" + 
             "ご依頼いただきありがとうございます。\n\n" +
             "担当者より改めてご連絡いたしますので、もうしばらくお待ちください。\n\n" +
             "〜お問合せ内容〜\n" +
             "お名前：" + name + "\n" +
             "メールアドレス：" + eMailAddr + "\n" +
             "電話番号：" + phoneNum + "\n" +
             "ご依頼内容：" + content + "\n" +
             "対応希望日：" + date + "\n" +
             "\n" +
             "---------------------------------------------------------------" + "\n" +
             "岩手大学生協 PCサポートデスク Re:pair" + "\n" +
             "\n" +
             "メールアドレス：***" + "\n" +
             "電話番号：***" + "\n" +
             "岩手大学生協HP：http://www.iwate.u-coop.or.jp/" + "\n" +
             "---------------------------------------------------------------" + "\n"

  GmailApp.sendEmail(eMailAddr, subject, body);
}
