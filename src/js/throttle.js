((global, undefined) => {

    // A simple throttle to improve the performance
    let throttle = (func, wait, mustRun) => {
        let timeout,
            startTime = new Date();

        return () => {
            let context = this,
                args = arguments,
                currentTime = new Date();

            clearTimeout(timeout);
            // trigger the handler when time's out
            if (currentTime - startTime >= mustRun) {
                func.apply(context, args);
                startTime = currentTime;
            } else {
                // reset the timer if throttled
                timeout = setTimeout(func, wait);
            }
        };
    };

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = throttle;
    } else {
        global.throttle = throttle;
    }

})(typeof window !== 'undefined' ? window : this);
