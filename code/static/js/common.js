/**
 * NULLセーフをアサートする関数：(any | nul)型などが対象
 * @param  {T} val
 * @returns assertsvalisNonNullable
 */
var _a, _b, _c;
var _d;
import { bootstrap as bs } from "./bootstrap_dom.js";
export function assertIsDefined(val) {
    if (val === undefined || val === null) {
        throw new Error(`Expected 'val' to be defined, but received ${val}`);
    }
}
/**
 * val が指定のクラスのオブジェクトであることをアサートする関数
 * アップキャストで渡された引数を本来のクラスにダウンキャストする時に使用
 * @param  {any} val
 * @param  {new} cls
 * @returns assertsvalisT
 */
export function assertIsInstanceOf(val, cls) {
    if (!(val instanceof cls)) {
        throw new Error(`${val} is not instance of cls`);
    }
}
/**
 * HTMLElementに自身を帰すメソッドを追加する
 * 　DOMでメソッドチェーンが可能になると思う
 * @param  {(elem: HTMLElement =>void} func
 * @returns HTMLElement
 */
HTMLElement.prototype.editElement = function (func) {
    assertIsInstanceOf(this, HTMLElement);
    //console.log("ElementType : " + this.constructor.name)
    func(this);
    return this;
};
/**
 * HTMLElement.append(Child)のメソッドチェーン用のラッパ
 * 引数はHTMLElementとstringを受け付ける
 * @param  {HTMLElement|string} child
 * @returns HTMLElement
 */
HTMLElement.prototype.appendChain = function (child) {
    assertIsInstanceOf(this, HTMLElement);
    if (child instanceof HTMLElement) {
        this.appendChild(child);
    }
    else if (typeof (child) === "string") {
        this.appendChild(document.createTextNode(child));
    }
    else {
        throw new TypeError("parameter node: must be string or HTMLElement.");
    }
    return this;
};
HTMLElement.prototype.appendElement = function (tag, func) {
    assertIsInstanceOf(this, HTMLElement);
    const elm = document.createElement(tag);
    if (func)
        func(elm);
    this.appendChild(elm);
    return elm;
};
Document.prototype.createElementEdit = function (tag, func) {
    const elm = document.createElement(tag);
    func(elm);
    return elm;
};
/**
 * HTMLElementの内容をクリアして自身を返す。メソッドチェーン用
 * @returns HTMLElement
 */
HTMLElement.prototype.clearElement = function () {
    assertIsInstanceOf(this, HTMLElement);
    this.innerHTML = "";
    return this;
};
HTMLElement.prototype.setClass = function (cls) {
    assertIsInstanceOf(this, HTMLElement);
    this.className = cls;
    return this;
};
HTMLElement.prototype.setID = function (id) {
    assertIsInstanceOf(this, HTMLElement);
    this.id = id;
    return this;
};
/**
 * ajax通信関数用名前空間
 */
export var ajax;
(function (ajax) {
    /**
     * AJAX通信でJSON形式のデータを取得する（async関数）
     * @param  {string} url  : リクエストURL
     * @returns Promise<any> : JSONデータ
     */
    ajax.get_json = async (url) => {
        try {
            let headers = {
                'Accept': 'application/json',
                'X-Requested-With': 'XMLHttpRequest'
            };
            if (ajax.token) {
                headers = Object.assign(Object.assign({}, headers), { Authorization: ajax.token.token_type + ' ' + ajax.token.access_token });
            }
            let response = await fetch(url, { headers: headers });
            if (response.ok) {
                return response.json();
            }
            else {
                throw { 'type': 'Error', 'message': response.statusText, 'status': response.status };
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     * AJAX通信でJSON形式のデータを取得する（async関数）
     * @param  {string} url  : リクエストURL
     * @returns Promise<any> : JSONデータ
     */
    ajax.post_json = async (url, jdat) => {
        let headers = {
            'X-Requested-With': 'XMLHttpRequest',
            'content-type': 'application/json'
        };
        if (ajax.token) {
            headers = Object.assign(Object.assign({}, headers), { Authorization: ajax.token.token_type + ' ' + ajax.token.access_token });
        }
        try {
            let response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: JSON.stringify(jdat),
            });
            if (response.ok) {
                return response.json();
            }
            else {
                throw { 'type': 'Error', 'message': response.statusText, 'status': response.status };
                //return request.json();
            }
        }
        catch (error) {
            throw error;
        }
    };
    /**
     * AJAX通信でJSON形式のデータを取得する（async関数）
     * @param  {string} url  : リクエストURL
     * @returns Promise<any> : JSONデータ
     */
    ajax.postform_json = async (url, fdat) => {
        let headers = {
            'X-Requested-With': 'XMLHttpRequest',
            //'content-type': 'application/json'
        };
        if (ajax.token) {
            headers = Object.assign(Object.assign({}, headers), { Authorization: ajax.token.token_type + ' ' + ajax.token.access_token });
        }
        try {
            let response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: fdat,
            });
            if (response.ok) {
                return response.json();
            }
            else {
                throw { 'type': 'Error', 'message': response.statusText, 'status': response.status };
            }
        }
        catch (error) {
            //console.log(error);
            throw error;
        }
    };
})(ajax || (ajax = {}));
export var util;
(function (util) {
    /**
     * async版timeout関数 Promise<void>を返すのでawaitする
     * @param  {number} ms
     * @returns Promise
     */
    util.timeout = async (ms) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };
    /**
     * ES8(2017) async/await構文に対応しているかを判別して返す
     * @returns boolean
     */
    util.es2017Check = () => {
        let val = true;
        try {
            eval('async () => {}');
        }
        catch (e) {
            if (e instanceof SyntaxError) {
                val = false;
            }
            else {
                throw e;
            }
        }
        return val;
    };
    /**
     * 時刻情報をもとにユニークな文字列を返す（IDなど一時的に使用）
     */
    util.getUniqueStr = () => new Date().getTime().toString(16) + Math.floor(1000 * Math.random()).toString(16);
})(util || (util = {}));
/**
 * AppViewBase : FaseAPIシングルページアプリケーション用DOM構築ベースクラス
 *               認証機能付きnavbarとサイドメニューを共通クラスメソッドとして実装
 */
export class AppViewBase {
    constructor() {
        this.dispArticle = () => {
            AppViewBase.article.clearElement();
        };
        this.dispContents = () => {
            var _a;
            if (util.es2017Check()) {
                this.dispArticle();
            }
            else {
                const para = (_a = AppViewBase.article.querySelector('p')) !== null && _a !== void 0 ? _a : (() => { throw new TypeError; })();
                para.before(document.createElement('p').appendChain("This site requires an ES2017 (ES8)-enabled browser"));
            }
            assertIsInstanceOf(this, AppViewBase);
            return this;
        };
        // ここでオーバーライドしたアロー関数型メソッドを呼び出しても反映されない
        // アロー関数は関数型変数とも呼べるので、コンストラクタで初期化されるものと考えられる
        console.log('base constructor');
        AppViewBase.dispInit();
        AppViewBase.adminMode = false;
    }
}
_d = AppViewBase;
AppViewBase.LOGIN_DIALOG_ID = 'loginModalDialog';
AppViewBase.LOGOFF_DIALOG_ID = 'logoffModalDialog';
AppViewBase.sideMenus = [];
AppViewBase.aside = (_a = document.querySelector('aside')) !== null && _a !== void 0 ? _a : (() => { throw new TypeError('Node "aside" not found.'); })();
AppViewBase.article = (_b = document.querySelector('article')) !== null && _b !== void 0 ? _b : (() => { throw new TypeError('Node "article" not found.'); })();
AppViewBase.navbar = (_c = document.querySelector('nav')) !== null && _c !== void 0 ? _c : (() => { throw new TypeError('Node "nav" not found'); })();
AppViewBase.adminMode = false;
AppViewBase.createAdminArticle = () => {
    return document.createElement('div').appendChain('accured something error.');
};
/**
 * モーダルダイアログを開く
 * bootstrapで用意したダミーボタンを押すことでダイアログオープン
 * @private @static
 */
AppViewBase.openModalDialog = (dialogId) => {
    var _a, _b;
    const btn = (_a = document.getElementById('show' + dialogId)) !== null && _a !== void 0 ? _a : (() => { throw new Error('id of dialog open button not found...'); })();
    assertIsInstanceOf(btn, HTMLButtonElement);
    btn.click();
    const modalDialog = (_b = document.getElementById(dialogId)) !== null && _b !== void 0 ? _b : (() => { throw new Error('id of modal dialog not found...'); })();
    const focusInput = modalDialog.querySelector('#userNameInput');
    if (focusInput) {
        assertIsInstanceOf(focusInput, HTMLInputElement);
        // bootstrapの処理待ち（テキトウ）
        util.timeout(500).then(() => focusInput.focus());
    }
    else {
        const btn = modalDialog.querySelector('#modalDialogAcceptButton');
        if (btn) {
            assertIsInstanceOf(btn, HTMLButtonElement);
            util.timeout(500).then(() => btn.focus());
        }
    }
};
/**
 * モーダルダイアログを閉じる
 * bootstrapで用意した閉じるボタンを押すことでクローズする仕組み
 * @param dialogId
 */
AppViewBase.closeModalDialog = (dialogId) => {
    var _a, _b;
    const thisModal = (_a = document.getElementById(dialogId)) !== null && _a !== void 0 ? _a : (() => { throw new Error; })();
    const closeInput = (_b = thisModal.querySelector('#modalDialogCloseInput')) !== null && _b !== void 0 ? _b : (() => { throw new Error; })();
    assertIsInstanceOf(closeInput, HTMLInputElement);
    closeInput.click();
};
/**
 * ナビバー表示用クラスメソッド：ログイン/ログアウト機能
 *
 * @protected
 * @static
 */
AppViewBase.dispNavBar = () => {
    _d.navbar.clearElement()
        .appendChain(document.createElement("a").editElement(stitle => {
        assertIsInstanceOf(stitle, HTMLAnchorElement);
        stitle.className = "navbar-brand";
        stitle.href = "#";
    })
        .appendChain("FastApi Sample Template"))
        // responsive buttin style
        .appendChain(document.createElement("button").editElement(button => {
        assertIsInstanceOf(button, HTMLButtonElement);
        button.type = "button";
        button.setAttribute("data-bs-toggle", "collapse");
        button.setAttribute("data-bs-target", "#navbarContent");
        button.setAttribute("aria-controls", "navbarContect");
        button.setAttribute("aria-expanded", "false");
        button.setAttribute("aria-label", "Toggle navigation");
    })
        .appendChain(document.createElement("span")))
        // navi menu 
        .appendChain(document.createElement("div").editElement(menutop => {
        menutop.className = "collapse navbar-collapse";
        menutop.id = "navbarContent";
    })
        .appendChain(document.createElement("ul").editElement(async (menutable) => {
        //let menudat: menuitems = await get_ajax_json("ajax_get_navi/");
        let menudat = [];
        for (let item of menudat) {
            //console.log(item.title);
            menutable.appendChild(document.createElement("li").editElement(menuitem => {
                menuitem.appendChild(document.createElement("a").editElement(link => {
                    assertIsInstanceOf(link, HTMLAnchorElement);
                    link.href = item.path;
                    link.target = "_bkank";
                })
                    .appendChain(item.title));
            }));
        }
    }))
        .editElement(async (menutop) => {
        let auth = await ajax.get_json("/authcheck");
        // console.log(auth.auth);
        if (auth.auth) {
            menutop.appendChild(document.createElement("a").editElement(link => {
                link.className = "link-secondary";
                assertIsInstanceOf(link, HTMLAnchorElement);
                link.href = "#";
                link.onclick = () => {
                    // 管理画面の表示
                    if (AppViewBase.adminMode)
                        return;
                    if (_d.adminArticle == null) {
                        _d.adminArticle = _d.createAdminArticle();
                    }
                    assertIsDefined(_d.adminArticle);
                    _d.backupArticle = _d.article;
                    _d.adminMode = true;
                    const parent = _d.article.parentElement;
                    _d.article = document.createElement('article').appendChain(_d.adminArticle);
                    parent.clearElement().appendChild(_d.article);
                    _d.adminArticle = null;
                    // とりあえずバックアップしたアーティクルが元に戻るかのテスト
                    //util.timeout(2000).then(() => {
                    //    if(this.backupArticle){
                    //        parent.clearElement().appendChild(document.createElement('article').appendChain(this.backupArticle));
                    //    }
                    //});
                    //new AdminView().dispContents();
                };
            })
                .appendChain(auth.name));
            // ログアウト用のモーダルダイアログ構築
            menutop.appendChain(bs.modalDialog({
                dlgId: _d.LOGOFF_DIALOG_ID,
                title: 'Logoff',
                body: 'ログオフしますか？',
                okLabel: 'Logoff',
                okFunc: () => {
                    ajax.get_json('/logoff/').then(res => {
                        // ajax token 削除
                        ajax.token = null;
                        _d.closeModalDialog(_d.LOGOFF_DIALOG_ID);
                        _d.dispInit();
                    });
                    console.log('thread main...returns');
                },
            }));
        }
        else {
            // ログイン用のモーダルダイアログ構築
            menutop.appendChain(bs.modalDialog({
                dlgId: _d.LOGIN_DIALOG_ID,
                title: 'User Login',
                okLabel: 'Login',
                closeLabel: 'Close',
                //body: document.createElement('div').appendChain('Todo. table input into here...'),
                body: document.createElement('div').appendChain(document.createElement('table').editElement(table => {
                    table.style.margin = 'auto';
                    table.style.borderCollapse = 'separate';
                    table.style.borderSpacing = '0px 15px';
                    table.appendChain(document.createElement('tr')
                        .appendChain(document.createElement('td')
                        .editElement(td => {
                        td.style.textAlign = 'right';
                        td.textContent = 'Name : ';
                    }))
                        .appendChain(document.createElement('td')
                        .appendChain(document.createElement('input')
                        .editElement(input => {
                        assertIsInstanceOf(input, HTMLInputElement);
                        input.style.borderBottom = '1px solid black';
                        input.style.borderTop = 'none';
                        input.style.borderLeft = 'none';
                        input.style.borderRight = 'none';
                        input.name = 'username';
                        input.type = 'text';
                        input.id = 'userNameInput';
                    }))));
                    table.appendChain(document.createElement('tr')
                        .appendChain(document.createElement('td')
                        .editElement(td => {
                        td.style.textAlign = 'right';
                        td.textContent = 'Password : ';
                    }))
                        .appendChain(document.createElement('td')
                        .appendChain(document.createElement('input')
                        .editElement(input => {
                        assertIsInstanceOf(input, HTMLInputElement);
                        input.style.borderBottom = '1px solid black';
                        input.style.borderTop = 'none';
                        input.style.borderLeft = 'none';
                        input.style.borderRight = 'none';
                        input.name = 'password';
                        input.type = 'password';
                        input.id = 'passwordInput';
                    }))));
                })),
                okFunc: () => {
                    var _a;
                    const thisModal = (_a = document.getElementById(_d.LOGIN_DIALOG_ID)) !== null && _a !== void 0 ? _a : (() => { throw new Error; })();
                    const nameInput = thisModal.querySelector('#userNameInput');
                    const passwdInput = thisModal.querySelector('#passwordInput');
                    assertIsInstanceOf(nameInput, HTMLInputElement);
                    assertIsInstanceOf(passwdInput, HTMLInputElement);
                    let name = nameInput.value;
                    let passwd = passwdInput.value;
                    if (name == '' || passwd == '') {
                        window.alert('ユーザー名とパスワードを入力してください');
                    }
                    else {
                        // Todo: ログイン処理：コピペで良いと思う
                        const fd = new FormData();
                        fd.append('username', name);
                        fd.append('password', passwd);
                        nameInput.value = '';
                        passwdInput.value = '';
                        ajax.postform_json('token', fd)
                            .then(rval => {
                            ajax.token = rval;
                            //console.log(ajax.token);
                            _d.closeModalDialog(_d.LOGIN_DIALOG_ID);
                            _d.dispInit();
                        })
                            .catch(err => {
                            console.log(err);
                            window.alert('ユーザー名またはパスワードが違います');
                        });
                    }
                },
                closeFunc: () => {
                    var _a;
                    const thisModal = (_a = document.getElementById(_d.LOGIN_DIALOG_ID)) !== null && _a !== void 0 ? _a : (() => { throw new Error; })();
                    const nameInput = thisModal.querySelector('#userNameInput');
                    const passwdInput = thisModal.querySelector('#passwordInput');
                    assertIsInstanceOf(nameInput, HTMLInputElement);
                    assertIsInstanceOf(passwdInput, HTMLInputElement);
                    nameInput.value = '';
                    passwdInput.value = '';
                },
            }));
        }
        menutop.appendChild(document.createElement("a").editElement(adm => {
            assertIsInstanceOf(adm, HTMLAnchorElement);
            adm.className = "btn";
            adm.href = '#';
            adm.onclick = () => {
                var _a;
                if (auth.auth) {
                    _d.openModalDialog(_d.LOGOFF_DIALOG_ID);
                    // 下記に変更すると標準のconfirmダイアログでログアウトできるようになる
                    //let result = window.confirm('ログアウトしますか？')
                    //if(result){
                    //    get_ajax_json('/logoff/').then(res => {
                    //        // console.log(res);
                    //        this.dispInit();
                    //    });
                    //}
                }
                else {
                    // this.loginDialog.style.display = 'block';
                    _d.openModalDialog(_d.LOGIN_DIALOG_ID);
                    const nameInput = (_a = document.getElementById('userNameInput')) !== null && _a !== void 0 ? _a : (() => { throw new TypeError; })();
                    nameInput.focus();
                }
            };
        })
            .appendChain((auth.auth) ? "Logout" : "Login"));
    }));
};
AppViewBase.dispSideMenu = () => {
    _d.aside.clearElement()
        .appendChain(document.createElement("header").appendChain("Sample Menu"))
        .appendChain(document.createElement("ul").editElement(ul => {
        for (let item of _d.sideMenus) {
            ul.appendChild(document.createElement("li")
                .appendChain(document.createElement("a").editElement(link => {
                assertIsInstanceOf(link, HTMLAnchorElement);
                link.href = "#";
                link.onclick = () => new item.view().dispContents();
            }).appendChain(item.title)));
        }
    }));
};
AppViewBase.dispInit = () => {
    if (util.es2017Check()) {
        _d.dispNavBar();
        _d.dispSideMenu();
    }
};
console.log('setup baseclass');
