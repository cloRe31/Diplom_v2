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
    let activeIndex = 0;
    let timer;
    const INTERVAL = 8000;

    function showSlide(newIndex){
        slides[activeIndex].classList.remove('hero-slide--active');
        controls[activeIndex].classList.remove('hero-progress--active');
        activeIndex = newIndex;
        slides[activeIndex].classList.add('hero-slide--active');
        controls[activeIndex].classList.add('hero-progress--active');
    }

    function startAutoPlay(){
        clearInterval(timer);
        timer = setInterval(() => {
            const nextIndex = (activeIndex + 1) % slides.length;
            showSlide(nextIndex);
        }, INTERVAL);
    }

    controls.forEach((control, index) => {
        control.addEventListener('click', () => {
            showSlide(index);
            startAutoPlay();
        });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    startAutoPlay();

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
