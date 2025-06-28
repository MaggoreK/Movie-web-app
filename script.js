// Zobrazi nebo skryje tlacitko podle pozice

// Tento zapis rika, ze funguje jen na strance, kde je tlacitko s id scrollToTopBtn
document.addEventListener("DOMContentLoaded", function() {

    //1 Funkcionalita pro scrollToTopBtn
    const btnToTop = document.getElementById("scrollToTopBtn");
    if (btnToTop) {
        window.addEventListener("scroll", function() {
        if (window.scrollY > window.innerHeight * 0.3) {
            btnToTop.classList.add("visible");
            btnToTop.classList.remove("hidden");
        } else {
            btnToTop.classList.remove("visible");
            btnToTop.classList.add("hidden");
        }
        });

        btnToTop.addEventListener("click", function() {
        window.scrollTo({top: 0, behavior: "smooth"});
        });
    }


    //2 Funkcionalita pro výběr filmů (pouze na movies.html)
    const moviesSection = document.querySelector('.APImovies');
    const select = document.querySelector('select');
    if (moviesSection && select) {
        const moviesSection = document.querySelector('.APImovies');
        const select = document.querySelector('select');

        // Přidáme overlay prvek do stránky
        const overlay = document.createElement("div");
        overlay.className = "movie-overlay hidden";
        overlay.innerHTML = `
        <div class="movie-overlay-content">
            <span class="movie-overlay-close">&times;</span>
            <img class="movie-overlay-img" src="" alt="">
            <h3 class="movie-overlay-title"></h3>
            <p class="movie-overlay-summary"></p>
        </div>
        `;
        document.body.appendChild(overlay);

        const overlayImg = overlay.querySelector(".movie-overlay-img");
        const overlayTitle = overlay.querySelector(".movie-overlay-title");
        const overlaySummary = overlay.querySelector(".movie-overlay-summary");
        const overlayClose = overlay.querySelector(".movie-overlay-close");

        // Zavíraní overlay boxu
        overlayClose.onclick = () => {overlay.classList.add("hidden");};
        overlay.onclick = (e) => {
        if (e.target === overlay) overlay.classList.add("hidden");};

        const paragraphToWebsite = (content, whereToAdd) => {
            whereToAdd.innerHTML = ""; // Vymaže předchozí filmy
            content.forEach((movie) => {
                const movieElement = document.createElement("div");
                movieElement.classList.add("movie");
                movieElement.innerHTML = `
                    <img src="${movie.show.image ? movie.show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image'}" alt="${movie.show.name}">
                `;
                // Klik na obrázek otevře overlay s informacemi o filmu
                movieElement.querySelector("img").onclick = () => {
                    overlayImg.src = movie.show.image ? movie.show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
                    overlayImg.alt = movie.show.name;
                    overlayTitle.textContent = movie.show.name;
                    overlaySummary.innerHTML = movie.show.summary ? movie.show.summary : 'No summary available.';
                    
                    overlay.classList.remove("hidden");
                };

                whereToAdd.appendChild(movieElement);
            });
        };

        // Namapování option na správný dotaz pro API
        const optionToQuery = {
            Girl: "girl",
            Boy: "boy",
            Avengers: "avengers",
            Horror: "horror",
            Marvel: "marvel"
        };

        // Handler pro změnu selectu

        select.addEventListener("change", (e) => {
                const selected = select.value;
                const query = optionToQuery[selected];
                if (query) {
                    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
                        .then(res => res.json())
                        .then(data => {
                            paragraphToWebsite(data, moviesSection);
                        })
                        .catch(err => {
                            moviesSection.innerHTML = "<p>Chyba při načítání dat z API.</p>";
                            console.error("Chyba při načítání dat z API:", err);
                        });
                } else {
                    moviesSection.innerHTML = "";
                }
        });
    }

    //3 Funkcionalita pro porovnání hesel (pouze na signin.html)
    const inputPassword1 = document.querySelector(".password1");
    const inputPassword2 = document.querySelector(".password2");
    if (inputPassword1 && inputPassword2) {
        inputPassword1.addEventListener("input", checkPasswords);
        inputPassword2.addEventListener("input", checkPasswords);

        function checkPasswords() {
            inputPassword1.classList.remove("border-green", "border-red");
            inputPassword2.classList.remove("border-green", "border-red");
            if (inputPassword1.value === inputPassword2.value) {
                inputPassword1.classList.add("border-green");
                inputPassword2.classList.add("border-green");
            } else {
                inputPassword1.classList.add("border-red");
                inputPassword2.classList.add("border-red");
            }
      }
    }
  }
);


// Na uvodni strane po zadani emailu se ulozi do localStorage a presmeruje na signin.html a vyplni email input
document.addEventListener("DOMContentLoaded", function() {
  const emailInput = document.getElementById('emailInput');
  const signinBtn = document.getElementById('signinBtn');
  const emailForm = document.querySelector('.email-form');

  if (emailForm && emailInput && signinBtn) {
    emailForm.addEventListener('submit', function(e) {
      e.preventDefault(); // zabrání defaultnímu odeslání
      localStorage.setItem('myAppEmail', emailInput.value); // uloží e-mail
      window.location.href = 'signin.html'; // přesměruje
    });
  }

  const emailOutput = document.getElementById('emailOutput');
  if (emailOutput) {
    const storedEmail = localStorage.getItem('myAppEmail');
    if (storedEmail) {
      emailOutput.value = storedEmail;
      // smaze localStorage protoze tam email zustaval i po refreshi stranky. confused unga bunga radsi smazat.
      localStorage.removeItem('myAppEmail');
    }
  }

});

    

   

