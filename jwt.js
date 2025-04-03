/*
LINE WORKS APIにリクエストするには、JSON Web Tokenをクライアント側で作成する必要がある
https://developers.worksmobile.com/jp/docs/auth-jwt

このプログラムの参考元
https://www.labnol.org/code/json-web-token-201128/
https://qiita.com/iwaohig/items/ba41a43a5fc46ba07051
*/

function generateJWT() {
    //JWTのヘッダー
    const header = {
      "alg": "RS256", 
      "typ": "JWT" 
    };
  
    const now = Date.now();
    const expires = new Date(now);
    expires.setHours(expires.getHours() + 1);
  
    //JWTのJSON Claims Set
    const jsonClaimsSet = {
    "iss": "***",
    "sub": "***",
    "iat": Math.round(now / 1000),
    "exp": Math.round(expires.getTime() / 1000)
    };
  
    //JWTデジタル署名
    //ヘッダーとClaims SetをBASE64エンコードしてくっつける
    const toSign = `${base64Encode(header)}.${base64Encode(jsonClaimsSet)}`;
  
    //くっつけたものをRSA-SHA-256アルゴリズムを使用してPrivate Keyでデジタル署名する
    const signatureBytes = Utilities.computeRsaSha256Signature(toSign, replaceSpacesInPrivateKey(getEnvVariables("LW_PRIVATE_KEY")));
  
    //デジタル署名したものをBASE64エンコードする
    const signature = base64Encode(signatureBytes, false);
  
    //JWTの形式にして返す
    return `${toSign}.${signature}`;
  }
  
  function base64Encode(text, json = true) {
    const data = json ? JSON.stringify(text) : text;
    return Utilities.base64EncodeWebSafe(data).replace(/=+$/, '');
  };
  
  function testJWT(){
    Logger.log(generateJWT());
  }
  
  
  /*
  デジタル署名用のPrivate Keyは、PEM形式になっている。
  しかし、GASではそのままだと何故か使えない。
  半角スペースを改行（\n）に置き換え、文字列にする必要がある。
  
  参考元
  https://qiita.com/kunihiros/items/4cdec5784f21598cfee0
  
  この関数では、「プロジェクトの設定」→「スクリプト　プロパティ」中の
  LW_PRIVATE_KEYの内容を取得して、GASで使用できる形式に変換する。
  
  スクリプトプロパティには、LINE WORKS Developers Consoleから取得したPrivate Keyの値を
  そのまま貼り付けてよい。
  */
  function replaceSpacesInPrivateKey(text) {
    // PRIVATE_KEY ブロックを正規表現で抽出
    const privateKeyBlocks = text.match(/-----BEGIN PRIVATE KEY-----[\s\S]*?-----END PRIVATE KEY-----/g);
  
    let replacedText = text;
  
    privateKeyBlocks.forEach(block => {
      // PRIVATE KEY ブロックの中身だけを抽出
      const contentMatch = block.match(/-----BEGIN PRIVATE KEY-----([\s\S]*?)-----END PRIVATE KEY-----/);
      if (contentMatch && contentMatch[1]) {
        const content = contentMatch[1];
  
        // 中身の半角スペースを改行に置換
        const replacedContent = content.replace(/ /g, '\n');
  
        // 置換後の内容で元のブロックを置き換え
        replacedText = replacedText.replace(block, `-----BEGIN PRIVATE KEY-----${replacedContent}-----END PRIVATE KEY-----`);
      }
    });
  
    return replacedText;
  }