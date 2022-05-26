var _a;
import { util, AppViewBase, assertIsInstanceOf, ajax } from './common.js';
import { bootstrap as bs } from './bootstrap_dom.js';
export const initadmin = 1;
export const AdminView = (_a = class extends AppViewBase {
    },
    /* 管理画面用なのでdispArticleは使わない
    protected dispArticle = (): void => {
    }
    */
    _a.userDataTabView = () => {
        const thisId = util.getUniqueStr();
        return document.createElementEdit('div', div => {
            div.id = thisId;
            div.appendElement('div', div => {
                div.className = 'header';
                div.style.position = 'relative';
                div.appendElement('header', header => {
                    // header.appendElement('h4', head => head.append('User List'));
                    header.appendElement('h4', h => h.append('User List'));
                    header.appendElement('span', sp => {
                        const dId = 'adminAddUserDlg';
                        sp.style.position = 'absolute';
                        sp.style.top = '0px';
                        sp.style.right = '0px';
                        sp.appendElement('button', btn => {
                            assertIsInstanceOf(btn, HTMLButtonElement);
                            btn.className = 'btn btn-primary btn-sm text-light';
                            btn.style.marginLeft = 'auto';
                            btn.type = 'button';
                            btn.id = 'show' + dId;
                            btn.setAttribute('data-bs-toggle', 'modal');
                            btn.setAttribute('data-bs-target', '#' + dId);
                            btn.append('new account');
                        });
                        sp.appendChild(bs.modalDialog({
                            dlgId: dId,
                            title: 'New Account',
                            body: document.createElementEdit('div', div => {
                                div.className = 'container';
                                div.appendElement('table', tbl => {
                                    tbl.className = 'table table-borderless';
                                    tbl.appendElement('tbody', tbd => {
                                        tbd.appendElement('tr', tr => {
                                            tr.appendElement('td', td => {
                                                td.style.width = '40%';
                                                td.style.textAlign = 'right';
                                                td.style.verticalAlign = 'middle';
                                            }).appendElement('label', lbl => {
                                                assertIsInstanceOf(lbl, HTMLLabelElement);
                                                lbl.className = 'form-label';
                                                lbl.setAttribute('for', 'adminAddUserUserName');
                                                lbl.append('user name');
                                            });
                                            tr.appendElement('td', td => {
                                                td.style.width = '60%';
                                            }).appendElement('input', input => {
                                                assertIsInstanceOf(input, HTMLInputElement);
                                                input.id = 'adminAddUserUserName';
                                                input.type = 'text';
                                                input.className = 'form-control';
                                                input.placeholder = 'input you name';
                                            });
                                        });
                                        tbd.appendElement('tr', tr => {
                                            tr.appendElement('td', td => {
                                                td.style.width = '40%';
                                                td.style.textAlign = 'right';
                                                td.style.verticalAlign = 'middle';
                                            }).appendElement('label', lbl => {
                                                assertIsInstanceOf(lbl, HTMLLabelElement);
                                                lbl.className = 'form-label';
                                                lbl.setAttribute('for', 'adminAddUserEmailAddress');
                                                lbl.append('Email Address');
                                            });
                                            tr.appendElement('td', td => {
                                                td.style.width = '60%';
                                            }).appendElement('input', input => {
                                                assertIsInstanceOf(input, HTMLInputElement);
                                                input.id = 'adminAddUserEmailAddress';
                                                input.type = 'email';
                                                input.className = 'form-control';
                                                input.placeholder = 'example@example.com';
                                            });
                                        });
                                        tbd.appendElement('tr', tr => {
                                            tr.appendElement('td', td => {
                                                td.style.width = '40%';
                                                td.style.textAlign = 'right';
                                                td.style.verticalAlign = 'middle';
                                            }).appendElement('label', lbl => {
                                                assertIsInstanceOf(lbl, HTMLLabelElement);
                                                lbl.className = 'form-label';
                                                lbl.setAttribute('for', 'adminAddUserFullName');
                                                lbl.append('Full Name');
                                            });
                                            tr.appendElement('td', td => {
                                                td.style.width = '60%';
                                            }).appendElement('input', input => {
                                                assertIsInstanceOf(input, HTMLInputElement);
                                                input.id = 'adminAddUserFullName';
                                                input.type = 'text';
                                                input.className = 'form-control';
                                                input.placeholder = 'input you full name';
                                            });
                                        });
                                        let pass1;
                                        let pass2;
                                        let confirmElem;
                                        tbd.appendElement('tr', tr => {
                                            tr.appendElement('td', td => {
                                                td.style.width = '40%';
                                                td.style.textAlign = 'right';
                                                td.style.verticalAlign = 'middle';
                                            }).appendElement('label', lbl => {
                                                assertIsInstanceOf(lbl, HTMLLabelElement);
                                                lbl.className = 'form-label';
                                                lbl.setAttribute('for', 'adminAddUserPassword');
                                                lbl.append('password');
                                            });
                                            tr.appendElement('td', td => {
                                                td.style.width = '60%';
                                            }).appendElement('input', input => {
                                                assertIsInstanceOf(input, HTMLInputElement);
                                                input.id = 'adminAddUserPassword';
                                                input.type = 'password';
                                                input.className = 'form-control';
                                                pass1 = input;
                                            });
                                        });
                                        tbd.appendElement('tr', tr => {
                                            tr.appendElement('td', td => {
                                                td.style.width = '40%';
                                                td.style.textAlign = 'right';
                                                td.style.verticalAlign = 'middle';
                                            }).appendElement('label', lbl => {
                                                assertIsInstanceOf(lbl, HTMLLabelElement);
                                                lbl.className = 'form-label';
                                                lbl.setAttribute('for', 'adminAddUserPasswordConfirm');
                                                lbl.append('password(confirm)');
                                                confirmElem = lbl;
                                            });
                                            tr.appendElement('td', td => {
                                                td.style.width = '60%';
                                            }).appendElement('input', input => {
                                                assertIsInstanceOf(input, HTMLInputElement);
                                                input.id = 'adminAddUserPasswordConfirm';
                                                input.type = 'password';
                                                input.className = 'form-control';
                                                pass2 = input;
                                                input.oninput = () => {
                                                    // 入力チェック
                                                    if (pass2.value == '') {
                                                        confirmElem.innerHTML = 'password(confirm)';
                                                    }
                                                    else if (pass1.value == pass2.value) {
                                                        confirmElem.innerHTML = 'confirmed.';
                                                        console.log('confimed!');
                                                    }
                                                    else {
                                                        confirmElem.innerHTML =
                                                            '<spam style="color:red">not confirmed.</spam>';
                                                    }
                                                };
                                            });
                                        });
                                        tbd.appendElement('tr', tr => {
                                            tr.appendElement('td', td => {
                                                td.style.width = '40%';
                                                td.style.textAlign = 'right';
                                                td.style.verticalAlign = 'middle';
                                            }).appendElement('label', lbl => {
                                                assertIsInstanceOf(lbl, HTMLLabelElement);
                                                lbl.className = 'form-label';
                                                lbl.setAttribute('for', 'adminAddUserGroup');
                                                lbl.append('Group');
                                            });
                                            tr.appendElement('td', td => {
                                                td.style.width = '60%';
                                            }).appendElement('select', sel => {
                                                assertIsInstanceOf(sel, HTMLSelectElement);
                                                sel.id = 'adminAddUserGroup';
                                                sel.className = 'form-select';
                                                //sel.appendElement('option', opt => {
                                                //    assertIsInstanceOf(opt, HTMLOptionElement);
                                                //    opt.selected;
                                                //    opt.append('select user group');
                                                //})
                                                sel.appendElement('option');
                                                sel.appendElement('option', opt => {
                                                    assertIsInstanceOf(opt, HTMLOptionElement);
                                                    opt.value = '1';
                                                    opt.textContent = 'One';
                                                });
                                                sel.appendElement('option', opt => {
                                                    assertIsInstanceOf(opt, HTMLOptionElement);
                                                    opt.value = '2';
                                                    opt.textContent = 'Two';
                                                });
                                                sel.appendElement('option', opt => {
                                                    assertIsInstanceOf(opt, HTMLOptionElement);
                                                    opt.value = '3';
                                                    opt.textContent = 'Three';
                                                });
                                            });
                                        });
                                    });
                                });
                            }),
                            size: 'lg',
                        }));
                    });
                });
            });
            div.appendElement('div', div => {
                div.className = 'body';
                div.appendElement('table', tbl => {
                    tbl.className = 'table table-bordered';
                    ajax.get_json('/admin/users/').then(jsn => {
                        if (Array.isArray(jsn) && Array(jsn).length > 0) {
                            tbl.appendElement('thead', head => {
                                head.appendElement('tr', tr => {
                                    tr.appendElement('td', td => td.append('No.'));
                                    tr.appendElement('td', td => td.append('username'));
                                    tr.appendElement('td', td => td.append('full name'));
                                    tr.appendElement('td', td => td.append('E-mail'));
                                    tr.appendElement('td', td => td.append('Group'));
                                });
                            });
                            tbl.appendElement('tbody', tbd => {
                                for (let rec of jsn) {
                                    tbd.appendElement('tr', tr => {
                                        tr.appendElement('td', td => td.append(rec.id));
                                        tr.appendElement('td', td => td.append(rec.username));
                                        tr.appendElement('td', td => td.append(rec.full_name));
                                        tr.appendElement('td', td => td.append(rec.email));
                                        tr.appendElement('td', td => td.append(rec.group));
                                    });
                                }
                            });
                            console.log(Array(jsn).length);
                        }
                    });
                });
            });
        });
    },
    _a.groupDataTabview = () => {
        const thisId = util.getUniqueStr();
        return document.createElementEdit('div', div => {
            div.id = thisId;
            div.appendElement('div', div => {
                div.className = 'header';
                div.style.position = 'relative';
                div.appendElement('header', header => {
                    header.appendElement('h4', h => h.append('Group List'));
                    header.appendElement('span', sp => {
                        sp.style.position = 'absolute';
                        sp.style.top = '0px';
                        sp.style.right = '0px';
                        sp.appendElement('button', btn => {
                            btn.className = 'btn btn-primary btn-sm text-light';
                            btn.style.marginLeft = 'auto';
                            btn.append('new group');
                        });
                    });
                });
            });
            div.appendElement('div', div => {
                div.className = 'body';
                div.appendElement('table', tbl => {
                    tbl.className = 'table table-bordered';
                    ajax.get_json('/admin/groups/').then(jsn => {
                        if (Array.isArray(jsn) && Array(jsn).length > 0) {
                            tbl.appendElement('thead', head => {
                                head.appendElement('tr', tr => {
                                    tr.appendElement('td', td => td.append('No.'));
                                    tr.appendElement('td', td => td.append('group'));
                                    tr.appendElement('td', td => td.append('description'));
                                });
                            });
                            tbl.appendElement('tbody', tbd => {
                                for (let rec of jsn) {
                                    tbd.appendElement('tr', tr => {
                                        tr.appendElement('td', td => td.append(rec.id));
                                        tr.appendElement('td', td => td.append(rec.name));
                                        tr.appendElement('td', td => td.append(rec.description));
                                    });
                                }
                            });
                            console.log(Array(jsn).length);
                        }
                    });
                });
            });
        });
    },
    _a.createAdminArticle = () => {
        return bs.tabContents({
            title: 'admin tab layout',
            dat: [
                {
                    tabname: 'User',
                    id: 'user',
                    body: AdminView.userDataTabView(),
                    onFunc: () => { },
                },
                {
                    tabname: 'Group',
                    id: 'group',
                    body: _a.groupDataTabview(),
                    onFunc: () => { },
                },
            ],
            closeFunc: () => {
                // 子クラスの静的関数でthisの使用に注意!!！！！！！
                const parent = AppViewBase.article.parentElement;
                if (AppViewBase.backupArticle) {
                    AppViewBase.article = AppViewBase.backupArticle;
                    parent.clearElement().appendChild(AppViewBase.article);
                    AppViewBase.backupArticle = null;
                    AppViewBase.adminMode = false;
                }
            },
            footer: ''
        });
    },
    /**
     * 継承した親クラスの静的メソッドを子クラスで再定義したもので上書きする
     * 親クラスから呼び出せるようにするため。
     */
    _a.setupAdminView = () => {
        AppViewBase.createAdminArticle = AdminView.createAdminArticle;
    },
    _a);
/**
 * AdminViewポインタをベースクラスに登録する
 * app.js で モジュールのみをインポートすることで実行される
 *    import './com_admin.js'
*/
AdminView.setupAdminView();
console.log('adminview init.');
