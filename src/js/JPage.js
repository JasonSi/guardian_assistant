((global, undefined) => {
    /**
     * A class to build pagination buttons and make it under control.
     *
     * @class
     */
    class JPage {

        /**
         * Constructor
         *
         * @param {node} btnContainer The pagination buttons container DOM Node.
         * @param {number} PageCount As it's name.
         */
        constructor(btnContainer, pageCount, currentPage = 1) {
            this.btnContainer = btnContainer;
            this.pageCount = pageCount;
            this.currentPage = currentPage;
            this._initTasks();
        }

        _initTasks() {
            this._initUI();
            this._initListener();
        }

        _initUI() {
            let homeBtn = '<div class="jpage-home" role="button" aria-label="Home Page">&lt;&lt;</div>',
                prevBtn = '<div class="jpage-prev" role="button" aria-label="Previous Page">&lt;</div>',
                nextBtn = '<div class="jpage-next" role="button" aria-label="Next Page">&gt;</div>',
                endBtn = '<div class="jpage-end" role="button" aria-label="End Page">&gt;&gt;</div>',
                pagesBtn = '<div class="jpage-indexes-container"></div>';

            let container = '<div class="jpage-container">' +
                homeBtn + prevBtn + pagesBtn + nextBtn + endBtn +
                '</div>';
            this.btnContainer.innerHTML = container;

            this._initAttr();
            this._refreshIndexes();
            this._refreshUI();
        }

        _initAttr() {
            this.indexesContainer = this.btnContainer.querySelector('.jpage-indexes-container');
            this.homeBtn = this.btnContainer.querySelector('.jpage-home');
            this.prevBtn = this.btnContainer.querySelector('.jpage-prev');
            this.nextBtn = this.btnContainer.querySelector('.jpage-next');
            this.endBtn = this.btnContainer.querySelector('.jpage-end');
        }

        _refreshIndexes() {
            let indexBtns = '';
            for (let i = 0; i < this.pageCount; i++) {
                indexBtns += `<div class="jpage-index" data-index="${i + 1}" role="button" aria-label="Page ${i + 1}">${i + 1}</div>`;
            }
            this.indexesContainer.innerHTML = indexBtns;
        }

        _initListener() {
            this.prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this._jumpPage(this.currentPage - 1);
                } else if (this.currentPage === 1) {
                    this._jumpPage(1);
                }
            });

            this.nextBtn.addEventListener('click', () => {
                if (this.currentPage < this.pageCount) {
                    this._jumpPage(this.currentPage + 1);
                }
            });

            this.homeBtn.addEventListener('click', () => {
                if (this.currentPage !== 1) {
                    this._jumpPage(1);
                }
            });

            this.endBtn.addEventListener('click', () => {
                if (this.currentPage !== this.pageCount) {
                    this._jumpPage(this.pageCount);
                }
            });

            this.indexesContainer.addEventListener('click', (e) => {
                // Manual Event Delegation
                let target = e.target;
                while (!target.className.split(' ').includes('jpage-index') && target !== this.indexesContainer) {
                    target = target.parentNode;
                }
                if (target.className.split(' ').indexOf('jpage-index') !== -1) {
                    let tIndex = parseInt(target.getAttribute("data-index"));
                    this._jumpPage(tIndex);
                }
            });
        }

        _jumpPage(num) {
            this.currentPage = num;
            this._refreshUI();

            // Trigger the callback
            this._onchange(num);
        }


        _refreshUI() {
            let active = ' jpage-active';
            let indexes = this.indexesContainer.querySelectorAll('.jpage-index');
            indexes.forEach((e) => {
                let dataIndex = parseInt(e.getAttribute('data-index'));
                if (dataIndex === this.currentPage) {
                    if (!e.className.includes(active)) {
                        e.className += active;

                        // Center the active index
                        let eOffset = (dataIndex - 0.5) * e.clientWidth;
                        e.parentNode.scrollLeft = eOffset - 0.5 * e.parentNode.clientWidth;
                    }
                } else {
                    if (e.className.includes(active)) {
                        e.className = e.className.replace(active, '');
                    }
                }
            });
        }

        /**
         * Store the callback on the currentPage's change.
         *
         * @param {string} cb callback
         */
        onchange(cb) {
            this._onchange = cb;
        }

        setCurrentPage(cPage) {
            this.currentPage = cPage;
            this._refreshUI();
        }

        setPageCount(pCount) {
            this.pageCount = pCount;
            this._refreshIndexes();
            this._refreshUI();
        }

    }

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = JPage;
    } else {
        global.JPage = JPage;
    }

})(typeof window !== 'undefined' ? window : this);
