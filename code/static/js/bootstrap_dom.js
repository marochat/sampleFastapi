import { assertIsInstanceOf } from "./common.js";
export var bootstrap;
(function (bootstrap) {
    /**
     * モーダルダイアログ用DOM
     * @param param0
     * @returns {HTMLElement} 構築したDOM文書
     */
    bootstrap.modalDialog = ({ dlgId = 'modalDialogId', title = 'modal dialog', body = 'ここにボディーを記載', okLabel = 'Accept', closeLabel = 'Close', okFunc, closeFunc = () => { }, size } = {}) => {
        let modalClass = 'modal-dialog';
        if (size)
            modalClass += ' modal-' + size;
        return document.createElementEdit('div', div => {
            div.className = 'modal fade text-dark';
            div.id = dlgId;
            div.tabIndex = -1;
            div.setAttribute('aria-labelledby', 'modalDialogLabel');
            div.setAttribute('aria-hidden', 'true');
        })
            .appendChain(document.createElement('div').setClass(modalClass)
            .editElement(div => div.setAttribute('data-keyboard', 'true'))
            .appendChain(document.createElement('form').setClass('modal-content')
            .editElement(form => {
            assertIsInstanceOf(form, HTMLFormElement);
            form.method = 'POST';
            form.action = '';
            form.onsubmit = () => { return false; };
        })
            .appendChain(document.createElement('div').setClass('modal-header')
            .appendChain(document.createElement('h5').setClass('modal-title').setID('modalDialogLabel')
            .appendChain(title))
            .appendChain(document.createElement('input')
            .setID('modalDialogCloseInput')
            .editElement(button => {
            assertIsInstanceOf(button, HTMLInputElement);
            button.type = 'button';
            button.className = 'btn-close';
            button.setAttribute('data-bs-dismiss', 'modal');
            button.setAttribute('aria-label', 'Close');
            button.onclick = closeFunc;
        })))
            .appendChain(document.createElement('div').setClass('modal-body')
            .appendChain(body))
            .appendChain(document.createElement('div').setClass('modal-footer')
            .editElement(div => {
            if (okFunc) {
                div.appendChain(document.createElement('button').setClass('btn btn-primary')
                    .setID('modalDialogAcceptButton')
                    .editElement(btn => {
                    assertIsInstanceOf(btn, HTMLButtonElement);
                    btn.tabIndex = 1;
                    btn.type = 'submit';
                    btn.onclick = okFunc;
                })
                    .appendChain(okLabel));
            }
            div.appendChain(document.createElement('button').setClass('btn btn-secondary')
                .setID('modalDialogCloseButton')
                .editElement(btn => {
                assertIsInstanceOf(btn, HTMLButtonElement);
                btn.tabIndex = 2;
                btn.setAttribute('data-bs-dismiss', 'modal');
                btn.onclick = closeFunc;
            })
                .appendChain(closeLabel));
        }))))
            .appendChain(document.createElement('button').editElement(button => {
            assertIsInstanceOf(button, HTMLButtonElement);
            button.type = 'button';
            button.hidden = true;
            button.id = 'show' + dlgId;
            button.setAttribute('data-bs-toggle', 'modal');
            button.setAttribute('data-bs-target', '#' + dlgId);
        }));
    };
    bootstrap.tabContents = ({ title = '', dat = [], closeFunc = () => { }, footer = document.createElement('div'), }) => {
        //console.log("getAdminArticle..")
        return document.createElement('div')
            .editElement(div => {
            div.className = 'card';
            div.style.padding = '10px';
            div.style.display = 'flex';
            div.appendElement('ul', ul => {
                ul.className = 'nav nav-tabs';
                ul.id = 'adminTabs';
                ul.setAttribute('role', 'tablist');
                for (let [idx, content] of dat.entries()) {
                    ul.appendElement('li', li => {
                        li.className = 'nav-item';
                        li.setAttribute('role', 'presentation');
                        li.appendElement('button', btn => {
                            assertIsInstanceOf(btn, HTMLButtonElement);
                            btn.className = (idx == 0) ? 'nav-link active' : 'nav-link';
                            btn.id = 'admin-' + content.id + '-tab';
                            btn.type = 'button';
                            btn.setAttribute('data-bs-toggle', 'tab');
                            btn.setAttribute('data-bs-target', '#admin-' + content.id);
                            btn.setAttribute('role', 'tab');
                            btn.setAttribute('aria-controls', 'admin-' + content.id);
                            btn.setAttribute('aria-selected', (idx == 0) ? 'true' : 'false');
                        }).appendChain(content.tabname);
                    });
                }
                ul.appendElement('input', button => {
                    assertIsInstanceOf(button, HTMLInputElement);
                    button.id = 'modalDialogCloseInput';
                    button.style.marginLeft = 'auto';
                    button.type = 'button';
                    button.className = 'btn-close';
                    button.setAttribute('aria-label', 'Close');
                    button.onclick = closeFunc;
                    //() => {
                    // 子クラスの静的関数でthisの使用に注意!!！！！！！
                    //const parent: HTMLElement = AppViewBase.article.parentElement!;
                    //if(AppViewBase.backupArticle){
                    //    AppViewBase.article = AppViewBase.backupArticle;
                    //    parent.clearElement().appendChild(AppViewBase.article);
                    //    AppViewBase.backupArticle = null;
                    //    AppViewBase.adminMode = false;
                    //}
                });
            });
            div.appendElement('div', div => {
                div.className = 'modal-body';
                div.appendElement('div', div => {
                    div.className = 'tab-content';
                    div.id = 'adminTabsContent';
                    for (let [idx, content] of dat.entries()) {
                        div.appendElement('div', pane => {
                            pane.className = (idx == 0) ? 'tab-pane fade show active' : 'tab-pane fade';
                            pane.id = 'admin-' + content.id;
                            pane.setAttribute('role', 'tabpannel');
                            pane.setAttribute('aria-labelledby', 'admin-' + content.id + '-tab');
                        }).appendChain(content.body);
                    }
                });
            });
            div.appendElement('div', div => {
                div.className = 'modal-footer';
                div.appendChain(footer);
            });
        });
    };
})(bootstrap || (bootstrap = {}));
