import { EL } from "@alexgyver/component";
import './dialog.css';

export class DialogCont {
    constructor() {
        this.root = EL.make('div', {
            parent: document.body,
            class: 'dialog_back',
            style: {
                opacity: 0
            },
            transition: {
                opacity: 1,
                duration: 300,
            },
        });
    }

    close() {
        this.root.update({
            transition: {
                opacity: 0,
                duration: 300,
                onEnd: (e) => e.el.remove(),
            },
        });
    }
}

export function BaseDialog(label, content, actionOK, actionCancel, postbuild = null) {
    let dialog = new DialogCont();

    EL.update(dialog.root, {
        child: {
            tag: 'div',
            class: 'dialog_cont',
            child: {
                tag: 'div',
                class: 'dialog',
                children: [
                    {
                        tag: 'label',
                        text: label,
                    },
                    content,
                    {
                        tag: 'div',
                        class: 'dialog_btns',
                        children: [
                            {
                                tag: 'div',
                                class: 'button',
                                text: 'OK',
                                onClick: () => {
                                    actionOK();
                                    dialog.close();
                                },
                            },
                            {
                                tag: 'div',
                                style: 'width: 20px',
                            },
                            {
                                tag: 'div',
                                class: 'button',
                                style: 'background: var(--error)',
                                text: 'Cancel',
                                onClick: () => {
                                    actionCancel();
                                    dialog.close();
                                },
                            }
                        ]
                    }
                ]
            }
        }
    });

    if (postbuild) postbuild();
}

export function AsyncPrompt(label, value) {
    return new Promise(res => {
        let area = EL.make('textarea', {
            text: value,
            rows: 1,
            onInput: () => {
                area.style.height = area.scrollHeight + "px";
            },
        });

        BaseDialog(label, area, () => res(area.value), () => res(null), () => {
            area.focus();
            area.setSelectionRange(area.value.length, area.value.length);  // cursor end
            area.style.height = area.scrollHeight + "px";
        });
    });
}

export function AsyncConfirm(label, content) {
    return new Promise(res => {
        BaseDialog(label, content, () => res(1), () => res(0));
    });
}