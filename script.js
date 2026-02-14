(function() {
    'use strict';

    // ============================
    // PARTICLES
    // ============================
    var particlesBg = document.getElementById('particles-bg');
    for (var i = 0; i < 30; i++) {
        var p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = (6 + Math.random() * 6) + 's';
        p.style.width = (1 + Math.random() * 2) + 'px';
        p.style.height = p.style.width;
        particlesBg.appendChild(p);
    }

    // ============================
    // ELEMENTS
    // ============================
    var introScreen = document.getElementById('intro-screen');
    var questionScreen = document.getElementById('question-screen');
    var punishmentScreen = document.getElementById('punishment-screen');
    var transitionScreen = document.getElementById('transition-screen');
    var dragScreen = document.getElementById('drag-screen');
    var finalScreen = document.getElementById('final-screen');

    var giftButton = document.getElementById('gift-button');
    var samBtn = document.getElementById('sam-btn');
    var wrongBtn = document.getElementById('wrong-btn');

    var dropZone = document.getElementById('dropZone');
    var submitBtn = document.getElementById('submitBtn');
    var result = document.getElementById('result');
    var finalChosen = document.getElementById('finalChosen');
    var elements = document.querySelectorAll('.draggable-element');

    // ============================
    // STATE
    // ============================
    var punishmentActivated = false;
    var samClicksAfterPunishment = 0;
    var selectedWords = [];

    // ============================
    // SCREEN SWITCHING
    // ============================
    function switchScreen(from, to, delay) {
        delay = delay || 500;
        from.classList.remove('active');
        setTimeout(function() {
            to.classList.add('active');
        }, delay);
    }

    // ============================
    // SAM BUTTON MOVE
    // ============================
    function moveSamButton() {
        var container = questionScreen.getBoundingClientRect();
        var btn = samBtn.getBoundingClientRect();
        var maxX = container.width - btn.width;
        var maxY = container.height - btn.height;
        var randomX = Math.random() * maxX - (container.width / 2 - btn.width / 2);
        var randomY = Math.random() * maxY - (container.height / 2 - btn.height / 2);
        samBtn.style.transform = 'translate(' + randomX + 'px, ' + randomY + 'px)';
    }

    // ============================
    // INTRO -> QUESTION
    // ============================
    giftButton.addEventListener('click', function() {
        switchScreen(introScreen, questionScreen);
    });

    // ============================
    // WRONG ANSWER -> PUNISHMENT
    // ============================
    wrongBtn.addEventListener('click', function() {
        punishmentActivated = true;
        samClicksAfterPunishment = 0;
        questionScreen.classList.remove('active');
        punishmentScreen.classList.add('active');

        setTimeout(function() {
            punishmentScreen.classList.remove('active');
            questionScreen.classList.add('active');
        }, 1000);
    });

    // ============================
    // SAM BUTTON LOGIC
    // ============================
    samBtn.addEventListener('click', function() {
        if (!punishmentActivated) {
            moveSamButton();
            return;
        }
        samClicksAfterPunishment++;
        if (samClicksAfterPunishment < 4) {
            moveSamButton();
        } else {
            switchScreen(questionScreen, transitionScreen);
            setTimeout(function() {
                switchScreen(transitionScreen, dragScreen);
            }, 3000);
        }
    });

    // ============================
    // QUESTIONNAIRE - TAP TO SELECT
    // ============================
    elements.forEach(function(el) {
        el.addEventListener('click', function() {
            var word = el.getAttribute('data-word');
            if (selectedWords.indexOf(word) !== -1) return;

            selectedWords.push(word);
            el.classList.add('hidden');

            var tag = document.createElement('div');
            tag.className = 'selected-tag';
            tag.innerHTML = word + ' <span class="remove-x">&#10005;</span>';
            tag.addEventListener('click', function() {
                selectedWords = selectedWords.filter(function(w) { return w !== word; });
                tag.remove();
                el.classList.remove('hidden');
                if (selectedWords.length === 0) {
                    dropZone.classList.remove('has-items');
                }
            });

            dropZone.appendChild(tag);
            dropZone.classList.add('has-items');
        });
    });

    // ============================
    // SUBMIT
    // ============================
    submitBtn.addEventListener('click', function() {
        if (selectedWords.length === 0) {
            result.className = 'result-msg show error';
            result.textContent = 'Por favor, selecciona al menos una respuesta.';
            setTimeout(function() {
                result.classList.remove('show');
            }, 3000);
            return;
        }

        finalChosen.innerHTML = '';
        selectedWords.forEach(function(w) {
            var t = document.createElement('span');
            t.className = 'final-chosen-tag';
            t.textContent = w;
            finalChosen.appendChild(t);
        });

        switchScreen(dragScreen, finalScreen);
    });

})();
