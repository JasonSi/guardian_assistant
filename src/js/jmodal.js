((global, undefined) => {
    /**
     * A class to build a pop-up box for translation.
     *
     * @class
     */
    class JModal {

        /**
         * Constructor
         *
         * @param {node} container
         */
        constructor(container) {
            this.container = container;
            this._initUI();
        }

        _initUI() {
            const header = "扇贝单词翻译";
            const footer = "Powered by Shanbay.";
            let modal = `
              <div class="jmodal-container">
                <header class="jmodal-header">${header}</header>
                <div class="jmodal-content">
                233
                </div>
                <footer class="jmodal-footer">${footer}</footer>
              </div>
            `
            this.container.insertAdjacentHTML('beforeend', modal);

        }

        _queryWord(word) {
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "https://api.shanbay.com/bdc/search/?word=" + word, true);
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 4) {
                    console.log(JSON.parse(xhr.responseText));
                }
            }
            xhr.send();
        }

        popup(word) {
            this._queryWord(word)
        }

    }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = JModal;
    } else {
        global.JModal = JModal;
    }

})(typeof window !== 'undefined' ? window : this);
