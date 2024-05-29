This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## はじめに
初回のみ(もしくは`package.json`ファイルに変更があった時)以下のコマンドを実行してください。
```bash
npm install
```

開発時は以下のコマンドを実行してください。
サーバーが起動し、他のサーバーが動いていない限りは[http://localhost:3000](http://localhost:3000) でリアルタイムに変更を確認できます。(ログでURLが表示されます)

```bash
npm run dev
```
もし止めたいなと思ったら、`Ctrl + C`を押してください。

## ファイルについて
- このプロジェクトではNext.jsを使用しています。
- `src/app`のフォルダ以下に、アプリケーションのコードが格納されています。
- フォルダ名がURLに対応していて、その中に`page.js`を作成することで、そのURLにアクセスした際に表示されるコンポーネントを指定できます。
- `src/components`のフォルダ以下に、アプリケーションで使用するコンポーネントが格納されています。
- 重要なのは`src/app`のフォルダ以下にあるファイルです。それ以外のファイルは、特にルールはありません。
- `layout.js`は、全てのページで共通して表示されるコンポーネントを指定することができます。
- `globals.css`を`layout.js`で読み込むことで、全てのページで共通のスタイルを適用することができます。
- ただし、`globals.css`は、全てのページで共通のスタイルを適用するために使用するファイルです。ページごとに異なるスタイルを適用する場合は、`page.js`または、各コンポーネントのファイルの内で`import`してください。

## Gitの運用
### はじめに
- このリポジトリは、GitHubを使ってバージョン管理を行います。
- 作業を始める前に、mainブランチを最新の状態にしてください
  - Forkを開いて
  - `fetch`をクリックしてください
  - もし、GitHubのアイコン(origin/~~)と何もない文字だけの行が分かれている場合、
    - GitHubのアイコンが上にある場合は、`Pull`をクリックしてください
    - 何もない文字だけの行が上にある場合は、`Push`をクリックしてください
  - 作業は、mainブランチから新しいブランチを作成して行ってください
  - mainブランチにチェックが付いている状態でコードの変更を行わないようにしてください
### ブランチ
- main: 全員のコードが統合されるブランチ
- \[名前\]: 各自の作業ブランチ

各々が作業する際は、mainブランチから、自分の名前のブランチを作成してください。
作業が終わったら、Gitが触れる人に頼んで、mainブランチにマージしてもらってください。

### コミットの仕方
ファイルになにか変更をした場合、その変更を記録に残して他の人と共有するために、コミットをします。
作業する際には`Fetch`を毎回してください

自分の名前のブランチにチェックが入っていることを確認しつつ、`Local Changes`タブを開いて
<img width="1710" alt="Unstaged changes" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/5291a114-eb38-48f7-8c78-d543c284b862">
コミットに含めたいファイルを選択して`Stage`ボタンで含めて
<img width="1710" alt="staged changes" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/9985c6e5-42b5-4ea4-9662-04ba711be653">
下記のルール通りにコミットメッセージを書いてコミット
<img width="1710" alt="commit message" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/a18c48e3-d22d-4964-a2e5-03423daa3571">

### プッシュの仕方

コミットができたら、ローカルの変更のコミットを他の人と共有するために、GitHubにプッシュする必要があります
<img width="1710" alt="committed unpushed" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/7c676c00-2d07-4df8-865a-3d4eec326e59">
GitHubのアイコンとブランチの名前が同じ列に来たらプッシュ成功です
<img width="1710" alt="pushed" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/289ee51b-d882-4782-bf4f-3e551e39f27c">

### プルの仕方

他の人が変更をプッシュすると、その他の人はGitHubから変更をダウンロードして、GitHubとローカルの変更を同期しなければいけません。

まずは`Fetch`をしてから、
画像のような状態になっていたら、まずはローカルとリモート(origin/~~となっているところ)が分かれているブランチのローカル側のブランチを右クリックして`Checkout`して
<img width="1710" alt="unpulled" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/d6985f40-d161-428f-9c0e-c45cec5d520a">
<img width="1710" alt="local main checkouted" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/ec61b7ce-46ac-48e6-af0c-355bab096c5c">
`Pull`をクリック
<img width="1710" alt="pulling" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/6ede1da0-b5c3-4905-b485-f5f219ba1542">
これでGitHubの変更をローカルに同期することができました
<img width="1710" alt="pulled complete" src="https://github.com/nenrinyear/shareable-todolist/assets/165178553/ea894a9b-2cc0-4ab4-b36f-10007518d566">


#### コミットメッセージ
- コミットメッセージは日本語で書いてください。
- コミットメッセージの冒頭には、以下のように、変更内容を簡潔に記述してください。
  - \[追加\] 新機能の追加
  - \[修正\] バグの修正
  - \[削除\] 不要なファイルの削除
  - \[その他\] その他の変更
- コミットメッセージの本文には、変更の理由や行った作業の要約などを記入してください。
