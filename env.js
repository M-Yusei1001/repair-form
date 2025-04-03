/*
「プロジェクトの設定」->「スクリプト　プロパティ」から環境変数を設定できる
この関数の引数に環境変数の名前を渡すと、内容を取得できる
*/
function getEnvVariables(keyName) {
    return PropertiesService.getScriptProperties().getProperty(keyName);
  }