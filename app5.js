const express = require("express");
const app = express();

app.set('view engine', 'ejs');
app.use("/public", express.static(__dirname + "/public"));

let station = [
  { id:1, code:"JE01", name:"東京駅"},
  { id:2, code:"JE07", name:"舞浜駅"},
  { id:3, code:"JE12", name:"新習志野駅"},
  { id:4, code:"JE13", name:"幕張豊砂駅"},
  { id:5, code:"JE14", name:"海浜幕張駅"},
  { id:6, code:"JE05", name:"新浦安駅"},
];

let station2 = [
  { id:1, code:"JE01", name:"東京駅", change:"総武本線，中央線，etc", passengers:403831, distance:0 },
  { id:2, code:"JE02", name:"八丁堀駅", change:"日比谷線", passengers:31071, distance:1.2 },
  { id:3, code:"JE05", name:"新木場駅", change:"有楽町線，りんかい線", passengers:67206, distance:7.4 },
  { id:4, code:"JE07", name:"舞浜駅", change:"舞浜リゾートライン", passengers:76156,distance:12.7 },
  { id:5, code:"JE12", name:"新習志野駅", change:"", passengers:11655, distance:28.3 },
  { id:6, code:"JE17", name:"千葉みなと駅", change:"千葉都市モノレール", passengers:16602, distance:39.0 },
  { id:7, code:"JE18", name:"蘇我駅", change:"内房線，外房線", passengers:31328, distance:43.0 },
];

app.get("/keiyo2", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('keiyo2', {data: station2} );
});

app.get("/keiyo2/:number", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  const number = req.params.number;
  const detail = station2[ number ];
  res.render('keiyo2_detail', {data: detail} );
});

app.get("/keiyo", (req, res) => {
  // 本来ならここにDBとのやり取りが入る
  res.render('db1', { data: station });
});

app.get("/keiyo_add", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  res.render('db1', { data: station });
});

app.get("/keiyo_add2", (req, res) => {
  let id = req.query.id;
  let code = req.query.code;
  let name = req.query.name;
  let newdata = { id: id, code: code, name: name };
  station.push( newdata );
  res.redirect('/public/keiyo_add.html');
});


app.get("/hello1", (req, res) => {
  const message1 = "Hello world";
  const message2 = "Bon jour";
  res.render('show', { greet1:message1, greet2:message2});
});

app.get("/hello2", (req, res) => {
  res.render('show', { greet1:"Hello world", greet2:"Bon jour"});
});

app.get("/icon", (req, res) => {
  res.render('icon', { filename:"./public/Apple_logo_black.svg", alt:"Apple Logo"});
});

app.get("/omikuji1", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.send( '今日の運勢は' + luck + 'です' );
});

app.get("/omikuji2", (req, res) => {
  const num = Math.floor( Math.random() * 6 + 1 );
  let luck = '';
  if( num==1 ) luck = '大吉';
  else if( num==2 ) luck = '中吉';

  res.render( 'omikuji2', {result:luck} );
});

app.get("/janken", (req, res) => {
  // ----------------------------------------------------
  // 1. 変数の初期化とデータ型変換 (安定化)
  // handがない場合は0を初期値とし、NaNを避ける
  const playerHandNum = Number(req.query.hand) || 0;
  let win = Number(req.query.win) || 0;
  let total = Number(req.query.total) || 0;
  
  // CPUの手を決定 (1: グー, 2: チョキ, 3: パー)
  const cpuHandNum = Math.floor(Math.random() * 3) + 1;
  let judgement = 'ゲーム開始'; // 初回アクセス時のメッセージ

  console.log({ playerHandNum, win, total, cpuHandNum });

  // ----------------------------------------------------
  // 2. じゃんけん判定ロジック
  
  // プレイヤーが有効な手を出している場合のみ判定を行う
  if (playerHandNum >= 1 && playerHandNum <= 3) {
      total += 1; // 有効な手が出されたので、合計回数をインクリメント

      // 1. 引き分け判定
      if (playerHandNum === cpuHandNum) {
          judgement = '分け';
      } 
      // 2. 勝ち判定 (プレイヤーが勝つ3パターン)
      // (グー(1) vs チョキ(2)), (チョキ(2) vs パー(3)), (パー(3) vs グー(1))
      else if (
          (playerHandNum === 1 && cpuHandNum === 2) || 
          (playerHandNum === 2 && cpuHandNum === 3) || 
          (playerHandNum === 3 && cpuHandNum === 1)
      ) {
          judgement = '勝ち';
          win += 1;
      } 
      // 3. 負け判定 (上記以外はすべて負け)
      else {
          judgement = '負け';
      }
  }

  // ----------------------------------------------------
  // 3. 表示用の文字列変換とレスポンス (スコープエラーの解消)
  
  // 1, 2, 3 の数値を 'グー', 'チョキ', 'パー' に変換するためのマップ
  const handMap = {
    1: 'グー',
    2: 'チョキ',
    3: 'パー',
    0: 'なし' // 初回アクセス時のためのダミー
  };
  
  // **ここで一度だけ display オブジェクトを定義する**
  // これにより、初回のアクセス (hand=0) でも display が保証される
  const display = {
    your: (playerHandNum === 0) ? 'なし' : handMap[playerHandNum], // 初回は「なし」と表示
    cpu: (playerHandNum === 0) ? 'なし' : handMap[cpuHandNum],     // 初回は「なし」と表示
    judgement: judgement,
    win: win,
    total: total
  }

  res.render( 'janken', display );
});

app.listen(8080, () => console.log("Example app listening on port 8080!"));
