import keys from './keys.js';

export default class Keyboard {
    constructor() {
        this.elements = {
            main: null,
            keysContainer: null,
            keys: keys
        }
        
    }

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');
        
        this.elements.main.classList.add('keyboard');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this.createKeys());

        this.elements.main.append(this.elements.keysContainer);
        document.body.append(this.elements.main);
    }

    createKeys() {
        const fragment = document.createDocumentFragment();
        this.elements.keys.forEach((key, i) => {
            const keyElement = document.createElement('button');
            const insertLineBreak = [13, 26, 39, 50].filter(item => item === i);

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key.valueENG) {
                case "Backspace":
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.textContent = key.valueENG;
                    break;

                case "Caps":
                    keyElement.classList.add("keyboard__key_wide", "keyboard__key_activatable");
                    keyElement.textContent = key.valueENG
                    break;

                case "Enter":
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.textContent = key.valueENG
                    break;

                case "Shift":
                    keyElement.classList.add("keyboard__key_wide");
                    keyElement.textContent = key.valueENG
                    break;

                case "space":
                    keyElement.classList.add("keyboard__key_extra-wide");

                    break;

                default:
                    keyElement.textContent = key.valueENG.toLowerCase();

                    break;
            }

            fragment.append(keyElement);

            if (insertLineBreak.length) {
                fragment.appendChild(document.createElement("br"));
            }
        });

        return fragment;
    }

    triggerEvent(handlerName) {
        console.log("triggerEvent - handlerName - ", handlerName);
    }

    toggleCapsLock() {
        console.log("capsLock");
    }


}