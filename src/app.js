import "esp-web-tools/dist/web/install-button";
import { Component } from '@alexgyver/component';
import { AsyncConfirm, AsyncPrompt } from './dialog';
import markdownit from 'markdown-it'
const md = markdownit();

const projects_list = 'https://raw.githubusercontent.com/AlexGyver/ota-projects/main/projects.txt';
const info_html = md.render(`
Установка прошивок проектов на ESP8266/ESP32 с GitHub:
- Название проекта ведёт на репозиторий проекта на GitHub
- Наведение на название - описание проекта, наведение на версию - описание изменений версии
- Кнопка установки запускает процесс прошивки по USB

Для загрузки прошивки должен быть установлен драйвер на CH34x, если он ещё не установлен - нажмите на кнопку установки любого проекта, затем **отмена** - появится окошко со ссылками на драйверы для всех ОС. Установите драйвер, подключите плату к ПК, запустите установку и выберите COM порт, к которому подключена плата.

По умолчанию выводится список доступных проектов AlexGyver, можно добавить и другие проекты, которые поддерживаются сервисом AlexGyver OTA:
- Для добавления чужих проектов нажмите кнопку добавления проекта, вставьте в окно идентификаторы проектов на GitHub в формате *АККАУНТ/НАЗВАНИЕ* (например *AlexGyver/BallClock*) **по одному проекту в строке**
- Для добавления поддержки своего проекта нужно создать репозиторий, в корне которого в ветке *main* должен находиться файл *project.json* с информацией о проекте и ссылкой на скомпилированную прошивку. Правила оформления файла можно посмотреть например [здесь](https://github.com/AlexGyver/ota-projects)
`);

export default class App {
    constructor() {
        Component.make('div', {
            parent: document.body,
            context: this,
            class: 'main',
            var: 'main',
            children: [
                {
                    tag: 'div',
                    class: 'header',
                    children: [
                        {
                            tag: 'span',
                            style: 'font-size: 19px',
                            text: 'AlexGyver OTA',
                        },
                        {
                            tag: 'div',
                            children: [
                                {
                                    tag: 'div',
                                    class: 'icon info',
                                    events: {
                                        click: async () => {
                                            await AsyncConfirm('AlexGyver OTA', Component.make('div', { html: info_html, class: 'dialog_text' }));
                                        }
                                    }
                                },
                                {
                                    tag: 'div',
                                    class: 'icon plus',
                                    events: {
                                        click: async () => {
                                            let projects = localStorage.getItem('projects');
                                            let res = await AsyncPrompt('Добавить проекты', projects);
                                            if (res) {
                                                localStorage.setItem('projects', res);
                                                location.reload();
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        });
    }

    async load() {
        let projects;
        try {
            projects = await fetch(projects_list, { cache: "no-store" });
            projects = await projects.text();
        } catch (e) {
            console.log(e);
            return;
        }
        if (localStorage.hasOwnProperty('projects')) {
            projects += '\r\n' + localStorage.getItem('projects');
        }
        projects = projects.split(/\r?\n/);

        for (let proj of projects) {
            this.loadProject(proj);
        }
    }

    async loadProject(proj) {
        if (!proj) return;
        proj = proj.split('/');
        if (proj.length != 2) return;

        let auth = proj[0], name = proj[1];

        if (!(auth in this.projects)) {
            this.projects[auth] = {};

            Component.make('div', {
                context: this.projects[auth],
                parent: this.$main,
                children: [
                    (auth == 'AlexGyver') ? null : {
                        tag: 'span',
                        text: auth,
                        class: 'author',
                    },
                    {
                        tag: 'div',
                        class: 'projects',
                        var: 'root',
                    }
                ]
            });
        }

        if (name in this.projects[auth]) return;
        this.projects[auth][name] = {};
        let manifest = `https://raw.githubusercontent.com/${auth}/${name}/main/project.json`;

        let pjson;
        try {
            pjson = await fetch(manifest, { cache: "no-store" });
            pjson = await pjson.json();
        } catch (e) {
            console.log(e);
            return;
        }

        let proj_cont = Component.make('div', {
            context: this,
            parent: this.projects[auth]['$root'],
            class: 'project',
            children: [
                {
                    tag: 'span',
                    class: 'project_title',
                    children: [
                        {
                            tag: 'a',
                            title: pjson.about ?? '',
                            html: pjson.name,
                            class: 'project_label',
                            href: `https://github.com/${auth}/${name}`,
                            target: '_blank',
                        },
                        {
                            tag: 'sup',
                            style: 'padding-left: 2px',
                            text: `v${pjson.version}`,
                            title: pjson.notes ?? '',
                        }
                    ]
                },
                {
                    tag: 'div',
                    class: 'icon down',
                    events: {
                        click: () => this.projects[auth][name]['$button'].click(),
                    },
                }
            ]
        });

        Component.make('esp-web-install-button', {
            context: this.projects[auth][name],
            parent: proj_cont,
            style: 'display:none',
            attrs: {
                manifest: manifest,
            },
            child: {
                tag: 'button',
                slot: 'activate',
                var: 'button',
            }
        });
    }

    projects = {};
}