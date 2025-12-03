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

    const posterTabs = Array.from(document.querySelectorAll('[data-poster-tab]'));
    const posterCard = document.querySelector('[data-poster-card]');
    const posterMedia = posterCard?.querySelector('[data-poster-media]');
    const posterTag = posterCard?.querySelector('[data-poster-tag]');
    const posterDates = posterCard?.querySelector('[data-poster-dates]');
    const posterTitle = posterCard?.querySelector('[data-poster-title]');
    const posterDescription = posterCard?.querySelector('[data-poster-description]');
    const posterCta = posterCard?.querySelector('.poster-card__cta');

    const posterContent = {
        november: {
            tag: 'Премьера',
            dates: '1 – 9 ноября',
            title: 'ЦСКА — СКА',
            description: 'Центральная игра сезона молодежной хоккейной лиги не оставит никого равнодушным!',
            image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1200&q=80',
            ctaLabel: 'Купить билеты',
            ctaHref: 'mailto:admin@aarena.ru?subject=Билеты ЦСКА - СКА (демо)'
        },
        december: {
            tag: 'Семейное шоу',
            dates: '15 – 24 декабря',
            title: 'Ледяная сказка',
            description: 'Новогоднее шоу с интерактивом для детей и закулисными турами после спектакля.',
            image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80',
            ctaLabel: 'Забронировать места',
            ctaHref: 'mailto:admin@aarena.ru?subject=Новогоднее шоу (демо)'
        },
        february: {
            tag: 'Турнир',
            dates: '10 – 18 февраля',
            title: 'Кубок Aarena U16',
            description: 'Международный юношеский турнир, мастер-классы от наставников и открытые тренировки.',
            image: 'https://images.unsplash.com/photo-1498372479350-9a4010c9e311?auto=format&fit=crop&w=1200&q=80',
            ctaLabel: 'Подать заявку на участие',
            ctaHref: 'mailto:admin@aarena.ru?subject=Кубок Aarena U16 (демо)'
        }
    };

    function renderPoster(key){
        const data = posterContent[key];
        if(!data || !posterCard){
            return;
        }

        posterTabs.forEach((tab) => {
            const isActive = tab.dataset.posterTab === key;
            tab.classList.toggle('poster-tabs__button--active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        if(posterMedia){
            posterMedia.style.backgroundImage = data.image ? `url(${data.image})` : '';
        }
        if(posterTag){
            posterTag.textContent = data.tag;
        }
        if(posterDates){
            posterDates.textContent = data.dates;
        }
        if(posterTitle){
            posterTitle.textContent = data.title;
        }
        if(posterDescription){
            posterDescription.textContent = data.description;
        }
        if(posterCta){
            posterCta.textContent = data.ctaLabel;
            posterCta.setAttribute('href', data.ctaHref);
        }
    }

    posterTabs.forEach((tab) => {
        tab.addEventListener('click', () => renderPoster(tab.dataset.posterTab));
    });

    if(posterTabs.length){
        renderPoster(posterTabs.find((tab) => tab.classList.contains('poster-tabs__button--active'))?.dataset.posterTab || posterTabs[0].dataset.posterTab);
    }

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
