/**
 * NULLセーフをアサートする関数：(any | nul)型などが対象
 * @param  {T} val
 * @returns assertsvalisNonNullable
 */

export function assertIsDefined<T>(val: T) : asserts val is NonNullable<T> {
    if(val === undefined || val === null){
        throw new Error(
            `Expected 'val' to be defined, but received ${val}`
        );
    }
}
/**
 * val が指定のクラスのオブジェクトであることをアサートする関数
 * アップキャストで渡された引数を本来のクラスにダウンキャストする時に使用
 * @param  {any} val
 * @param  {new} cls
 * @returns assertsvalisT
 */
export function assertIsInstanceOf<T>(val: any, cls: new() => T) : asserts val is T {
    if(!(val instanceof cls)){
        throw new Error(`${val} is not instance of cls`);
    }
}

/**
 * HTMLElementに自身を返すメソッドを追加するためのおまじない（メソッドチェイン実現用）
 * グローバルのインタフェースにメソッド追加
 * とくにexportしなくて良い？
 */
declare global {
    interface HTMLElement {
        editElement(func: (elem: HTMLElement) =>  void): HTMLElement
        appendChain(child: HTMLElement | string): HTMLElement
        clearElement(): HTMLElement
        setClass(cls: string): HTMLElement
        setID(id: string): HTMLElement
    }
}
/**
 * HTMLElementに自身を帰すメソッドを追加する
 * 　DOMでメソッドチェーンが可能になると思う
 * @param  {(elem: HTMLElement =>void} func
 * @returns HTMLElement
 */
HTMLElement.prototype.editElement = function(func: (elem : HTMLElement) => void) : HTMLElement {
    assertIsInstanceOf(this, HTMLElement);
    //console.log("ElementType : " + this.constructor.name)
    func(this);
    return this;
}
/**
 * HTMLElement.append(Child)のメソッドチェーン用のラッパ
 * 引数はHTMLElementとstringを受け付ける
 * @param  {HTMLElement|string} child
 * @returns HTMLElement
 */
HTMLElement.prototype.appendChain = function(child: HTMLElement | string) : HTMLElement {
    assertIsInstanceOf(this, HTMLElement);
    if(child instanceof HTMLElement){
        this.appendChild(child);
    } else if (typeof(child) === "string"){
        this.appendChild(document.createTextNode(child));
    } else {
        throw new TypeError("parameter node: must be string or HTMLElement.");
    }
    return this;
}
/**
 * HTMLElementの内容をクリアして自身を返す。メソッドチェーン用
 * @returns HTMLElement
 */
HTMLElement.prototype.clearElement = function() : HTMLElement {
    assertIsInstanceOf(this, HTMLElement);
    this.innerHTML = "";
    return this;
}

HTMLElement.prototype.setClass = function(cls: string): HTMLElement {
    assertIsInstanceOf(this, HTMLElement);
    this.className = cls;
    return this;
}
HTMLElement.prototype.setID = function(id: string): HTMLElement {
    assertIsInstanceOf(this, HTMLElement);
    this.id = id;
    return this;
}
/**
 * 時刻情報をもとにユニークな文字列を返す（IDなど一時的に使用）
 */
export const getUniqueStr = () => new Date().getTime().toString(16) + Math.floor(1000*Math.random()).toString(16)

//console.log("common.ts loaded!!")

/**
 * AJAX通信でJSON形式のデータを取得する（async関数）
 * @param  {string} url  : リクエストURL
 * @returns Promise<any> : JSONデータ
 */
export const get_ajax_json = async (url: string) : Promise<any> => {
    try {
        let response: any = await fetch(url, { headers: {'X-Requested-With': 'XMLHttpRequest'}});
        if(response.ok){
            return response.json();
        } else {
            throw {'type': 'Error', 'message': response.statusText, 'status': response.status};
        }
    } catch (error: any) {
        throw error;
    }
}
/**
 * AJAX通信でJSON形式のデータを取得する（async関数）
 * @param  {string} url  : リクエストURL
 * @returns Promise<any> : JSONデータ
 */
 export const post_ajax_json = async (url: string, jdat: JSON) : Promise<any> => {
    try {
        let response: any = await fetch(url, {
            method: "POST",
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'content-type': 'application/json'
            },
            body: JSON.stringify(jdat),
        });
        if(response.ok){
            return response.json();
        } else {
            throw {'type': 'Error', 'message': response.statusText, 'status': response.status};
            //return request.json();
        }
    } catch (error: any) {
        throw error;
    }
}

/**
 * AJAX通信でJSON形式のデータを取得する（async関数）
 * @param  {string} url  : リクエストURL
 * @returns Promise<any> : JSONデータ
 */
 export const postform_ajax_json = async (url: string, fdat: FormData) : Promise<any> => {
    try {
        let response: any = await fetch(url, {
            method: "POST",
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                //'content-type': 'application/json'
            },
            body: fdat,
        });
        if(response.ok){
            return response.json();
        } else {
            throw {'type': 'Error', 'message': response.statusText, 'status': response.status};
        }
    } catch (error: any) {
        //console.log(error);
        throw error;
    }
}
/**
 * async版timeout関数 Promise<void>を返すのでawaitする
 * @param  {number} ms
 * @returns Promise
 */
export const timeout = async (ms: number) : Promise<void> =>  {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * ES8(2017) async/await構文に対応しているかを判別して返す
 * @returns boolean
 */
export const es2017AsyncCheck = () : boolean => {
    let val: boolean = true;
    try {
        eval('async () => {}');
    } catch(e) {
        if (e instanceof SyntaxError) {
            val = false;
        } else {
            throw e;
        }
    }
    return val;
}

type menuitems = {
    title: string
    path: string
    doc: string
}[];
type authdata = {
    auth: boolean
    name: string
};
export type SideMenus = {
    title: string
    view: typeof AppViewBase
}[];

/**
 * AppViewBase : FaseAPIシングルページアプリケーション用DOM構築ベースクラス
 *               認証機能付きnavbarとサイドメニューを共通クラスメソッドとして実装
 */
export const AppViewBase = class {
    private static readonly LOGIN_DIALOG_ID: string = 'loginModalDialog';
    private static readonly LOGOFF_DIALOG_ID: string = 'logoffModalDialog';
    public static sideMenus: SideMenus = [];
    protected static aside: HTMLElement = document.querySelector('aside') ?? (() => {throw new TypeError('Node "aside" not found.')})();
    protected static article: HTMLElement = document.querySelector('article') ?? (() => {throw new TypeError('Node "article" not found.')})();
    protected static navbar: HTMLElement = document.querySelector('nav') ?? (() => {throw new TypeError('Node "nav" not found')})();
    
    /**
     * モーダルダイアログ用DOMメソッド
     * 
     * @param param0 
     * @returns void
     */
    private static modalDlg = (
        {
            dlgId = 'modalDialogId',
            title = 'modal dialog',
            body = 'ここにボディーを記載',
            okLabel = 'Accept',
            closeLabel = 'Close',
            okFunc,
            closeFunc = () => {}
        }: {
            dlgId?: string;
            title?: string;
            body?: string | HTMLElement;
            okLabel?: string;
            closeLabel?: string;
            okFunc?: () => void | null;
            closeFunc?: () => void;
        } = {}
    ) => {
        return document.createElement('div')
                .setClass('modal fade text-dark').setID(dlgId)
                .editElement(div => {
                    //if(dlgId){div.id = dlgId}
                    div.tabIndex = -1;
                    div.setAttribute('aria-labelledby','loginDialogLabel');
                    div.setAttribute('aria-hidden', 'true');
                })
                .appendChain(document.createElement('div').setClass('modal-dialog')
                    .editElement(div => div.setAttribute('data-keyboard', 'true'))
                    .appendChain(document.createElement('form').setClass('modal-content')
                        .editElement(form => {
                            assertIsInstanceOf(form, HTMLFormElement);
                            form.method = 'POST';
                            form.action = '';
                            //form.onsubmit = () => false;
                            form.onsubmit = () => {return false};
                        })
                        .appendChain(document.createElement('div').setClass('modal-header')
                            .appendChain(document.createElement('h5').setClass('modal-title').setID('loginDialogLabel')
                                .appendChain(title)
                            )
                            .appendChain(document.createElement('input')
                                .setID('modalDialogCloseInput')
                                .editElement(button => {
                                    assertIsInstanceOf(button, HTMLInputElement);
                                    button.type = 'button';
                                    button.className = 'btn-close';
                                    button.setAttribute('data-bs-dismiss', 'modal');
                                    button.setAttribute('aria-label', 'Close');
                                })
                                //.appendChain('X')
                            )
                        )
                        .appendChain(document.createElement('div').setClass('modal-body')
                            .appendChain(body)
                        )
                        .appendChain(document.createElement('div').setClass('modal-footer')
                            .editElement(div => {
                                if(okFunc){
                                    div.appendChain(document.createElement('button').setClass('btn btn-primary')
                                    .setID('modalDialogAcceptButton')
                                    .editElement(btn => {
                                        assertIsInstanceOf(btn, HTMLButtonElement)
                                        btn.type = 'submit';
                                        btn.onclick = okFunc;
                                    })
                                    .appendChain(okLabel)
                                    )
                                }
                                div.appendChain(document.createElement('button').setClass('btn btn-secondary')
                                .setID('modalDialogCloseButton')
                                .editElement(btn => {
                                    assertIsInstanceOf(btn, HTMLButtonElement);
                                    btn.setAttribute('data-bs-dismiss', 'modal');
                                    btn.onclick = closeFunc;
                                })
                                .appendChain(closeLabel)
                                )
                            })
                        )
                    )
                )
                .appendChain(document.createElement('button').editElement(button => {
                    assertIsInstanceOf(button, HTMLButtonElement);
                    button.type = 'button';
                    button.hidden = true;
                    button.id = 'show' + dlgId;
                    button.setAttribute('data-bs-toggle', 'modal');
                    button.setAttribute('data-bs-target', '#' + dlgId);
                }))
    }
    
    /**
     * モーダルダイアログを開く
     * bootstrapで用意したダミーボタンを押すことでダイアログオープン
     * @private @static
     */
    protected static openModalDialog = (dialogId: string) : void => {
        const btn: HTMLElement = document.getElementById('show' + dialogId) ?? (() => {throw new Error('id of dialog open button not found...')})();
        assertIsInstanceOf(btn, HTMLButtonElement);
        btn.click();
        const modalDialog = document.getElementById(dialogId) ?? (() => {throw new Error('id of modal dialog not found...')})();
        const focusInput = modalDialog.querySelector('#userNameInput');
        if(focusInput){
            assertIsInstanceOf(focusInput, HTMLInputElement);
            // bootstrapの処理待ち（テキトウ）
            timeout(500).then(() => focusInput.focus());
        }
    }
    /**
     * モーダルダイアログを閉じる
     * bootstrapで用意した閉じるボタンを押すことでクローズする仕組み
     * @param dialogId 
     */
    protected static closeModalDialog = (dialogId: string) : void => {
        const thisModal = document.getElementById(dialogId) ?? (() => {throw new Error})();
        const closeInput = thisModal.querySelector('#modalDialogCloseInput') ?? (() => {throw new Error})();
        assertIsInstanceOf(closeInput, HTMLInputElement);
        closeInput.click();
    }

    /**
     * ナビバー表示用クラスメソッド：ログイン/ログアウト機能
     *
     * @protected
     * @static
     */
    protected static dispNavBar = (): void => {
        this.navbar.clearElement()
        .appendChain(document.createElement("a").editElement( stitle => {
            assertIsInstanceOf(stitle, HTMLAnchorElement)
            stitle.className = "navbar-brand";
            stitle.href = "#";
            })
            .appendChain("FastApi Sample Template")
        )
        // responsive buttin style
        .appendChain(document.createElement("button").editElement(
            button => {
                assertIsInstanceOf(button, HTMLButtonElement);
                button.type = "button";
                button.setAttribute("data-bs-toggle", "collapse");
                button.setAttribute("data-bs-target", "#navbarContent");
                button.setAttribute("aria-controls", "navbarContect");
                button.setAttribute("aria-expanded", "false");
                button.setAttribute("aria-label", "Toggle navigation");
            })
            .appendChain(document.createElement("span"))
        )
        // navi menu 
        .appendChain(document.createElement("div").editElement( menutop => {
            menutop.className = "collapse navbar-collapse";
            menutop.id = "navbarContent";
            })
            .appendChain(document.createElement("ul").editElement(async menutable => {
                //let menudat: menuitems = await get_ajax_json("ajax_get_navi/");
                let menudat: menuitems = []
                for(let item of menudat){
                    //console.log(item.title);
                    menutable.appendChild(document.createElement("li").editElement( menuitem => {
                        menuitem.appendChild(document.createElement("a").editElement(link => {
                            assertIsInstanceOf(link, HTMLAnchorElement);
                            link.href = item.path;
                            link.target = "_bkank";
                            })
                            .appendChain(item.title)
                        )
                    }));
                }
            }))
            .editElement(async menutop => {
                let auth: authdata = await get_ajax_json("authcheck");
                // console.log(auth.auth);
                if(auth.auth){
                    menutop.appendChild(document.createElement("a").editElement(
                        link => {
                            link.className = "text-secondary"
                            assertIsInstanceOf(link, HTMLAnchorElement);
                            link.href = "#";
                        })
                        .appendChain(auth.name)
                    );
                    // ログアウト用のモーダルダイアログ構築
                    menutop.appendChain(this.modalDlg({
                        dlgId: this.LOGOFF_DIALOG_ID,
                        title: 'Logoff',
                        body: 'ログオフしますか？',
                        okLabel: 'Logoff',
                        okFunc: () => {
                            get_ajax_json('/logoff/').then(res => {
                                this.closeModalDialog(this.LOGOFF_DIALOG_ID);
                                this.dispInit();
                            })
                        },
                    }));
                } else {
                    // ログイン用のモーダルダイアログ構築
                    menutop.appendChain(this.modalDlg({
                        dlgId: this.LOGIN_DIALOG_ID,
                        title: 'User Login',
                        okLabel: 'Login',
                        closeLabel: 'Close',
                        //body: document.createElement('div').appendChain('Todo. table input into here...'),
                        body: document.createElement('div')
                        .appendChain(document.createElement('table').editElement(table => {
                            table.style.margin = 'auto';
                            table.style.borderCollapse = 'separate';
                            table.style.borderSpacing = '0px 15px';
                            table.appendChain(document.createElement('tr')
                                .appendChain(document.createElement('td')
                                    .editElement(td => {
                                        td.style.textAlign = 'right';
                                        td.textContent = 'Name : ';
                                    })
                                )
                                .appendChain(document.createElement('td')
                                    .appendChain(document.createElement('input')
                                        .editElement(input => {
                                            assertIsInstanceOf(input, HTMLInputElement);
                                            input.style.borderBottom = '1px solid black'
                                            input.style.borderTop = 'none';
                                            input.style.borderLeft = 'none';
                                            input.style.borderRight = 'none';
                                            input.name = 'username';
                                            input.type = 'text';
                                            input.id = 'userNameInput';
                                        })
                                    )
                                )
                            );
                            table.appendChain(document.createElement('tr')
                                .appendChain(document.createElement('td')
                                    .editElement(td => {
                                        td.style.textAlign = 'right';
                                        td.textContent = 'Password : ';
                                    })
                                )
                                .appendChain(document.createElement('td')
                                    .appendChain(document.createElement('input')
                                        .editElement(input => {
                                            assertIsInstanceOf(input, HTMLInputElement); 
                                            input.style.borderBottom = '1px solid black'
                                            input.style.borderTop = 'none';
                                            input.style.borderLeft = 'none';
                                            input.style.borderRight = 'none';
                                            input.name = 'password';
                                            input.type = 'password';
                                            input.id = 'passwordInput'
                                        })
                                    )
                                )
                            );
                        })),

                        okFunc: () => {
                            const thisModal = document.getElementById(this.LOGIN_DIALOG_ID) ?? (() => {throw new Error})();
                            const nameInput = thisModal.querySelector('#userNameInput');
                            const passwdInput = thisModal.querySelector('#passwordInput');
                            assertIsInstanceOf(nameInput, HTMLInputElement);
                            assertIsInstanceOf(passwdInput, HTMLInputElement);
                            let name = nameInput.value;
                            let passwd = passwdInput.value;
                            if(name == '' || passwd == ''){
                                window.alert('ユーザー名とパスワードを入力してください')
                            } else {
                                // Todo: ログイン処理：コピペで良いと思う
                                const fd: FormData = new FormData();
                                fd.append('username', name);
                                fd.append('password', passwd);
                                nameInput.value = '';
                                passwdInput.value = '';
                                postform_ajax_json('token', fd)
                                .then(rval => {
                                    this.closeModalDialog(this.LOGIN_DIALOG_ID);
                                    this.dispInit();
                                })
                                .catch(err => {
                                    console.log(err);
                                    window.alert('ユーザー名またはパスワードが違います');
                                });
                            }
                        },
                        closeFunc: () => {
                            const thisModal = document.getElementById(this.LOGIN_DIALOG_ID) ?? (() => {throw new Error})();
                            const nameInput = thisModal.querySelector('#userNameInput');
                            const passwdInput = thisModal.querySelector('#passwordInput');
                            assertIsInstanceOf(nameInput, HTMLInputElement);
                            assertIsInstanceOf(passwdInput, HTMLInputElement);
                            nameInput.value = '';
                            passwdInput.value = '';
                        },
                    }));
                }
                menutop.appendChild(document.createElement("a").editElement(
                    adm => {
                        assertIsInstanceOf(adm, HTMLAnchorElement);
                        adm.className = "btn";
                        adm.href = '#';
                        adm.onclick = () => {
                            if(auth.auth){
                                this.openModalDialog(this.LOGOFF_DIALOG_ID);
                                // 下記に変更すると標準のconfirmダイアログでログアウトできるようになる
                                //let result = window.confirm('ログアウトしますか？')
                                //if(result){
                                //    get_ajax_json('/logoff/').then(res => {
                                //        // console.log(res);
                                //        this.dispInit();
                                //    });
                                //}
                            } else {
                                // this.loginDialog.style.display = 'block';
                                this.openModalDialog(this.LOGIN_DIALOG_ID);
                                const nameInput: HTMLElement = document.getElementById('userNameInput') ?? (() => {throw new TypeError})();
                                nameInput.focus();
                            }
                        }
                    })
                    .appendChain((auth.auth)?"Logout":"Login")
                );
            })
        );
    
    }
    protected static dispSideMenu = (): void => {
        this.aside.clearElement()
        .appendChain(document.createElement("header").appendChain("Sample Menu"))
        .appendChain(document.createElement("ul").editElement(ul => {
            for(let item of this.sideMenus){
                ul.appendChild(document.createElement("li")
                    .appendChain(document.createElement("a").editElement(link => {
                        assertIsInstanceOf(link, HTMLAnchorElement);
                        link.href = "#";
                        link.onclick = () => new item.view().dispContents();
                    }).appendChain(item.title))
                );
            }
        }));
    }
    public static dispInit = (): void => {
        if(es2017AsyncCheck()){
            this.dispNavBar();
            this.dispSideMenu();
        }
    }
    protected dispArticle = (): void => {
        AppViewBase.article.clearElement().appendChain("test test test");
    }

    public dispContents = (): typeof AppViewBase => {
        if(es2017AsyncCheck()){
            this.dispArticle();
        } else {
            const para: HTMLElement = AppViewBase.article.querySelector('p') ?? (() => {throw new TypeError})();
            para.before(document.createElement('p').appendChain("This site requires an ES2017 (ES8)-enabled browser"));
        }
        assertIsInstanceOf(this, AppViewBase)
        return this as unknown as typeof AppViewBase;
    }

    constructor(){
        // ここでオーバーライドしたアロー関数型メソッドを呼び出しても反映されない
        // アロー関数は関数型変数とも呼べるので、コンストラクタで初期化されるものと考えられる
    }
}
