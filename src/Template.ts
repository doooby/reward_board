export default class Template {
    content: any; // Node or ParentNode ... who cares here

    constructor (template: HTMLTemplateElement) {
        this.content = template.content.cloneNode(true);
    }

    set (name: string, content: string) {
        const element = this.content.querySelector(`[data-value="${name}"]`);
        if (element) element.textContent = content;
    }

    insertInto (element: Element) {
        element.innerHTML = '';
        element.appendChild(this.content);
    }
}
