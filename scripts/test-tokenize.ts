// import { MecabWorker, UNIDIC3 } from 'mecab-web-worker';

async function main() {
  const fn = (s: string) => s;

  const a =
    fn(`wakachigaki は辞書を使わない軽量の日本語分かち書き用ライブラリです。

ピュアなJavaScriptなのでNode.jsやDeno, ブラウザなど環境を問わず動作し、TypeScriptやES Module1にも対応しています。

予め分かち書きされた大量の日本語テキストから作成した機械学習モデルを内包することで辞書不要の分かち書きを実現しています。

学習にはWikipedia日本語版のダンプデータ全量を用いました。MeCab + mecab-ipadic-NEologd で得られる分かち書き結果を約90%の精度で再現することが出来ています。

単語境界の判定には文中に出現する文字の種類や並び順の情報のみを用いるようになっており、文字や単語単位で固有の情報を一切利用していないため未知語に非常に強いのが特徴です。

辞書を用いる kuromoji.js などと異なり品詞の推定機能はありませんが、その分インストールも実行も軽量で環境を問わず動作します。`);

  return a;
}

main();
