import { save } from "./core.js";

export const defineComponent = (name, factory) => {
    customElements.define(name, class extends HTMLElement {
        connectedCallback() {
            factory(save(this));
        }
    });
};
