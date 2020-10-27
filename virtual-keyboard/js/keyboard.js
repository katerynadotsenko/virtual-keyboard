import keys from './keys.js';

export default class Keyboard {
    constructor() {
        this.elements = {
            main: null,
            keyboardInput: null,
            keysContainer: null,
            keys: []
        };

        this.eventHandlers = {
            oninput: null,
            onclose: null
        };

        this.properties = {
            value: '',
            capsLock: false,
            shift: false,
            language: 'ENG'
        }
    }

    init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');
        
        this.elements.main.classList.add('keyboard');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this.createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        this.elements.main.append(this.elements.keysContainer);
        document.body.append(this.elements.main);

        this.keyboardInput = document.querySelector('.keyboard-input');

        this.keyboardInput.focus();

        this.keyboardInput.addEventListener('focus', () => {
            this.open(this.keyboardInput.value, currentValue => {
                this.keyboardInput.value = currentValue;
                this.keyboardInput.focus();
            });
        });
    }

    createKeys() {
        const fragment = document.createDocumentFragment();
        keys.forEach((key, i) => {
            const keyElement = document.createElement('button');
            const insertLineBreak = [14, 27, 40, 51].filter(item => item === i);

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key.valueENG) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key_wide');
                    keyElement.textContent = key.valueENG;

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.slice(0, this.properties.value.length - 1);
                        this.triggerEvent('oninput');
                      });
                    break;

                case 'Caps':
                    keyElement.classList.add('keyboard__key_wide', 'keyboard__key_activatable');
                    keyElement.textContent = key.valueENG;

                    keyElement.addEventListener('click', () => {
                        this.toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key_active', this.properties.capsLock);
                      });
                    break;

                case 'Enter':
                    keyElement.classList.add('keyboard__key_wide');
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this.triggerEvent('oninput');
                    });
                    break;

                case 'Shift':
                    keyElement.classList.add('keyboard__key_wide', 'keyboard__key_activatable');
                    keyElement.textContent = key.valueENG;
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key_extra-wide');
                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this.triggerEvent('oninput');
                    });
                    break;

                case 'done':
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        this.close();
                        this.triggerEvent('onclose');
                    });
                    break;

                default:
                    keyElement.textContent = key.valueENG.toLowerCase();
                    keyElement.addEventListener('click', () => {
                        this.properties.value += this.properties.capsLock ? key.valueENG.toUpperCase() : key.valueENG.toLowerCase();
                        this.triggerEvent('oninput');
                    });
                    break;
            }

            fragment.append(keyElement);

            if (insertLineBreak.length) {
                fragment.appendChild(document.createElement('br'));
            }
        });

        return fragment;
    }

    toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        
        this.elements.keys.forEach(key => {
            if (key.textContent.length === 1) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        });
    }

    triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
          this.eventHandlers[handlerName](this.properties.value);
        }
      }

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard_hidden');
    }

    close() {
        this.properties.value = '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard_hidden');
      }

}