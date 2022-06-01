/* ======================================================== **
    Django + javascript(Typescript) Web application sample
                                marochanet org 2022/03 -
** ======================================================== */
import { get_ajax_json, AppViewBase } from "./common.js";
const SampleAppView = class extends AppViewBase {
    constructor() {
        super(...arguments);
        this.dispArticle = () => {
            SampleAppView.article.clearElement()
                .appendChain(document.createElement("header").appendChain("fastAPI SPAPP Sample"))
                .appendChain(document.createElement("div").editElement(bframe => {
                bframe.style.padding = "5px";
            })
                .appendChain("fastAPI single page application DOM sample page."))
                .appendChain(document.createElement("div")
                .editElement(div => {
                div.id = "ajax_sample_view";
                get_ajax_json('/authcheck')
                    .then(res => console.log(res));
            }));
        };
        /**
         *
        constructor(){
            super();
            //this.dispArticle();
        }
         */
    }
};
/**
* HTML文書から呼び出されるDOM初期化関数
*/
export const init = () => {
    // サイドメニュー項目
    AppViewBase.sideMenus = [
        { title: 'Sample Page1', view: SampleAppView },
    ];
    AppViewBase.dispInit();
    new AppViewBase.sideMenus[0].view().dispContents();
};
