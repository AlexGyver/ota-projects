import { Component } from '@alexgyver/component';
import "esp-web-tools/dist/web/install-button";

const projects_list = 'https://raw.githubusercontent.com/AlexGyver/ota-projects/main/projects.txt';

export default class App {
    constructor() {
        this.load();
    }

    async load() {
        Component.make('div', {
            parent: document.body,
            context: this,
            class: 'main',
            children: [
                {
                    tag: 'div',
                    class: 'header',
                    text: 'AlexGyver OTA',
                },
                {
                    tag: 'div',
                    class: 'projects',
                    var: 'projects',
                }
            ]
        });

        let projects = await fetch(projects_list, { cache: "no-store" });
        projects = await projects.text();
        projects = projects.split(/\r?\n/);

        for (let proj of projects) {
            Component.make('div', {
                context: this,
                parent: this.$projects,
                var: proj,
                class: 'project',
                children: [
                    {
                        tag: 'span',
                        class: 'project_label',
                        text: proj,
                        events: {
                            click: () => window.open('https://github.com/AlexGyver/' + proj),
                        },
                    },
                    {
                        tag: 'div',
                        class: 'icon down',
                        events: {
                            click: () => this['$' + proj + '_btn'].click(),
                        },
                    }
                ]
            });

            Component.make('esp-web-install-button', {
                context: this,
                parent: document.body,
                style: 'display:none',
                attrs: {
                    manifest: 'https://raw.githubusercontent.com/AlexGyver/' + proj + '/main/project.json',
                },
                child: {
                    tag: 'button',
                    slot: 'activate',
                    var: proj + '_btn',
                }
            });
        }
    }
}