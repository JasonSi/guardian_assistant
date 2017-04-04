((global, undefined) => {

    // Simple transform for url from http to https, due to the Content Security Policy
    let url2https = (url) => {
        if (typeof url !== 'string') return '';

        if (/^https:/.test(url)) {
            return url;
        } else if (/^http:/.test(url)) {
            return url.replace(/^http:/, 'https:');
        } else {
            return 'https://' + url;
        }
    }
    
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
            const header = "单词翻译";
            const footer = "Powered by Shanbay.";
            let modal = `
                <div class="jmodal-container">
                    <header class="jmodal-header">${header}</header>
                    <div class="jmodal-content"></div>
                    <footer class="jmodal-footer">${footer}</footer>
                </div>
            `
            this.container.insertAdjacentHTML('beforeend', modal);
            this.modalDiv = this.container.querySelector('.jmodal-container');
            this.contentDiv = this.container.querySelector('.jmodal-content');
        }

        _queryWord(word) {
            if (this.xhr) {
                // Abort the former xhr
                this.xhr.abort();
            }
            let xhr = new XMLHttpRequest();
            this.xhr = xhr;
            xhr.open("GET", "https://api.shanbay.com/bdc/search/?word=" + word, true);
            xhr.onreadystatechange = () => {
                if (xhr.readyState == 4) {
                    // console.log(typeof xhr.responseText);
                    // console.log(JSON.parse(xhr.responseText || '{}'));
                    if (xhr.responseText) {
                        let json = JSON.parse(xhr.responseText);
                        console.log(json);
                        this._fillContent(json);
                    }
                };
            };
            xhr.send();
        }

        _refreshModal() {
            this.modalDiv.style.display = 'block';
        }

        _fillContent(json) {
            if (json.status_code === 0) {
                // SUCCESS
                let data = json.data;
                let content = `
                    <dl>
                        <dt>单词</dt><dd>${data.content}</dd>
                        <dt>定义</dt><dd>${data.definition}</dd>
                        <dt>发音</dt>
                            <dd>
                                <audio class="jmodal-pron-uk" src="${url2https(data.us_audio)}"></audio>
                                <audio class="jmodal-pron-uk" src="${url2https(data.uk_audio)}"></audio>
                                <dt>美式</dt><dd>${data.pronunciations.us}</dd>
                                <dt>英式</dt><dd>${data.pronunciations.uk}</dd>
                            </dd>
                    </dl>
                `
                this.contentDiv.innerHTML = content;
            } else if (json.status_code === 1) {
                // Invalid word
            } else {
                // Maybe some other errors
            }
        }

        _destroyModal() {
            this.modalDiv.style.display = 'none';
            this.contentDiv.innerHTML = '';
        }

        _hideModal() {
            this.modalDiv.style.display = 'none';
        }

        popup(word) {
            this._queryWord(word);
            this._refreshModal();
        }

        hide() {
            this._destroyModal();
        }

    }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = JModal;
    } else {
        global.JModal = JModal;
    }

})(typeof window !== 'undefined' ? window : this);
