((global, undefined) => {
    let shanbayTranslator = () => {

        /**
         * A simple implement for get words from clicking the page.
         *
         * @param {node} elem the word direct parent node.
         * @param {number} x the word's position of X.
         * @param {number} y the word's position of Y.
         */

        let getWordAtPoint = (elem, x, y) => {
            if (elem.nodeType == elem.TEXT_NODE) {
                let range = elem.ownerDocument.createRange();
                range.selectNodeContents(elem);
                let currentPos = 0;
                let endPos = range.endOffset;
                while (currentPos + 1 < endPos) {
                    range.setStart(elem, currentPos);
                    range.setEnd(elem, currentPos + 1);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                        range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.expand("word");
                        let ret = range.toString();
                        range.detach();
                        return (ret.trim());
                    }
                    currentPos += 1;
                }
            } else {
                for (let i = 0; i < elem.childNodes.length; i++) {
                    let range = elem.childNodes[i].ownerDocument.createRange();
                    range.selectNodeContents(elem.childNodes[i]);
                    if (range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right >= x &&
                        range.getBoundingClientRect().top <= y && range.getBoundingClientRect().bottom >= y) {
                        range.detach();
                        return (getWordAtPoint(elem.childNodes[i], x, y));
                    } else {
                        range.detach();
                    }
                }
            }
            return (null);
        }

        let JModal = require('./jmodal');
        let container = document.querySelector('.pure-container');
        let jmodal = new JModal(container);

        let article = document.querySelector('.pure-content');
        article.addEventListener('click', (e) => {
            let word = getWordAtPoint(e.target, e.x, e.y);
            if (word) {
                console.log(word);
                jmodal.popup(word);
            }
        })
    }


    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = shanbayTranslator;
    } else {
        global.shanbayTranslator = shanbayTranslator;
    }

})(typeof window !== 'undefined' ? window : this);
