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
         * @param {string} btnContainer The pagination buttons container DOM Node.
         * @param {string} PageCount As it's name.
         */
        constructor(btnContainer, PageCount) {
            this.btnContainer = btnContainer;
            this.pageCount = PageCount;
            this.currentPage = 1; // TODO: get this value automatically
            this._initTasks();
        }

        _initTasks() {
            this._initUI();
            this._initListener();
        }

        _initUI() {
            let prevBtn = '<div class="jpage-prev">《</div>',
                nextBtn = '<div class="jpage-next">》</div>',
                pagesBtn = '<div class="jpage-indexes-container"></div>';

            let container = '<div class="jpage-container">' + prevBtn + pagesBtn + nextBtn + '</div>';
            this.btnContainer.innerHTML = container;

            this._initAttr();
            this._refreshIndexes();
        }

        _initAttr() {
            this.indexesContainer = this.btnContainer.querySelector('.jpage-indexes-container');
            this.prevBtn = this.btnContainer.querySelector('.jpage-prev');
            this.nextBtn = this.btnContainer.querySelector('.jpage-next');
        }

        _refreshIndexes() {
            let indexBtns = '';
            for (let i = 0; i < this.pageCount; i++) {
                indexBtns += `<div class="jpage-index" data-index="${i + 1}">${i + 1}</div>`;
            }
            this.indexesContainer.innerHTML = indexBtns;
        }

        _initListener() {
            this.prevBtn.addEventListener('click', () => {
                console.log('prev clicked:', this.currentPage, this.pageCount);
                if (this.currentPage > 1) {
                    this._jumpPage(this.currentPage - 1);
                } else if (this.currentPage === 1) {
                    this._jumpPage(1);
                }
            });

            this.nextBtn.addEventListener('click', () => {
                console.log('next clicked:', this.currentPage, this.pageCount);
                if (this.currentPage < this.pageCount) {
                    this._jumpPage(this.currentPage + 1);
                }
            });

            this.indexesContainer.addEventListener('click', (e) => {
                // Manual Event Delegation
                let target = e.target;
                while (!target.className.includes('jpage-index') && target !== this.indexesContainer) {
                    target = target.parentNode;
                }
                if (target.className.indexOf('jpage-index') !== -1) {
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
