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
    };

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
            `;
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
                if (xhr.readyState === 4) {
                    if (xhr.responseText) {
                        let json = JSON.parse(xhr.responseText);
                        this._fillContent(json);
                    }
                }
            };
            xhr.onerror = ()=>{
                this._renderSimpleText("请求超时...");
            };
            xhr.send();
        }

        _renderSimpleText(content){
            let html = `<div class="jmodal-word" aria-label="content">${content}</div>`;
            this.contentDiv.innerHTML = html;
        }

        _calcPosition(relativeX, relativeY){
            console.log(relativeX, relativeY);
            let x = 0, y = 0;
            let currentTop = document.body.scrollTop;
            // TODO: calculate
            return {x, y};
        }

        _refreshModal(relativeX, relativeY) {
            this._renderSimpleText("正在查询...");

            // Locate and display it
            let {x, y} = this._calcPosition(relativeX, relativeY);
            this.modalDiv.style.transform = `translate(${x}px, ${y}px)`;

            this.modalDiv.style.display = 'block';
        }

        // Fill out the content when requested successfully
        _fillContent(json) {
            if (json.status_code === 0) {
                // SUCCESS
                let data = json.data;
                let def = data.definition.split("\n").join('<br>');
                let content = `
                    <div class="jmodal-word" aria-label="content">${data.content}</div>
                    <div class="jmodal-def" aria-label="definition"><label>释义</label><p>${def}<p></div>
                    <div class="jmodal-pron" aria-label="pronunciations">
                        <label>读音</label>
                        <audio class="jmodal-audio-us" src="${url2https(data.us_audio)}"></audio>
                        <audio class="jmodal-audio-uk" src="${url2https(data.uk_audio)}"></audio>
                        <div class="jmodal-pron-us">US: [${data.pronunciations.us}]</div>
                        <div class="jmodal-pron-uk">UK: [${data.pronunciations.uk}]</div>
                    </div>
                `;
                this.contentDiv.innerHTML = content;

            } else if (json.status_code === 1) {
                // Invalid word
                let res = json.msg.replace('未找到单词:', '未查询到结果:');
                this._renderSimpleText(res);

            } else {
                // Maybe some other errors
                this._renderSimpleText("未知错误");
            }
        }

        _destroyModal() {
            this.modalDiv.style.display = 'none';
            this.contentDiv.innerHTML = '';
        }

        _hideModal() {
            this.modalDiv.style.display = 'none';
        }

        popup(word, x, y) {
            // Somewhat risks: When the speed of network is faster than DOM thingy...
            this._queryWord(word);
            this._refreshModal(x, y);
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
