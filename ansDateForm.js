// 注意
// カレンダーのシート名は「*月」とすること
// 「9月」とか、「10月」とか
// 
// カレンダーの「丸が書いてあるセル」と、その上の「日付セル」を参照している
// 日付セルは「月/日」の形式とすること
// カレンダーには年なんかも書いてあるが、そっちは見ていない

// 日付を挿入する項目が初めの質問から何番目に来るのか順番に"0"から数える。途中のセクションの変わり目を含む。
const TARGET_QUESTIONS_NUMBER = 8;

// 営業日のカレンダー用スプレッドシートのID
// (注)エクセルファイルは読み込めない、カレンダーはスプレッドシートにすること
// const CALENDER_SHEETS_ID = "1QjlcQGPHpuSdebCVdGjXJE_ASsngFhVXQfcXC3p1c88";
const CALENDER_SHEETS_ID = "1rS44N9j-1hnroe2k3s5jUnKPOq6hfNF9iOBVNsO6DHI";

// カレンダーの情報
const ROW_START = 6;
const ROW_NUM = 2 * 5;
const ROW_DAY = 5;
const COL_START = 2;
const COL_NUM = 7;

// 曜日
const DAYS = ['日', '月', '火', '水', '木', '金', '土'];

// 依頼日の選択肢をフォームにセットする
function setDaysChoices(e) {

  // 設定したい項目をフォームから取得
  const form = FormApp.getActiveForm();
  const items = form.getItems();
  const item = items[TARGET_QUESTIONS_NUMBER];

  // 現在のDate情報を取得
  const now = new Date();      
  const year = now.getFullYear();
  const month = now.getMonth();
  Logger.log(`Now: ${now}`);

  // 営業日を取得
  const workingDays = getWorkingDays(year, month, now);
  workingDays.push("その他");
  Logger.log(`Choices: ${workingDays}`);

  // フォームの選択肢を設定
  item.asListItem().setChoiceValues(workingDays).setRequired(true);
}

// カレンダーから営業日を取得する
function getWorkingDays(year_, month_, now){
  const workingDayArr = [];

  // 今月と来月の2カ月分出したいので、2回ループ
  for (let k = 1; k <= 2; k++) {

    let year = year_;
    let month = month_ + k; // Date型の返す月は0始まりなので、1スタートに直す
    if (month > 12) {
      month -= 12;
      ++year;
    }

    // 営業日のカレンダーを取得
    const spreadSheet = SpreadsheetApp.openById(CALENDER_SHEETS_ID);
    const sheet = spreadSheet.getSheetByName(month + "月");
    Logger.log(year + "年 " + month + "月");
    if (!sheet) {
      Logger.log("シートがない");
      continue;
    }

    // 2重ループでカレンダーの営業マーク欄を走査し、営業日かどうかを判定
    for (let i = 0; i < ROW_NUM / 2; ++i) {
      const rowMark = ROW_START + i * 2 + 1;
      const rowDate = ROW_START + i * 2;

      for (let j = 0; j < COL_NUM; ++j) {
        const col = COL_START + j;

        // マークのあるセルと、日付(月/日 の形式)のあるセルを参照
        const markCell = sheet.getRange(rowMark, col);
        const dateCell = sheet.getRange(rowDate, col);

        // マーク欄が空なら営業していないと判断
        if (markCell.isBlank())
          continue;

        // 営業日の場合は日付を取得
        const dateCellValue = dateCell.getDisplayValue().toString();
        const workingDay = convertToDate(dateCellValue, year);

        // 明日以降の営業日のみを追加(workingDayの時刻は0時のため、こう書くだけでよい)
        if (workingDay > now){
          workingDayArr.push(Utilities.formatDate(workingDay, 'Asia/Tokyo', `yyyy年M月d日(${DAYS[workingDay.getDay()]})`));
        }
      }
    }
  }
  return workingDayArr;
}

function convertToDate(dateCellValue, year){
  const temp = dateCellValue.split("/");
  const month = temp[0];
  const date = temp[1];
  return Utilities.parseDate(year + "/" + month + "/" + date, "JST", "yyyy/MM/dd");
}
