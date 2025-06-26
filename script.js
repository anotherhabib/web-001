document.addEventListener('DOMContentLoaded', () => {
    function initializeSplashScreen() {
        const splashScreen = document.getElementById('splash-screen');
        const openSurpriseBtn = document.getElementById('open-surprise-btn');
        const appContent = document.getElementById('app-content');

        if (typeof config !== 'undefined') {
            document.getElementById('splash-title').textContent = `Hai ${config.recipientName}, Ada Pesan Spesial Untukmu`;
        }
    
        openSurpriseBtn.addEventListener('click', () => {
            splashScreen.classList.add('hidden');
            setTimeout(() => {
                splashScreen.style.display = 'none';
                appContent.classList.add('visible');
                
                initializeMusicPlayer();
                initializeGallery();
                initializeLetterModal();
                initializeTruthOrDareGame(); 
                initializePhotobox();
                initializePuzzleGame();
                initializeTimeCapsule();
            }, 800);
        });
    }

    function initializeMusicPlayer() {
        const music = document.getElementById('background-music');
        const musicToggleButton = document.getElementById('music-toggle-btn');
        const musicIconPlay = document.getElementById('music-icon-play');
        const musicIconPause = document.getElementById('music-icon-pause');
        const musicStatusText = document.getElementById('music-status');
        let isPlaying = false;
        
        if (typeof config !== 'undefined') {
            music.src = config.music;
        }
        
        function playMusic() {
            const playPromise = music.play();
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    isPlaying = true;
                }).catch(() => {
                    isPlaying = false;
                }).finally(() => {
                    updateMusicButton(isPlaying);
                });
            }
        }

        function updateMusicButton(playing) {
            musicIconPlay.style.display = playing ? 'none' : 'block';
            musicIconPause.style.display = playing ? 'block' : 'none';
            musicStatusText.textContent = playing ? 'Jeda Musik' : 'Putar Musik';
        }

        musicToggleButton.addEventListener('click', () => {
            isPlaying ? music.pause() : music.play();
            isPlaying = !isPlaying;
            updateMusicButton(isPlaying);
        });

        playMusic();
    }

    function initializeGallery() {
        const photos = config.photos;
        if (!photos || photos.length === 0) {
            return;
        }

        let currentIndex = 0;
        const mainPhoto = document.getElementById('main-photo');
        const photoDescription = document.getElementById('photo-description');
        const photoDate = document.getElementById('photo-date');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const photoIndicators = document.getElementById('photo-indicators');
        const thumbnailGallery = document.getElementById('thumbnail-gallery');

        function updateMainPhoto() {
            mainPhoto.classList.add('fade-out');
            setTimeout(() => {
                const photo = photos[currentIndex];
                if(photo) {
                    mainPhoto.src = photo.url;
                    mainPhoto.alt = photo.description;
                    photoDescription.textContent = photo.description;
                    photoDate.textContent = photo.date;
                    mainPhoto.onload = () => mainPhoto.classList.remove('fade-out');
                    updateIndicators();
                    updateThumbnails();
                }
            }, 400);
        }

        function updateIndicators() {
            photoIndicators.innerHTML = '';
            photos.forEach((_, index) => {
                const dot = document.createElement('div');
                dot.className = 'indicator-dot';
                if (index === currentIndex) {
                    dot.classList.add('active');
                }
                dot.addEventListener('click', () => {
                    currentIndex = index;
                    updateMainPhoto();
                });
                photoIndicators.appendChild(dot);
            });
        }

        function updateThumbnails() {
            thumbnailGallery.innerHTML = '';
            photos.forEach((photo, index) => {
                const item = document.createElement('div');
                item.className = 'thumbnail-item';
                if (index === currentIndex) {
                    item.classList.add('active');
                }
                item.innerHTML = `
                    <div class="thumbnail-aspect-ratio">
                        <img src="${photo.url}" alt="${photo.description}" class="thumbnail-img" loading="lazy">
                        <div class="thumbnail-overlay"></div>
                    </div>
                    <div class="thumbnail-date-tooltip">${photo.date}</div>
                `;
                item.addEventListener('click', () => {
                    currentIndex = index;
                    updateMainPhoto();
                });
                thumbnailGallery.appendChild(item);
            });
        }

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + photos.length) % photos.length;
            updateMainPhoto();
        });

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % photos.length;
            updateMainPhoto();
        });
        
        updateMainPhoto();
    }

    function initializeLetterModal() {
        const loveLetterBtn = document.getElementById('love-letter-btn');
        const loveLetterModal = document.getElementById('love-letter-modal');
        const loveLetterCloseBtn = document.getElementById('love-letter-close-btn');

        if (typeof config !== 'undefined' && config.loveLetter) {
            document.getElementById('letter-title').textContent = config.loveLetter.title;
            document.getElementById('letter-p1').textContent = config.loveLetter.p1;
            document.getElementById('letter-p2').textContent = config.loveLetter.p2;
            document.getElementById('letter-p3').textContent = config.loveLetter.p3;
            document.getElementById('letter-signature').innerHTML = config.loveLetter.signature;
        }

        loveLetterBtn.addEventListener('click', () => loveLetterModal.classList.add('active'));
        loveLetterCloseBtn.addEventListener('click', () => loveLetterModal.classList.remove('active'));
        loveLetterModal.addEventListener('click', (e) => {
            if (e.target === loveLetterModal) {
                loveLetterModal.classList.remove('active');
            }
        });
    }

    function initializeTruthOrDareGame() {
        const todLauncher = document.getElementById('tod-launcher');
        const gameModal = document.getElementById('game-modal-tod');
        const gameCloseBtn = document.getElementById('game-tod-close-btn');
        const questionDisplay = document.getElementById('game-question-display');
        const truthBtn = document.getElementById('truth-btn');
        const dareBtn = document.getElementById('dare-btn');

        let truths = [];
        let dares = [];

        fetch('assets/truth_or_dare.csv')
            .then(response => response.text())
            .then(csvText => {
                Papa.parse(csvText, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        results.data.forEach(row => {
                            if (row.tipe === 'truth') {
                                truths.push(row.pertanyaan);
                            } else if (row.tipe === 'dare') {
                                dares.push(row.pertanyaan);
                            }
                        });
                    }
                });
            });

        todLauncher.addEventListener('click', () => gameModal.classList.add('active'));
        gameCloseBtn.addEventListener('click', () => gameModal.classList.remove('active'));
        gameModal.addEventListener('click', (e) => {
            if (e.target === gameModal) {
                gameModal.classList.remove('active');
            }
        });
        
        truthBtn.addEventListener('click', () => {
            if (truths.length > 0) {
                questionDisplay.textContent = truths[Math.floor(Math.random() * truths.length)];
            }
        });

        dareBtn.addEventListener('click', () => {
            if (dares.length > 0) {
                questionDisplay.textContent = dares[Math.floor(Math.random() * dares.length)];
            }
        });
    }

    function initializePhotobox() {
        const launcher = document.getElementById('photobox-launcher');
        if (!launcher) {
            return;
        }

        const modal = document.getElementById('photobox-modal');
        const closeBtn = document.getElementById('photobox-close-btn');
        const mainView = document.getElementById('photobox-main-view');
        const resultView = document.getElementById('photobox-result-view');
        const video = document.getElementById('photobox-video');
        const captureBtn = document.getElementById('photobox-capture-btn');
        const instructions = document.getElementById('photobox-instructions');
        const thumbnailsDiv = document.getElementById('photobox-thumbnails');
        const finalCanvas = document.getElementById('photobox-final-canvas');
        const downloadBtn = document.getElementById('photobox-download-btn');
        const retakeBtn = document.getElementById('photobox-retake-btn');

        let stream;
        let capturedPhotos = [];
        const MAX_PHOTOS = 3;

        async function startCamera() {
            try {
                if (stream) {
                    stream.getTracks().forEach(track => track.stop());
                }
                stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
                video.srcObject = stream;
            } catch (err) {
                if (err.name === 'NotAllowedError') {
                    instructions.textContent = "Izin akses kamera ditolak. Mohon periksa pengaturan browser Anda.";
                } else {
                    instructions.textContent = "Kamera tidak ditemukan atau terjadi error.";
                }
                captureBtn.disabled = true;
            }
        }

        function stopCamera() {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        }

        function resetPhotobox() {
            capturedPhotos = [];
            thumbnailsDiv.innerHTML = '';
            resultView.classList.add('hidden');
            mainView.classList.remove('hidden');
            captureBtn.disabled = false;
            instructions.textContent = 'Posisikan wajahmu, lalu ambil 3 foto!';
            startCamera();
        }

        // ===================================================================
        // ==================== PERBAIKAN DIMULAI DI SINI ====================
        // ===================================================================
        captureBtn.addEventListener('click', () => {
            if (capturedPhotos.length >= MAX_PHOTOS) {
                return;
            }
        
            const helperCanvas = document.createElement('canvas');
            const { videoWidth, videoHeight } = video;
        
            const aspectRatio = videoWidth / videoHeight;
            const MAX_DIMENSION = 1080;
            
            let captureWidth, captureHeight;
        
            if (videoWidth >= videoHeight) {
                captureWidth = Math.min(videoWidth, MAX_DIMENSION);
                captureHeight = captureWidth / aspectRatio;
            } else {
                captureHeight = Math.min(videoHeight, MAX_DIMENSION);
                captureWidth = captureHeight * aspectRatio;
            }
        
            helperCanvas.width = captureWidth;
            helperCanvas.height = captureHeight;
            
            const context = helperCanvas.getContext('2d');
            context.translate(helperCanvas.width, 0);
            context.scale(-1, 1);
            context.drawImage(video, 0, 0, helperCanvas.width, helperCanvas.height);
            
            const dataUrl = helperCanvas.toDataURL('image/jpeg', 0.9);
            capturedPhotos.push(dataUrl);
        
            const img = document.createElement('img');
            img.src = dataUrl;
            img.classList.add('photobox-thumbnail');
            thumbnailsDiv.appendChild(img);
        
            const count = capturedPhotos.length;
            instructions.textContent = count < MAX_PHOTOS ? `Bagus! Ambil ${MAX_PHOTOS - count} foto lagi.` : 'Mantap! Sedang membuat hasil...';
            
            if (count === MAX_PHOTOS) {
                captureBtn.disabled = true;
                setTimeout(generatePhotobox, 1000);
            }
        });
        // ===================================================================
        // ===================== PERBAIKAN  ==================================
        // ===================================================================

        function generatePhotobox() {
            stopCamera();
            mainView.classList.add('hidden');
            resultView.classList.remove('hidden');
            const ctx = finalCanvas.getContext('2d');
            const stripWidth = 500, photoMargin = 25, photoGap = 25;
            
            // Perbaikan logika generate agar mengikuti aspect ratio yang benar
            const tempImg = new Image();
            tempImg.src = capturedPhotos[0];
            tempImg.onload = () => {
                const realAspectRatio = tempImg.naturalWidth / tempImg.naturalHeight;
                const photoWidthInStrip = stripWidth - (photoMargin * 2);
                const photoHeightInStrip = photoWidthInStrip / realAspectRatio;
                const textHeight = 60;
                finalCanvas.width = stripWidth;
                finalCanvas.height = (photoMargin * 2) + (photoHeightInStrip * 3) + (photoGap * 2) + textHeight;
                ctx.fillStyle = '#F8C8DC';
                ctx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                let loadedImages = 0;
                capturedPhotos.forEach((dataUrl, index) => {
                    const img = new Image();
                    img.src = dataUrl;
                    img.onload = () => {
                        const yPos = photoMargin + (index * (photoHeightInStrip + photoGap));
                        ctx.fillStyle = 'white';
                        ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
                        ctx.shadowBlur = 10;
                        ctx.fillRect(photoMargin - 4, yPos - 4, photoWidthInStrip + 8, photoHeightInStrip + 8);
                        ctx.shadowColor = 'transparent';
                        ctx.drawImage(img, photoMargin, yPos, photoWidthInStrip, photoHeightInStrip);
                        loadedImages++;
                        if (loadedImages === MAX_PHOTOS) {
                            const today = new Date().toLocaleDateString('id-ID', {
                                day: 'numeric', month: 'long', year: 'numeric'
                            });
                            ctx.font = 'bold 22px Quicksand';
                            ctx.fillStyle = 'rgba(45, 27, 105, 0.8)';
                            ctx.textAlign = 'center';
                            const textY = finalCanvas.height - 30;
                            ctx.fillText(today, finalCanvas.width / 2, textY);
                            downloadBtn.href = finalCanvas.toDataURL('image/jpeg', 0.9);
                        }
                    };
                });
            };
        }

        launcher.addEventListener('click', () => {
            modal.classList.add('active');
            resetPhotobox();
        });
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            stopCamera();
        });
        retakeBtn.addEventListener('click', resetPhotobox);
    }

    function initializePuzzleGame() {
        const launcher = document.getElementById('puzzle-launcher');
        if (!launcher) {
            return;
        }
        const modal = document.getElementById('puzzle-modal');
        const closeBtn = document.getElementById('puzzle-close-btn');
        const board = document.getElementById('puzzle-board');
        const statusEl = document.getElementById('puzzle-status');

        const photosForPuzzle = (typeof config !== 'undefined' && config.photos) ? config.photos.slice(0, 5) : [];
        if (photosForPuzzle.length < 5) {
            launcher.classList.add('disabled');
            launcher.querySelector('p').textContent = "Galeri membutuhkan minimal 5 foto untuk game ini.";
            return;
        }

        let cardSources = [...photosForPuzzle, ...photosForPuzzle];
        let flippedCards = [];
        let matchedPairs = 0;
        let lockBoard = false;

        function shuffle(array) {
            array.sort(() => Math.random() - 0.5);
        }

        function createBoard() {
            shuffle(cardSources);
            board.innerHTML = '';
            statusEl.textContent = '';
            matchedPairs = 0;
            resetBoardState();
            cardSources.forEach(photo => {
                const card = document.createElement('div');
                card.classList.add('puzzle-card');
                card.dataset.photoId = photo.url;
                card.innerHTML = `<div class="puzzle-card-face puzzle-card-front">?</div><div class="puzzle-card-face puzzle-card-back"><img src="${photo.url}" alt="${photo.description}"></div>`;
                card.addEventListener('click', flipCard);
                board.appendChild(card);
            });
        }

        function flipCard() {
            if (lockBoard || this.classList.contains('is-flipped')) {
                return;
            }
            this.classList.add('is-flipped');
            flippedCards.push(this);
            if (flippedCards.length === 2) {
                checkForMatch();
            }
        }

        function checkForMatch() {
            lockBoard = true;
            const [cardOne, cardTwo] = flippedCards;
            if (cardOne.dataset.photoId === cardTwo.dataset.photoId) {
                matchedPairs++;
                resetBoardState();
                checkIfWon();
            } else {
                setTimeout(() => {
                    cardOne.classList.remove('is-flipped');
                    cardTwo.classList.remove('is-flipped');
                    resetBoardState();
                }, 1200);
            }
        }

        function resetBoardState() {
            flippedCards = [];
            lockBoard = false;
        }

        function checkIfWon() {
            if (matchedPairs === photosForPuzzle.length) {
                statusEl.textContent = "Hore! Kamu berhasil menemukan semua pasangan! 🎉";
            }
        }
        
        launcher.addEventListener('click', () => {
            if(launcher.classList.contains('disabled')) {
                return;
            }
            modal.classList.add('active');
            createBoard();
        });

        closeBtn.addEventListener('click', () => modal.classList.remove('active'));
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }

    function initializeTimeCapsule() {
        const launcher = document.getElementById('time-capsule-launcher');
        if (!launcher) return;

        const modal = document.getElementById('time-capsule-modal');
        const closeBtn = document.getElementById('time-capsule-close-btn');
        const titleEl = document.getElementById('capsule-title');
        const inputView = document.getElementById('capsule-input-view');
        const displayView = document.getElementById('capsule-display-view');
        const messageInput = document.getElementById('capsule-message-input');
        const dateInput = document.getElementById('capsule-date-input');
        const lockBtn = document.getElementById('capsule-lock-btn');
        const countdownView = document.getElementById('capsule-countdown-view');
        const messageView = document.getElementById('capsule-message-view');
        const daysEl = document.getElementById('countdown-days');
        const hoursEl = document.getElementById('countdown-hours');
        const minutesEl = document.getElementById('countdown-minutes');
        const secondsEl = document.getElementById('countdown-seconds');
        const messageEl = document.getElementById('capsule-message');
        const resetBtn = document.getElementById('capsule-reset-btn');
        const CAPSULE_KEY = 'timeCapsuleData';
        let countdownInterval;

        function renderState() {
            const savedData = JSON.parse(localStorage.getItem(CAPSULE_KEY));
            
            if (savedData) {
                inputView.classList.add('hidden');
                displayView.classList.remove('hidden');
                
                const unlockDate = new Date(savedData.unlockDate).getTime();
                titleEl.textContent = "Kapsul Waktu Terkunci";
                
                clearInterval(countdownInterval);
                countdownInterval = setInterval(() => {
                    const now = new Date().getTime();
                    const distance = unlockDate - now;

                    if (distance < 0) {
                        clearInterval(countdownInterval);
                        countdownView.classList.add('hidden');
                        messageView.classList.remove('hidden');
                        messageEl.textContent = savedData.message;
                        return;
                    }

                    countdownView.classList.remove('hidden');
                    messageView.classList.add('hidden');
                    daysEl.textContent = Math.floor(distance / (1000 * 60 * 60 * 24));
                    hoursEl.textContent = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    minutesEl.textContent = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    secondsEl.textContent = Math.floor((distance % (1000 * 60)) / 1000);
                }, 1000);
            } else {
                titleEl.textContent = "Buat Kapsul Waktu Baru";
                inputView.classList.remove('hidden');
                displayView.classList.add('hidden');
                clearInterval(countdownInterval);
            }
        }

        lockBtn.addEventListener('click', () => {
            const message = messageInput.value;
            const unlockDate = dateInput.value;

            if (!message || !unlockDate) {
                alert("Harap isi pesan dan tentukan tanggalnya!");
                return;
            }

            const dataToSave = {
                message: message,
                unlockDate: unlockDate
            };

            localStorage.setItem(CAPSULE_KEY, JSON.stringify(dataToSave));
            renderState();
        });

        resetBtn.addEventListener('click', () => {
            if (confirm("Apakah kamu yakin ingin mereset kapsul waktu ini? Pesan yang ada akan hilang.")) {
                localStorage.removeItem(CAPSULE_KEY);
                messageInput.value = '';
                dateInput.value = '';
                renderState();
            }
        });
        
        launcher.addEventListener('click', () => {
            modal.classList.add('active');
            renderState();
        });

        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            clearInterval(countdownInterval);
        });

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                clearInterval(countdownInterval);
            }
        });
    }

    initializeSplashScreen();
});