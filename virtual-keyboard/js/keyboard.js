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
            language: null
        }
    }

    init() {
        this.properties.language = 'ENG';

        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');
        
        this.elements.main.classList.add('keyboard', 'keyboard_hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this.createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        this.elements.main.append(this.elements.keysContainer);
        document.body.append(this.elements.main);

        this.keyboardInput = document.querySelector('.keyboard-input');

        this.keyboardInput.addEventListener('keyup', () => {
            console.log('this.keyboardInput.value - ', this.keyboardInput.value);
            //String.fromCharCode(e.keyCode)
            this.properties.value = this.keyboardInput.value;
        });

        this.keyboardInput.addEventListener('focus', () => {
            this.open(this.keyboardInput.value, currentValue => {
                this.keyboardInput.value = currentValue;
                console.log("currentValue - ", currentValue);
                this.keyboardInput.focus();
            });
        });
    }

    createKeys() {
        const fragment = document.createDocumentFragment();
        keys.forEach((key, i) => {
            const keyElement = document.createElement('button');
            const insertLineBreak = [13, 26, 39, 50].filter(item => item === i);

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key.valueENG) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key_wide');
                    keyElement.textContent = key.valueENG;

                    keyElement.addEventListener('click', () => {
                        let position = this.keyboardInput.selectionStart;
                        let text = this.keyboardInput.value;
                        this.properties.value = text.slice(0, position-1) + text.slice(position, text.length);
                        this.triggerEvent('oninput');
                        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position-1;
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
                        let keypress = '\n';
                        this.input(keypress);
                    });
                    break;
                //TODO
                case 'Shift':
                    keyElement.classList.add('keyboard__key_wide', 'keyboard__key_activatable');
                    keyElement.textContent = key.valueENG;
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key_extra-wide');
                    keyElement.addEventListener('click', () => {
                        let keypress = ' ';
                        this.input(keypress);
                    });
                    break;

                case 'done':
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        this.close();
                        this.triggerEvent('onclose');
                    });
                    break;

                case 'en/ru':
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        this.toggleLanguage();
                    });
                    break;
                case '→':
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        let position = this.keyboardInput.selectionStart;
                        this.keyboardInput.focus();
                        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position + 1;

                    });
                    break;
                case '←':
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        let position = this.keyboardInput.selectionStart;
                        this.keyboardInput.focus();
                        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position - 1;
                    });
                    break;
                default:
                    keyElement.textContent = key.valueENG.toLowerCase();
                    keyElement.addEventListener('click', () => {
                        let keypress = this.properties.capsLock ? key[`value${this.properties.language}`].toUpperCase() : key[`value${this.properties.language}`].toLowerCase();
                        this.input(keypress);
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

    input(key) {
        let position = this.keyboardInput.selectionStart;
        let text = this.keyboardInput.value;
        this.properties.value = text.slice(0, position) + key + text.slice(position);
        this.triggerEvent('oninput');
        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position + 1;
    }

    toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        
        this.elements.keys.forEach(key => {
            if (key.textContent.length === 1) {
                key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
            }
        });
    }

    toggleLanguage() {
        this.properties.language = this.properties.language === 'ENG' ? 'RU' : 'ENG';
        console.log(this.properties.language);

        this.elements.keys.forEach((key, i) => {
            if (key.textContent.length === 1) {
                key.textContent = keys[i][`value${this.properties.language}`];
            }
        });
        this.properties.capsLock = !this.properties.capsLock;
        this.toggleCapsLock();
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