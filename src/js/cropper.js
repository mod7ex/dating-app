import Cropper from "cropperjs";

let handleCropping = () => {
      let imageUploadForm = document.getElementById("imageUploadForm");

      if (!imageUploadForm) return;

      let closeCropperBtn = document.querySelector("#cropContainer .close");
      let clearSelectedBtn = document.getElementById("clearSelectedBtn");
      let cropContainer = document.getElementById("cropContainer");
      let cropOverlay = document.getElementById("cropOverlay");
      let listingPreview = document.getElementById("listingPreview");
      let cropArea = document.getElementById("cropArea");
      let imgINput = document.getElementById("photos");
      let cropIt = document.getElementById("cropIt");
      let croppedImages = {};

      let closeCropper = () => {
            // @ts-ignore
            cropOverlay.classList.add("hidden");
            cropContainer.classList.add("hidden");
            cropArea.innerHTML = "";
            document.body.style.overflow = "visible";
      };

      imgINput.addEventListener("change", function () {
            croppedImages = {};
            listingPreview.innerHTML = "";

            // @ts-ignore
            if (this.files.hasOwnProperty(5)) {
                  // @ts-ignore
                  this.value = "";
                  alert("you can't upload more than 5 photos");
                  return;
            }

            // @ts-ignore
            for (const [key, file] of Object.entries(this.files)) {
                  if (file) {
                        let img = new Image(230);
                        let span = document.createElement("span");

                        img.src = URL.createObjectURL(file);

                        span.appendChild(img);
                        listingPreview.appendChild(span);

                        img.addEventListener("click", () => {
                              cropArea.innerHTML = "";

                              let cropImg = new Image();
                              cropImg.id = "cropImg";
                              // @ts-ignore
                              cropImg.src = URL.createObjectURL(file);

                              window.scrollTo({
                                    // we scroll because of the cropp area ...
                                    top: 0,
                                    behavior: "smooth",
                              });

                              cropOverlay.classList.remove("hidden");
                              cropContainer.classList.remove("hidden");
                              document.body.style.overflow = "hidden";

                              cropArea.appendChild(cropImg);

                              // @ts-ignore
                              const cropper = new Cropper(cropImg, {
                                    // aspectRatio: 16 / 9,
                                    // zoomable: false,
                                    // rotatable: false,
                                    // scalable: false,
                                    autoCropArea: 0.8,
                                    crop(event) {},
                              });

                              window.onresize = () => {
                                    cropper.reset();
                              };

                              cropIt.onclick = () => {
                                    cropper
                                          .getCroppedCanvas()
                                          .toBlob((blob) => {
                                                let croppedImg = new File(
                                                      [blob],
                                                      file.name,
                                                      {
                                                            type: file.type,
                                                            lastModified:
                                                                  new Date().getTime(),
                                                      }
                                                );

                                                img.src =
                                                      URL.createObjectURL(
                                                            croppedImg
                                                      );
                                                croppedImages[key] = croppedImg;
                                          });

                                    closeCropper();
                              };
                        });
                  }
            }

            clearSelectedBtn.classList.remove("hidden");
      });

      clearSelectedBtn.onclick = function () {
            // @ts-ignore
            imgINput.value = "";
            croppedImages = {};
            listingPreview.innerHTML = "";
            // @ts-ignore
            this.classList.add("hidden");
      };

      closeCropperBtn.addEventListener("click", closeCropper);

      imageUploadForm.addEventListener("submit", function (e) {
            e.preventDefault();
            let dataTransfer = new DataTransfer();

            // @ts-ignore
            for (const [key, file] of Object.entries(imgINput.files)) {
                  let image = file;

                  if (croppedImages.hasOwnProperty(key))
                        image = croppedImages[key];

                  dataTransfer.items.add(image);
            }

            // @ts-ignore
            imgINput.files = dataTransfer.files;

            // @ts-ignore
            this.submit();
      });
};

handleCropping();
