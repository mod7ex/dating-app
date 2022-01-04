let gelleryEngine = () => {
      let gallery = document.getElementById("gallery");

      if (!gallery) return;

      let images = gallery.querySelectorAll("li");

      let n = images.length,
            i = 0;

      if (!n) return;

      let nextIndex = (j) => {
            return (j + 1) % n;
      };

      let previousIndex = (j) => {
            return (j + n - 1) % n;
      };

      let showItem = (j) => {
            images[j].classList.remove("hidden");
            if (n === 1) return;
            images[previousIndex(j)].classList.add("hidden");
            images[nextIndex(j)].classList.add("hidden");

            // // other aproach
            // images.forEach((img, k) => {
            //       if (j == k) images[k].classList.remove("hidden");
            //       else images[k].classList.add("hidden");
            // });
      };

      showItem(i);

      if (n === 1) return;

      let btns = gallery.querySelectorAll(".gallery-btn");

      // // other aproach
      // let nextBtn = gallery.querySelector("#btns next");
      // let prevBtn = gallery.querySelector("#btns prev");

      btns.forEach((btn, k) => {
            btn.addEventListener("click", () => {
                  if (k) i = nextIndex(i);
                  else i = previousIndex(i);
                  showItem(i);
            });
      });
};

gelleryEngine();
