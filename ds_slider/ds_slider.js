function DSS_start(sliderClassName, settings){

    // ===================== //
    // Стандартные настройки //
    // ===================== //

    // Лучше их не трогай пожалуйста //

    var defaultSettings = {

        autoPlaySlider: true,
        autoPlayDelay: 5000,
        autoPlayDirrection: "right",
        arrows: true,
        dots: true,
        dotsEffect: "dot-default",
        endlessSlider: true,
        transition: "ease-in-out",
        presentationMode: false, //its a experimental function. recommended off this parameter
        speedAnimation: 400,

    }

    var className = sliderClassName.slice(1, sliderClassName.length);

    // Проверка на наличие всех параметров слайдера, где в противном случае применяется стандартные параметры //
    
    if (settings === undefined){ settings = defaultSettings; }
    else{

        for (var defaultParameter in defaultSettings){

            if (settings[defaultParameter] === undefined || settings[defaultParameter] === null) { settings[defaultParameter] = defaultSettings[defaultParameter]; }

        }

    }

    // ======================= //
    // Вспомогательные функции //
    // ======================= //

    function throttle(func, delay) {

        let isThrottled = false,
            savedArgs,
            savedThis;
    
        return function wrapper() {
    
            if (isThrottled) {

                savedArgs = arguments;

                savedThis = this;

                return;

            }
    
            func.apply(this, arguments);
    
            isThrottled = true;
    
            setTimeout((function() {

                isThrottled = false;

                if (savedArgs) {

                    wrapper.apply(savedThis, savedArgs);

                    savedArgs = savedThis = null;

                }

            }), delay);

        }

    }

    // ============================================================================================================= //
    // Функция, отвечающая за подготовку галереи к работе и инициализация объектов путём присвайвания класса "slide" //
    // ============================================================================================================= //

    function preparingGallery(){

        // Перенос слайдов в родительский тег //

        let slideMigration = new function(){

            var track = document.createElement("div");
            var slide = document.querySelectorAll(sliderClassName + " > div");
            var countDivs = slide.length;
    
            track.className = className + "-track";
    
            for (let i = 0; i < countDivs; i++){
    
                track.append(slide[i]);
    
            }
    
            document.querySelectorAll(sliderClassName)[0].append(track);
    
        }; slideMigration;

        // Временные переменные, созданные для удобства //

        var container = document.querySelectorAll(sliderClassName)[0];
        var track = document.querySelectorAll(sliderClassName + "-track")[0];
        let items = track.childNodes;

        // Создание родительских тегов //

        let sliderWindow = document.createElement('div');
    
        sliderWindow.classList.add(className + "-container")

        track.before(sliderWindow); sliderWindow.append(track);

        // Настройка, отвечающая за безграничный скролл слайдера //
    
        switch(settings.endlessSlider){ 
    
            case true: track.prepend(items[items.length - 1].cloneNode(true)); 
                       track.append(items[1].cloneNode(true));
                       break;
    
            case false: break;
    
        }

        // Подготовка слайдов //
        
        function classIndent(items){

            for (let j = 0; j < items.length; j++){
                
                if(settings.endlessSlider === true){ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j - 1); }
                else{ items[j].classList.add("slide"); items[j].setAttribute("indexItem", j); }
            
            }
            
            switch(settings.endlessSlider){

                case true:  document.querySelector(sliderClassName + "-track").childNodes[1].classList.add("active");
                            track.style.transform = "translateX(-"+ (document.querySelectorAll(sliderClassName + "-track > div")[0].clientWidth) +"px)";
                            break;

                case false: document.querySelector(sliderClassName + "-track").firstChild.classList.add("active");
                            break;

            }
            
        }
    
        // Подготовка стрелочек к работе //
    
        function preparingButtons(){
    
            var slideRight = document.createElement("button");
            var slideLeft = document.createElement("button");
        
            slideRight.classList = "button"; slideRight.id = "right";
            slideLeft.classList = "button"; slideLeft.id = "left";
    
            container.append(slideRight); container.prepend(slideLeft);
        
        }
    
        // Подготовка индикации слайдера //
    
        switch(settings.dots){
    
            case true:
    
                function preparingDotsBar(){
    
                    let dotsBar = document.createElement("div");
            
                    dotsBar.classList = "dots-bar"; container.append(dotsBar);
            
                    // Генератор точек //
            
                    function dotsGenerator(){
            
                        let dotsBarContainer = document.querySelector(sliderClassName + " .dots-bar");
                        let countItems;

                        if (settings.endlessSlider === true){countItems = items.length - 2;} 
                        else { countItems = items.length; }

                        for (let i = 0; i < countItems; i++){
                    
                            let dot = document.createElement("div");
                    
                            dot.classList = "dot"; dot.setAttribute("indexItem", i);
                            dot.style.transition = settings.speedAnimation + "ms " + settings.transition;
        
                            dotsBarContainer.append(dot);
                    
                        }
            
                    }
            
                    dotsGenerator();
            
                }
            
                preparingDotsBar();

                document.querySelector(sliderClassName + " .dots-bar").firstChild.classList.add(settings.dotsEffect);
    
                break;
    
            case false: break;
    
        }

        let mainSlides = [];
        let allSlides = Array.from(document.querySelector(sliderClassName + "-track").childNodes);

        switch(settings.endlessSlider){

            case true:  mainSlides = allSlides.slice(1, allSlides.length - 1);
                        break;

            case false: mainSlides = allSlides;
                        break;

        }

        // Применение настроек стрелочек //

        switch(settings.arrows){ 
    
            case true: preparingButtons(); break;
            case false: break;
        
        }

        // Вызов функции подготовки слайдов //
        
        classIndent(items);

        // experimental, разделение галереи и предпросмотра эскизов на блоки //

        function elemBlocks(){

            // experimental, первый блок //

            let sliderBlock = Array.from(document.querySelectorAll(sliderClassName)[0].childNodes);
            
            let firstBlock = document.createElement("div");
            firstBlock.className = className + "-block";

            document.querySelector(sliderClassName).append(firstBlock);

            for (let i = 0; i < sliderBlock.length; i++){ firstBlock.append(sliderBlock[i]); }

            // experimental, второй блок //

            let mainItems;

            if (settings.endlessSlider === true) { 
                
                let mainItemsTemp = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes); 
                mainItems = mainItemsTemp.slice(1, mainItemsTemp.length - 1);

            } else {

                mainItems = Array.from(document.querySelectorAll(sliderClassName + "-track")[0].childNodes); 
                
            }

            if (settings.presentationMode == true && mainItems.length >= 3){

                let secondBlock = document.createElement("div");
                secondBlock.className = className + "-thumb-block";

                let sliderThumbCont = document.createElement("section"),
                    sliderThumb = document.createElement("div");

                sliderThumbCont.className = className + "-thumb-container";
                sliderThumb.className = className + "-thumb";

                for (let i = 0; i < mainSlides.length; i++){ 

                    mainThumbsSlide = mainSlides[i].cloneNode(true);

                    mainThumbsSlide.style.backgroundColor = getComputedStyle(mainSlides[i], true).backgroundColor;
                    mainThumbsSlide.style.backgroundClip = "content-box";

                    sliderThumb.append(mainThumbsSlide);

                }
                
                document.querySelectorAll(sliderClassName)[0].append(sliderThumbCont);
                sliderThumbCont.append(sliderThumb);

                var thumbnailDiv = document.querySelectorAll(sliderClassName + "-thumb > div");

                for (var slideIndex = 0; slideIndex < document.querySelectorAll(sliderClassName + "-thumb > div").length; slideIndex++){

                    thumbnailDiv[slideIndex].classList.add("slide-thumb");

                    let thumb = document.querySelectorAll(sliderClassName + " .slide-thumb")[slideIndex],
                        slide = document.querySelectorAll(sliderClassName + " .slide")[slideIndex];
                        k = parseFloat(getComputedStyle(thumb, true).height)/parseFloat(getComputedStyle(slide, true).height) - 0.05;
                        sizeText = parseFloat(window.getComputedStyle(thumb, null).getPropertyValue('font-size'));
                    thumb.style.fontSize = sizeText * k;

                }

                let thumbSlides = document.querySelectorAll(".slide-thumb");
                let thumbBlock = document.querySelectorAll("section" + sliderClassName + "-thumb-container")[0];

                for (let i = 0; i < thumbSlides.length; i++){ thumbSlides[i].setAttribute("indexItem", i); }

                document.querySelectorAll(sliderClassName)[0].append(secondBlock);
                secondBlock.append(thumbBlock);

                (Array.from(document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes)[0]).classList.remove("active");

                let mainSlide = document.querySelectorAll(sliderClassName + "-thumb-container .slide-thumb")[0];
                mainSlide.style.backgroundImage = "linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)";

            }

        } elemBlocks();

        // Возврат переменной, в которой находится трек слайдера //

        return track;
    
    }

    // Вызов функции и объявление переменной, отвечающей за трек слайдера //
    
    const sliderTrack = preparingGallery();

    // ========== //
    // Переменные //
    // ========== //
    
    var indexItem = 0,
        mainItems = Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide"));
    if (settings.dots === true){ var dots = Array.from(document.querySelector(sliderClassName + " .dots-bar").childNodes);}
    if (settings.presentationMode === true){ var thumbnails = document.querySelectorAll(sliderClassName + " .slide-thumb");}

    let isDelayed = false,
        targetSlide,
        currentSlide = document.querySelector(sliderClassName + "-track .slide.active").getAttribute("indexItem");

    if (settings.endlessSlider === true){
        mainItems = mainItems.slice(1, Array.from(document.querySelectorAll(sliderClassName + " " + sliderClassName +"-track .slide")).length - 1);
    }

    // ============================================ //
    // Функция, отвечающая за навигацию по слайдеру //
    // ============================================ //

    function sliderNavigation(){

        let countSlides = mainItems.length;

        // Если стрелочки включены, то они видимы и рабочие //

        if (settings.arrows === true){

            // Переменные, нужные для стрелочек //

            let left = document.querySelector(sliderClassName + " #left"),
                right = document.querySelector(sliderClassName + " #right");
            
            // ================================================ //
            // Автопрокрутка слайдера, когда стрелочки включены //
            // ================================================ //

            if(settings.autoPlaySlider === true){

                // Функция автопрокрутки при включённых стрелочках //

                function autoPlayWithArrows(){

                    if(isDelayed === false){ slideScroll(settings.autoPlayDirrection, countSlides, mainItems); }
    
                }

                // Зацикливание функции автопрокрутки /
    
                var autoPlayInterval = setInterval(autoPlayWithArrows, settings.autoPlayDelay); 

            }

            // Слайд влево //

            function slideLeft(){

                if (settings.autoPlaySlider === true){ clearInterval(autoPlayInterval); } // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
                
                if (isDelayed === false){

                    slideScroll(left.id, countSlides, mainItems);

                    setTimeout(() => {right.onclick = throttle(slideRight, settings.speedAnimation);}, settings.speedAnimation);
        
                    if (indexItem == 0 && settings.endlessSlider === false){
        
                        left.onclick = null;
        
                    }

                    if (settings.autoPlaySlider === true){ autoPlayInterval = setInterval(autoPlayWithArrows, settings.autoPlayDelay); } // Если включена автопрокрутка, то интервал запускается
        
                }

            }

            // Слайд вправо //
    
            function slideRight(){

                if (settings.autoPlaySlider === true){ clearInterval(autoPlayInterval); } // Если включена автопрокрутка, то интервал обнуляется для красивой работы слайдера
                
                if(isDelayed === false){
                
                    slideScroll(right.id, countSlides, mainItems);

                    setTimeout(() => {left.onclick = throttle(slideLeft, settings.speedAnimation);}, settings.speedAnimation);
        
                    if (indexItem == document.querySelectorAll(sliderClassName + "-track .slide").length - 1 && settings.endlessSlider === false){
        
                        right.onclick = null;
        
                    }

                    if (settings.autoPlaySlider === true){ autoPlayInterval = setInterval(autoPlayWithArrows, settings.autoPlayDelay); } // Если включена автопрокрутка, то интервал запускается

                }
    
            }
            
            // ================= //
            // События на кнопки //
            // ================= //

            left.onclick = throttle(slideLeft, settings.speedAnimation);
            right.onclick = throttle(slideRight, settings.speedAnimation);

        }

        // ============================================================== //
        // Зацикливание функции автопрокрутки, если стрелочки не включены //
        // ============================================================== //

        if (settings.autoPlaySlider === true && settings.arrows === false){

            setInterval((function(){

                slideScroll(settings.autoPlayDirrection, countSlides, items); ActiveSlide(items, countSlides, settings.autoPlayDirrection);

            }), settings.autoPlayDelay);

        }
        
    }

    if (settings.arrows === false && settings.autoPlaySlider === false){

        alert("Please turn on either autoplay or arrows");

    } else { 
        
        if (settings.autoPlayDelay < settings.speedAnimation) { alert("Please change the value of autoPlayDelay so that it is greater than speedAnimation"); }
        else{ sliderNavigation(); }

    }

    // ====================================== //
    // Запуск анимации пролистывания слайдера //
    // ====================================== //

    function slideScroll(direction, countSlides, items){

        if (direction == "left" && 
            ((indexItem > 0 && settings.endlessSlider === false) || 
            (indexItem >= 0 && settings.endlessSlider === true))){ 

                isDelayed = true;
                changeSlide(direction, countSlides, items); 
                setTimeout(()=>{isDelayed = false;}, settings.speedAnimation);

        } 

        else if (direction == "right" && 
                 ((indexItem < countSlides - 1 && settings.endlessSlider === false) || 
                 (indexItem < countSlides && settings.endlessSlider === true))){ 
                    
                    isDelayed = true;
                    changeSlide(direction, countSlides, items); 
                    setTimeout(()=>{isDelayed = false;}, settings.speedAnimation);
                
        }

    }

    // ============= //
    // Пролистование //
    // ============= //

    function scrollingSlide(direction, countSlides, items, width){

        sliderTrack.style.transition = `${settings.speedAnimation}ms ${settings.transition}`;

        if (Object.is("right", direction) === true){ indexItem++; } else { indexItem--;};

        currentSlide = indexItem;

        let offsetKoef;

        if (settings.endlessSlider === true){offsetKoef = indexItem + 1;}
        else {offsetKoef = indexItem;}

        sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        setTimeout((function(){

            sliderTrack.style.transition = null;
            
            if (Object.is("right", direction) === true){ 
                
                if (offsetKoef == countSlides + 1 && settings.endlessSlider === true){ indexItem = 0; offsetKoef = indexItem + 1; currentSlide = indexItem;}
        
            } else {

                if (offsetKoef == 0 && settings.endlessSlider === true){ indexItem = countSlides - 1; offsetKoef = countSlides; currentSlide = indexItem;}

            };

            sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        }), settings.speedAnimation);

        if (Object.is("right", direction) === true){

            if (offsetKoef == countSlides + 1 && settings.endlessSlider === true){ items[0].classList.add("active"); } 
            else { items[indexItem].classList.add("active"); };

        } else {

            if (offsetKoef == 0 && settings.endlessSlider === true){ items[countSlides - 1].classList.add("active"); } 
            else { items[indexItem].classList.add("active"); };

        }

    }

    // ==================== //
    // Функция смены слайда //
    // ==================== //

    function changeSlide(direction, countSlides, items){

        const slideWidth = items[0].clientWidth;
        let i = document.querySelectorAll(sliderClassName + "-track div.slide.active")[0].getAttribute("indexitem"); // Индекс активного слайда для корректной работы индикации

        items[indexItem].classList.remove("active");
    
        scrollingSlide(direction, countSlides, items, slideWidth);

        decorationAnim(dots, thumbnails, i);

    }

    // =========================== //
    // Анимация индикации слайдера //
    // =========================== //

    function decorationAnim(dots, thumbnails, index){

        if (settings.dots === true){

            dots[index].classList.remove(settings.dotsEffect);
                    
            dots[document.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].classList.add(settings.dotsEffect);

        }

        try{

            if (settings.presentationMode === true && document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length >= 3){

                thumbnails[index].style.backgroundImage = "none";
                    
                thumbnails[document.querySelector(sliderClassName + "-track div.slide.active").getAttribute("indexitem")].style.backgroundImage = "linear-gradient(to top, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)";

            }

        } catch (err) { }

    }

    // ---------------------- //
    // эксперементальные фичи //
    // ---------------------- //

    // режим презентации //

    function presentationMode(){

        const z = 9.5112702529; // константа для подгонки логарифмического графика к её касательной

        let thumbTrack = document.querySelectorAll(sliderClassName + "-thumb")[0];
        let thumbContainer = document.querySelectorAll(sliderClassName + "-thumb-container")[0];

        let thumbSlide = thumbTrack.firstChild,
            thumbSlides = thumbTrack.childNodes;

        let marginSlide = parseInt(getComputedStyle(thumbSlide, true).margin);

        let widthTrack = -1 * ((thumbSlide.clientWidth + 2 * marginSlide) * (thumbSlides.length - 3));

        let touch = false,
            isTouched = false,
            isDelayed = false;


        function logBase(x, y){
            return Math.log(y) / Math.log(x);
        }

        function logAnimGraphic(x){
            return Math.round((10*((logBase(2, x-z) ** 3)))** 0.5);
        }

        function touchUp(){

            isDelayed = true;
            touch = false;
            isTouched = false;

            let tt = thumbTrack.offsetLeft;

            if (tt >= 0){

                thumbTrack.style.transition = "ease-out" + ` ${settings.speedAnimation/2}ms`;
                thumbTrack.style.left = "0px";

            } else if (tt < widthTrack){

                thumbTrack.style.transition = "ease-out" + ` ${settings.speedAnimation/2}ms`;
                thumbTrack.style.left = `${-(thumbSlides.length - 3) * (thumbSlide.clientWidth + (marginSlide * 2))}`;

            }

            setTimeout((function() {

                thumbTrack.style.transition = "none";
                isDelayed = false;

            }), settings.speedAnimation/2);

        }

        var onMouseDown = (e) => {

            touch = true;
            isTouched = true;
            
            startPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2)) - thumbTrack.offsetLeft);
            startContPosX = ((e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2))); 

        };

        var onMouseMove = throttle((e) => { 

            e.preventDefault();
                
            if (touch === true && isDelayed === false){

                let mousePosX = e.pageX - ((window.innerWidth - thumbContainer.clientWidth)/2);

                if (logAnimGraphic(mousePosX - startPosX) >= 23){ thumbTrack.style.left = `${logAnimGraphic(mousePosX - startPosX)}px`; }
                else if ((mousePosX - startPosX) < 0 && -1 * (mousePosX - startPosX) + widthTrack >= 23){ 

                    thumbTrack.style.left = `${widthTrack - (logAnimGraphic(Math.abs((-1 * widthTrack) + (mousePosX - startPosX))))}px`; 

                }
                else { thumbTrack.style.left = `${mousePosX - startPosX}px`; }

            }

        }, (1/60) * 1000);

        var onMouseUp = () => {

            if(isDelayed === false){

                touchUp(); 

            }

        };

        thumbTrack.onmouseenter = thumbTrack.onmouseleave = throttle(function(event){

            event.preventDefault();

            if(event.type === "mouseenter" && isDelayed === false) {

                thumbTrack.addEventListener("mousedown", onMouseDown);
                thumbTrack.addEventListener("mousemove", onMouseMove);
                thumbTrack.addEventListener("mouseup", onMouseUp);

            }
            else if(event.type === "mouseleave" && isTouched === true && isDelayed === false){ touchUp(); }
            else { touch = false; isTouched = false; }

        }, (1/60) * 1000);

    }

    let PMerror = "Please, add slides for correctly working Presentation Mode \nCode error: "

    try{ if (settings.presentationMode === true && document.querySelectorAll(sliderClassName + "-thumb")[0].childNodes.length >= 3){ presentationMode();} }
    catch(e){ alert(PMerror + e);}

    // Навигация по точкам //

    function target(target, width){

        sliderTrack.style.transition = settings.speedAnimation + "ms " + settings.transition;

        var offsetKoef;
        
        if (settings.endlessSlider === false){offsetKoef = target;}
        else {offsetKoef = target+1;}

        sliderTrack.style.transform = `translateX(-${ ((width) * offsetKoef) }px)`;

        setTimeout((function(){

            sliderTrack.style.transition = null;

        }), settings.speedAnimation);

    }

    let dotsBar = document.querySelector(sliderClassName + " .dots-bar").childNodes;

    for (var i = 0; i < dotsBar.length; i++) {

        dotsBar[i].addEventListener("click", (function() {

            if (isDelayed === false){
                
                isDelayed = true;

                mainItems[currentSlide].classList.remove("active");

                targetSlide = parseInt(this.getAttribute("indexItem"));

                mainItems[targetSlide].classList.add("active");

                decorationAnim(dotsBar, thumbnails, currentSlide);
                target(targetSlide, mainItems[0].clientWidth);

                indexItem = currentSlide = targetSlide;

                setTimeout(() => {isDelayed = false}, settings.speedAnimation);

            }
            
        }))

    }

}  // жырнаяъ галереяъ