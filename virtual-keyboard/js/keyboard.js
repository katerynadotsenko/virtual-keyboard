import keys from './keys.js';

window.SpeechRecognition =  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true;

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
            language: null,
            mute: false,
            recognition: false
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

        this.keyboardInput.addEventListener('keyup', (e) => {
            let keyElement = '';
            switch (e.code) {
                case 'CapsLock':
                    keyElement = document.querySelector(`[data-key=${e.code}]`);
                    keyElement.classList.toggle('keyboard__key_press');
                    break;

                case 'ShiftLeft':
                    this.toggleShift();
                    keyElement = document.querySelector(`[data-key=${e.code}]`);
                    keyElement.classList.toggle('keyboard__key_active', this.properties.shift);
                    keyElement.classList.toggle('keyboard__key_press');
                    break;

                default:
                    break;
            }
        });

        this.keyboardInput.addEventListener('keydown', (e) => {
            let keyElement = '';
            switch (e.code) {
                case 'CapsLock':
                    if (!e.repeat) {
                        this.toggleCapsLock();
                        keyElement = document.querySelector(`[data-key=${e.code}]`);
                        keyElement.classList.toggle('keyboard__key_active', this.properties.capsLock);
                        keyElement.classList.toggle('keyboard__key_press');
                    }
                    break;

                case 'ShiftLeft':
                    if (!e.repeat) {
                        this.toggleShift();
                        keyElement = document.querySelector(`[data-key=${e.code}]`);
                        keyElement.classList.toggle('keyboard__key_active', this.properties.shift);
                        keyElement.classList.toggle('keyboard__key_press');
                    }
                    break;

                default:
                    this.elements.keys.forEach(key => {
                        if (key.dataset.key === e.code) {
                            key.classList.add('keyboard__key_press');
                            setTimeout(() => {
                                key.classList.remove('keyboard__key_press');
                            }, 150);
                        }
                    });
                    this.properties.value = this.keyboardInput.value;
                    break;
            }
            
        });

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
            const insertLineBreak = [13, 26, 39, 50].filter(item => item === i);

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key.valueENG) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key_wide');
                    keyElement.textContent = key.valueENG;
                    keyElement.dataset.key = 'Backspace';

                    keyElement.addEventListener('click', () => {
                        this.setSound('backspace');

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
                    keyElement.dataset.key = 'CapsLock';

                    keyElement.addEventListener('click', () => {
                        this.setSound('caps');

                        this.toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key_active', this.properties.capsLock);
                        this.keyboardInput.focus();
                      });
                    break;

                case 'Enter':
                    keyElement.classList.add('keyboard__key_wide');
                    keyElement.textContent = key.valueENG;
                    keyElement.dataset.key = 'Enter';

                    keyElement.addEventListener('click', () => {
                        this.setSound('enter');

                        let keypress = '\n';
                        this.input(keypress);
                    });
                    break;

                case 'Shift':
                    keyElement.classList.add('keyboard__key_wide', 'keyboard__key_activatable');
                    keyElement.textContent = key.valueENG;
                    keyElement.dataset.key = 'ShiftLeft';
                    keyElement.addEventListener('click', () => {
                        this.setSound('shift');

                        this.toggleShift();
                        keyElement.classList.toggle('keyboard__key_active', this.properties.shift);
                        this.keyboardInput.focus();
                      });
                    break;

                case 'space':
                    keyElement.classList.add('keyboard__key_extra-wide');
                    keyElement.dataset.key = 'Space';

                    keyElement.addEventListener('click', () => {
                        this.setSound('space');

                        let keypress = ' ';
                        this.input(keypress);
                    });
                    break;

                case 'done':
                    keyElement.classList.add('keyboard__key_wide');
                    keyElement.textContent = key.valueENG;
                    keyElement.addEventListener('click', () => {
                        this.setSound('main');

                        this.close();
                        this.triggerEvent('onclose');
                    });
                    break;

                case 'en/ru':
                    keyElement.classList.add('keyboard__key_wide', 'keyboard__key_double');
                    keyElement.innerHTML = `<span class='keyboard__key_active-text'>en</span><span>ru</span>`

                    keyElement.addEventListener('click', () => {
                        this.setSound('main');

                        this.toggleLanguage();
                        this.keyboardInput.focus();
                    });
                    break;

                case '→':
                    keyElement.textContent = key.valueENG;
                    keyElement.dataset.key = 'ArrowRight';

                    keyElement.addEventListener('click', () => {
                        this.setSound('main');

                        let position = this.keyboardInput.selectionStart;
                        this.keyboardInput.focus();
                        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position + 1;

                    });
                    break;

                case '←':
                    keyElement.textContent = key.valueENG;
                    keyElement.dataset.key = 'ArrowLeft';

                    keyElement.addEventListener('click', () => {
                        this.setSound('main');

                        let position = this.keyboardInput.selectionStart;
                        this.keyboardInput.focus();
                        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position - 1;
                    });
                    break;
                
                case 'mute':
                    keyElement.innerHTML = `<span class="material-icons">volume_up</span>`;

                    keyElement.addEventListener('click', () => {
                        this.setSound('main');

                        this.toggleSound(keyElement);
                        this.keyboardInput.focus();
                    });
                    break;

                case 'recognition':
                keyElement.innerHTML = `<span class="material-icons">voice_over_off</span>`;
                keyElement.dataset.key = 'recognition';

                keyElement.addEventListener('click', () => {
                    this.recognition(keyElement);
                    this.keyboardInput.focus();
                });
                break;

                default:
                    keyElement.textContent = key.valueENG.toLowerCase();
                    if (key.keycode) {
                        keyElement.dataset.key = key.keycode;
                    } else {
                        keyElement.dataset.key = `Key${key.valueENG.toUpperCase()}`;
                    }
                    keyElement.addEventListener('click', () => {
                        this.setSound('main');

                        let keypress = '';

                        if(this.properties.shift && keys[i][`shiftValue${this.properties.language}`]) {
                            keypress = keys[i][`shiftValue${this.properties.language}`];
                        } else {
                            keypress = (this.properties.shift && !this.properties.capsLock) || (!this.properties.shift && this.properties.capsLock) 
                                        ? key[`value${this.properties.language}`].toUpperCase() 
                                        : key[`value${this.properties.language}`].toLowerCase();
                        }
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

    setSound(key) {
        if (this.properties.mute) {
            return;
        }
        const audio = document.querySelector(`audio[data-key="${this.properties.language.toLowerCase()}-${key}"]`);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }

    recognition(keyElement) {
        keyElement = keyElement ? keyElement : document.querySelector('[data-key="recognition"]');

        this.properties.recognition = !this.properties.recognition;
        recognition.lang = this.properties.language === 'ENG' ? 'en-US' : 'ru-RU';
        const previousValue = this.properties.value;

        if (this.properties.recognition) {
            const rec = document.createElement('span');
            rec.classList.add('rec');
            keyElement.innerHTML = `<span class="material-icons">record_voice_over</span>`;
            keyElement.append(rec);
            rec.animate([
                { background: '#fff' }
              ], {
                duration: 400,
                iterations: Infinity,
                direction: 'alternate-reverse'
              })
            recognition.start();
            let transcript = '';

            recognition.addEventListener('result', (e) => {
                transcript = Array.from(e.results).map(result => result[0]).map(result => result.transcript).join('') + ' ';
                this.properties.value = previousValue + ' ' + transcript;
                this.triggerEvent('oninput');
            });
           
        } else {
            keyElement.innerHTML = `<span class="material-icons">voice_over_off</span>`;
            recognition.stop();
        }
    }

    input(key) {
        let position = this.keyboardInput.selectionStart;
        let text = this.keyboardInput.value;
        this.properties.value = text.slice(0, position) + key + text.slice(position);
        this.triggerEvent('oninput');
        this.keyboardInput.selectionStart = this.keyboardInput.selectionEnd = position + 1;
    }

    toggleSound(keyElement) {
        this.properties.mute = !this.properties.mute;
        keyElement.innerHTML = this.properties.mute ? `<span class="material-icons">volume_off</span>` : `<span class="material-icons">volume_up</span>`;
    }

    toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;
        
        this.elements.keys.forEach(key => {
            if (key.textContent.length === 1) {
                key.textContent = (this.properties.capsLock && !this.properties.shift) || (!this.properties.capsLock && this.properties.shift) 
                                        ? key.textContent.toUpperCase() 
                                        : key.textContent.toLowerCase();
            }
        });
    }

    toggleShift() {
        this.properties.shift = !this.properties.shift;
        
        this.elements.keys.forEach((key, i) => {
            if (key.textContent.length === 1) {
                if(keys[i][`shiftValue${this.properties.language}`]) {
                    key.textContent = this.properties.shift ? keys[i][`shiftValue${this.properties.language}`] : keys[i][`value${this.properties.language}`];
                } else {
                    key.textContent = (this.properties.shift && !this.properties.capsLock) || (!this.properties.shift && this.properties.capsLock) 
                                        ? key.textContent.toUpperCase() 
                                        : key.textContent.toLowerCase();
                }
            }
        });
    }

    toggleLanguage() {
        const keyboardKeyDouble = document.querySelectorAll('.keyboard__key_double span');

        keyboardKeyDouble.forEach(item => {
            item.classList.toggle('keyboard__key_active-text');
        });

        this.properties.language = this.properties.language === 'ENG' ? 'RU' : 'ENG';

        if (this.properties.recognition) {
            recognition.abort();
            setTimeout(() => {
                this.properties.recognition = !this.properties.recognition;
                this.recognition();
            }, 100);
            
        }

        this.elements.keys.forEach((key, i) => {
            if (key.textContent.length === 1) {
                key.textContent = this.properties.shift && keys[i][`shiftValue${this.properties.language}`] 
                                    ? keys[i][`shiftValue${this.properties.language}`] 
                                    : keys[i][`value${this.properties.language}`];
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