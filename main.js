const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,

    songs: [{
            name: 'Mượn Rượu Tỏ Tình',
            singer: 'BigDaddy - Emily',
            path: './assets/music/song1.mp3',
            image: './assets/image/image1.jpg'
        },
        {
            name: 'Cảm Giác Lúc Ấy Sẽ Ra Sao',
            singer: 'Lou Hoàng',
            path: './assets/music/song2.mp3',
            image: './assets/image/image2.jpg'
        },
        {
            name: 'Hãy Ra Khỏi Người Đó Đi',
            singer: 'Phan Mạnh Quỳnh',
            path: './assets/music/song3.mp3',
            image: './assets/image/image3.jpg'
        },
        {
            name: 'Trên Tình Bạn Dưới Tình Yêu',
            singer: 'Min',
            path: './assets/music/song4.mp3',
            image: './assets/image/image4.jpg'
        },
        {
            name: 'Mình Yêu Nhau Đi',
            singer: 'Bích Phương',
            path: './assets/music/song5.mp3',
            image: './assets/image/image5.jpg'
        }
    ],

    method: {
        removeActive: function(index) {
            if(app.listSongs[index].classList.contains('active')) {
                app.listSongs[index].classList.remove('active');
            }
        },
        addActive: function(index) {
            app.listSongs[index].classList.add('active');
        }
    },

    start: function() {
        this.defineProperties();
        this.render();
        this.loadCurrtentSong();
        this.handleEvent();
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
        Object.defineProperty(this,'listSongs',{
            get: function() {
                return $$('.song');
            }
        })
    },

    loadCurrtentSong: function() {
        this.method.addActive(this.currentIndex);
        heading.innerHTML = this.currentSong.name;
        cdthumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;
    },

    nextSong: function() {
        this.method.removeActive(this.currentIndex);
        this.currentIndex++;
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
        this.loadCurrtentSong();
    },

    preSong: function() {
        this.method.removeActive(this.currentIndex);
        this.currentIndex--;
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length-1;
        }
        this.loadCurrtentSong();
    },

    randomSong: function() {
        this.method.removeActive(this.currentIndex);
        while(true) {
            let value = Math.floor(Math.random()*this.songs.length);
            if(value != this.currentIndex) {
                this.currentIndex = value;
                break;
            }
        }
        this.loadCurrtentSong();
    },

    render: function() {
        const htmls = this.songs.map(function(song) {
            return `
            <div class="song">
                <div class="thumb" style="background-image: url(${song.image})">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `;
        });
        $('.playlist').innerHTML = htmls.join(' ');
    },

    handleEvent: function() {
            // Xử lý CD quay tròn
        const cdThumbAnimate = cdthumb.animate([
            { transform : 'rotate(360deg)' }
        ], {
            duration: 20000,
            iterations: Infinity,
        });
        cdThumbAnimate.pause();
        
            // Xử lý phóng to, thu nhỏ
        const cdWidth = cd.offsetWidth;
        document.onscroll = () => {
            const scrollTop = window.scrollY;
            const newWidth = (cdWidth > scrollTop) ? (cdWidth - scrollTop) : 0;
            cd.style.width = newWidth + 'px';
            cd.style.opacity = newWidth / cdWidth;
        }
            // Xử lý phát lại nhạc
        btnRepeat.onclick = function() {
            app.isRepeat = !app.isRepeat;
            btnRepeat.classList.toggle('active');
        }

            // Xử lý khi click lùi lại]
        btnPrev.onclick = function() {
            app.preSong();
            audio.play();
        }
            // Xử lý khi click play
        btnPlay.onclick = function() {
            if (app.isPlaying == false) {
                cdThumbAnimate.play();
                audio.play();

            } else {
                cdThumbAnimate.pause();
                audio.pause();
            }
        }
            // Xử lý khi click bài kế tiếp
        btnNext.onclick = function() {
            if(app.isRandom) {
                app.randomSong();
            }
            else {
                app.nextSong();
            }
            cdThumbAnimate.play();
            audio.play();
        }
            // Xử lý khi click bài ranmdom
        btnRandom.onclick = function() {
            app.isRandom = !app.isRandom;
            btnRandom.classList.toggle('active');
        }

        audio.onplay = function() {
            player.classList.add('playing');
            app.isPlaying = true;
        }

        audio.onpause = function() {
            app.isPlaying = false;
            player.classList.remove('playing');
        }

        let timeE1 = 0, timeE2 = 0;
        var intervalId;
        var i = 0;
        audio.ontimeupdate = function(e1) {
            timeE1 = e1.timeStamp;
            progress.onchange = (e2) => {
                timeE2 = e2.timeStamp;
                const rate = progress.value / progress.max;
                audio.currentTime = rate*audio.duration;
            }
            progress.onmousedown = function(e) {
                intervalId = setInterval(function(){
                }, 10);
            };
            progress.onmouseup = function() {
                clearInterval(intervalId);
                i = 0;
            }
            if(Math.abs(timeE1-timeE2) > 2000 && i === 0) {
                const progressPercent = audio.currentTime / audio.duration * 100;
                if(!isNaN(progressPercent)) {
                    progress.value = progressPercent;
                }
            }  
        }
        
        audio.onended = function() {
            if(app.isRepeat) {
                cdThumbAnimate.play();
                audio.play();
            }
            else {
                btnNext.click();
            }
        }
            // Xử lý khi click playlist
        const listSongs = this.listSongs;
        listSongs.forEach(function(song,index) {
            song.addEventListener('click',(e) => {
            // loại bỏ active
                app.method.removeActive(app.currentIndex);
            // thay đổi bài hát
                app.currentIndex = index;
                app.loadCurrtentSong();
                cdThumbAnimate.play();
                audio.play();
            // set active
                app.method.addActive(app.currentIndex);
            });
        });
    }
};

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const audio = $('#audio');
const heading = $('header h2');
const cdthumb = $('.cd-thumb');
const cd = $('.cd');
const player = $('.player');

const btnRepeat = $('.btn.btn-repeat');
const btnPrev = $('.btn.btn-prev');
const btnPlay = $('.btn.btn-toggle-play');
const btnNext = $('.btn.btn-next');
const btnRandom = $('.btn.btn-random');
const progress = $('#progress');

app.start();

