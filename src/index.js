// 対応表のURLリスト
const table_list = ["./table/markdown.json", "./table/pukiwiki.json"];
let translationTables = new Object();

/**
 * 対応表（jsonファイル）を読み込む関数
 */
function loadJson() {
    for (let table of table_list) {
        fetch(table)
            .then(response => response.json())
            .then(data => {
                translationTables[data.inputType] = data;
                // console.log(data);
            })
    }
}

/**
 * 入力したテキストを指定した型のフォーマットに変換する
 * @param {string} text 変換するテキスト
 * @param {string} inputType 変換前の記法
 * @param {string} outputType 変換後の記法
 * @return {string} 変換した結果のテキスト
 */
function translate(text, inputType = 'Markdown', outputType = 'pukiWiki') {
    let result = text;
    for (let notation of translationTables[inputType].notations) {
        console.log(notation);
        if (notation["regexp"] != null & notation[outputType] != null) {

            const re = new RegExp(notation["regexp"], 'gm');
            result = result.replace(re, notation[outputType]);

            // デバッグ用
            // console.log("RegExp: " + re);
        }
    }

    return result;
}



loadJson();
const { createApp, ref } = Vue;

const app = createApp({
    setup() {
        const inputType = ref([]);
        const selectedInputType = ref('');
        const inputText = ref('');
        const outputType = ref([]);
        const selectedOutputType = ref('');
        const outputText = ref('');

        /**
         * 入力先の候補を変更する
        */
        function setInputType() {
            inputType.value = Object.keys(translationTables);
            // console.log(inputType);
        }

        /**
         * 出力先の候補を変更する
        */
        function setOutputType() {
            outputType.value = translationTables[selectedInputType.value].outputType;
        }

        /**
         * ボタンを押したときの処理
         */
        function clickButton() {
            // 入力形式と出力形式を選択しているか判定
            // 選択していないときはMarkdownをpukiWikiに変換すると判定
            if (selectedInputType.value != '' & selectedOutputType != '') {
                outputText.value = translate(inputText.value, selectedInputType.value, selectedOutputType.value);
            } else {
                outputText.value = translate(inputText.value);
            }
        }

        return {
            inputType,
            selectedInputType,
            inputText,
            outputType,
            selectedOutputType,
            outputText,
            setInputType,
            setOutputType,
            clickButton
        }
    }
}).mount('#app');
