((global, undefined) => {
    let shanbayTranslator = () => {
        // do something
    }


    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = shanbayTranslator;
    } else {
        global.shanbayTranslator = shanbayTranslator;
    }

})(typeof window !== 'undefined' ? window : this);
