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
            this.lastX = 0;
            this.lastY = 0;
            this.lastTop = 0;
            this._initUI();
            this._initListener();
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

        _initListener() {
            window.addEventListener('resize', () => {
                this._destroyModal();
            });
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
                        this._refreshPosition();
                    }
                }
            };
            xhr.onerror = () => {
                this._renderSimpleText("请求超时...");
            };
            xhr.send();
        }

        _renderSimpleText(content) {
            let html = `<div class="jmodal-word" aria-label="content">${content}</div>`;
            this.contentDiv.innerHTML = html;
        }

        _calcPosition() {
            let relativeX = this.lastX,
                relativeY = this.lastY;
            let x = 0,
                y = 0;
            const PopupMargin = 15;

            // FIXME: the screenHeight should exclude the paginator's height
            let currentTop = this.lastTop,
                modalHeight = this.modalDiv.clientHeight,
                modalWidth = this.modalDiv.clientWidth,
                screenHeight = document.documentElement.clientHeight,
                screenWidth = document.documentElement.clientWidth;

            if (relativeY + modalHeight + PopupMargin <= screenHeight) {
                y = currentTop + relativeY + PopupMargin;
            } else if (modalHeight + PopupMargin <= relativeY) {
                y = currentTop + relativeY - modalHeight - PopupMargin;
            } else {
                // fallback to middle
                y = currentTop + (screenHeight - modalHeight) / 2;
            }

            if (relativeX + modalWidth + PopupMargin <= screenWidth) {
                x = relativeX + PopupMargin;
            } else if (modalWidth + PopupMargin <= relativeX) {
                x = relativeX - modalWidth - PopupMargin;
            } else {
                x = (screenWidth - modalWidth) / 2;
            }

            return { x, y };
        }

        _popupModal() {
            this._renderSimpleText("正在查询...");
            this._refreshPosition();
            this.modalDiv.style.display = 'block';
        }

        _refreshPosition() {
            let { x, y } = this._calcPosition();
            this.modalDiv.style.transform = `translate(${x}px, ${y}px)`;
        }

        // Fill out the content when requested successfully
        _fillContent(json) {
            if (json.status_code === 0) {
                // SUCCESS
                let data = json.data;
                let def = data.definition.split("\n").join('<br>');
                let imgSrc = chrome.runtime.getURL("images/speaker3.png");
                let content = `
                    <div class="jmodal-word" aria-label="content">${data.content}</div>
                    <div class="jmodal-def" aria-label="definition"><label>释义</label><p>${def}<p></div>
                    <div class="jmodal-pron" aria-label="pronunciations">
                        <label>读音</label>
                        <div class="jmodal-pron-audio">
                            <audio src="${url2https(data.us_audio)}"></audio>
                            <img src="${imgSrc}"> US: [${data.pronunciations.us}]
                        </div>
                        <div class="jmodal-pron-audio">
                            <audio src="${url2https(data.uk_audio)}"></audio>
                            <img src="${imgSrc}"> UK: [${data.pronunciations.uk}]
                        </div>
                    </div>
                `;
                this.contentDiv.innerHTML = content;
                this._addSpeakerListener();

            } else if (json.status_code === 1) {
                // Invalid word
                let res = json.msg.replace('未找到单词:', '未查询到结果:');
                this._renderSimpleText(res);

            } else {
                // Maybe some other errors
                this._renderSimpleText("未知错误");
            }
        }

        _addSpeakerListener() {
            let speakers = this.modalDiv.querySelectorAll('.jmodal-pron-audio');

            speakers.forEach((ele) => {
                let audio = ele.querySelector('audio');
                let img = ele.querySelector('img');
                img.addEventListener('click', () => {
                    audio.play();
                });
            });
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
            this.lastX = x;
            this.lastY = y;
            this.lastTop = document.body.scrollTop;
            this._queryWord(word);
            this._popupModal();
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
