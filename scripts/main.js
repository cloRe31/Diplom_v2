(function(){
    const header = document.getElementById('siteHeader');
    let lastY = window.scrollY;

    function handleScroll(){
        const current = window.scrollY;
        if(current <= 10){
            header.classList.add('site-header--transparent');
            header.classList.remove('site-header--solid', 'site-header--hidden');
        }else{
            header.classList.remove('site-header--transparent');
            header.classList.add('site-header--solid');
            if(current > lastY){
                header.classList.add('site-header--hidden');
            }else{
                header.classList.remove('site-header--hidden');
            }
        }
        lastY = current;
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const controls = Array.from(document.querySelectorAll('[data-hero-progress]'));
    const videos = slides.map((slide) => slide.querySelector('video'));
    const fills = controls.map((control) => control.querySelector('.hero-progress__fill'));
    let activeIndex = 0;
    let progressFrame;
    let timer;
    const DEFAULT_INTERVAL = 8000;

    function showSlide(newIndex){
        cancelAnimationFrame(progressFrame);
        clearTimeout(timer);

        const previousFill = fills[activeIndex];
        const previousVideo = videos[activeIndex];

        slides[activeIndex].classList.remove('hero-slide--active');
        controls[activeIndex].classList.remove('hero-progress--active');

        if(previousFill){
            previousFill.style.width = '0%';
        }

        if(previousVideo){
            previousVideo.currentTime = 0;
            previousVideo.pause();
        }

        activeIndex = newIndex;

        const currentSlide = slides[activeIndex];
        const currentControl = controls[activeIndex];
        const currentVideo = videos[activeIndex];

        currentSlide.classList.add('hero-slide--active');
        currentControl.classList.add('hero-progress--active');

        currentVideo?.play?.().catch(() => {});

        const fill = fills[activeIndex];
        const updateFill = () => {
            if(!fill || !currentVideo || !currentVideo.duration || Number.isNaN(currentVideo.duration)){
                progressFrame = requestAnimationFrame(updateFill);
                return;
            }

            const progress = (currentVideo.currentTime / currentVideo.duration) * 100;
            fill.style.width = `${Math.min(Math.max(progress, 0), 100)}%`;
            progressFrame = requestAnimationFrame(updateFill);
        };

        progressFrame = requestAnimationFrame(updateFill);

        const scheduleNext = () => {
            if(videos[activeIndex] !== currentVideo){
                return;
            }

            if(!currentVideo || !currentVideo.duration || Number.isNaN(currentVideo.duration)){
                timer = setTimeout(() => showSlide((activeIndex + 1) % slides.length), DEFAULT_INTERVAL);
                return;
            }

            const remainingMs = Math.max((currentVideo.duration - currentVideo.currentTime) * 1000, 300);
            timer = setTimeout(() => showSlide((activeIndex + 1) % slides.length), remainingMs);
        };

        if(currentVideo){
            if(currentVideo.readyState >= 1){
                scheduleNext();
            }else{
                currentVideo.addEventListener('loadedmetadata', scheduleNext, { once: true });
            }
        }else{
            timer = setTimeout(() => showSlide((activeIndex + 1) % slides.length), DEFAULT_INTERVAL);
        }
    }

    controls.forEach((control, index) => {
        control.addEventListener('click', () => {
            showSlide(index);
        });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    showSlide(0);

    document.querySelectorAll('[data-carousel]').forEach((carousel) => {
        const track = carousel.querySelector('[data-carousel-track]');
        if(!track){
            return;
        }

        const prevBtn = carousel.querySelector('[data-carousel-prev]');
        const nextBtn = carousel.querySelector('[data-carousel-next]');
        const cards = Array.from(track.querySelectorAll('[data-carousel-card]'));

        const getGap = () => {
            const styles = window.getComputedStyle(track);
            return parseFloat(styles.gap || '0') || 0;
        };

        const getStep = () => {
            if(!cards.length){
                return track.clientWidth;
            }
            return cards[0].offsetWidth + getGap();
        };

        function scrollTrack(direction){
            track.scrollBy({
                left: getStep() * direction,
                behavior: 'smooth'
            });
        }

        prevBtn?.addEventListener('click', () => scrollTrack(-1));
        nextBtn?.addEventListener('click', () => scrollTrack(1));
    });

})();
