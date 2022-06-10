const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const USER_STORAGE_KEY = "dvhuzg";

const cd = $(".cd");
const header = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const playingBtn = $(".player");
const progress = $("#progress");
const nextSong = $(".btn-next");
const prevSong = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const volume = $(".volume");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  isLike : false,
  config: JSON.parse(localStorage.getItem(USER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Song 1",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 2",
      singer: "DoHung",
      path: "./assets/music/2.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 3",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 4",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 5",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 6",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 6",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 6",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
    {
      name: "Song 6",
      singer: "DoHung",
      path: "./assets/music/1.mp3",
      image: "./assets/img/1.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    var htmls = this.songs.map((song, index) => {
      return `
            <div class="song ${
              index === this.currentIndex ? "active" : ""
            }" data-index = "${index}">
            <div
              class="thumb"
              style="
                background-image: url('${song.image}');
              "
            ></div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="heart" id="heart" data-index="${index}">
            <i class="fa-regular fa-heart"></i>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
            `;
    });
    $(".playlist").innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;
    document.onscroll = function () {
      const scrollTop = window.screenY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;
      cd.style.width = newCdWidth > 70 ? newCdWidth + "px" : 70;
      // cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xu ly CD quay / dung
    const cdThumbAnimate = cdThumb.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumbAnimate.pause();
    //Xu ly nut Play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };
    audio.onpause = function () {
      _this.isPlaying = false;
      playingBtn.classList.remove("playing");
      cdThumbAnimate.pause();
    };
    audio.onplay = function () {
      _this.isPlaying = true;
      playingBtn.classList.add("playing");
      cdThumbAnimate.play();
    };

    //tien do bai hat
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //Xu ly khi tua bai hat
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    //Xu ly next song
    nextSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActive();
    };
    prevSong.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActive();
    };

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextSong.click();
      }
    };
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode && !e.target.closest(".heart") && !e.target.closest(".option")) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
      if (e.target.closest(".heart")) {
        // if (e.target.closest(".heart")) {
        //   if (e.target.closest(".fa-regular.fa-heart")) {
        //     e.target.closest(".fa-heart").classList.remove("fa-regular");
        //     e.target.closest(".fa-heart").classList.add("fa-solid");
        //     e.target.closest(".heart").classList.add("active");
            
        //     _this.setConfig("isLike",true);
            
        //   } else if (e.target.closest(".fa-solid.fa-heart")) {
        //     e.target.closest(".fa-heart").classList.add("fa-regular");
        //     e.target.closest(".fa-heart").classList.remove("fa-solid");
        //     e.target.closest(".heart").classList.remove("active");
           
        //     _this.setConfig("isLike",false);
        //   }
        // }
        e.target.closest('.heart').classList.toggle('active');
      }
      if(e.target.closest('.option')){
        console.log(123);
      }
      // console.log($('.heart'));
    };
    volume.onclick = function () {
      audio.volume = volume.value / 100;
      // _this.setConfig("volume", audio.volume); 
      audio.volume = _this.volume;
    };
   
    document.onkeydown = (e) => {
      switch (e.keyCode) {
        case 32:
          e.preventDefault();
          playBtn.click();
          break;
      }
    };
  },
  scrollToActive: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  },
  loadCurrentSong: function () {
    header.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url("${this.currentSong.image}")`;
    audio.src = this.currentSong.path;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex == this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
    this.isLike=this.config.isLike;
    this.volume = this.config.volume;
  },
  start: function () {
    this.loadConfig();
    this.defineProperties();
    this.handleEvents();
    this.loadCurrentSong();
    this.render();
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
    // document.querySelectorAll('.heart').classList.toggle("active",this.isLike);

    
    volume.value = this.volume * 100;
  },
};
app.start();

