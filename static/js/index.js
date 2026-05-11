window.HELP_IMPROVE_VIDEOJS = false;

var INTERP_BASE = "https://homes.cs.washington.edu/~kpar/nerfies/interpolation/stacked";
var NUM_INTERP_FRAMES = 240;

var interp_images = [];
function preloadInterpolationImages() {
  for (var i = 0; i < NUM_INTERP_FRAMES; i++) {
    var path = INTERP_BASE + '/' + String(i).padStart(6, '0') + '.jpg';
    interp_images[i] = new Image();
    interp_images[i].src = path;
  }
}

function setInterpolationImage(i) {
  var image = interp_images[i];
  image.ondragstart = function() { return false; };
  image.oncontextmenu = function() { return false; };
  $('#interpolation-image-wrapper').empty().append(image);
}


$(document).ready(function() {
    // Check for click events on the navbar burger icon
    $(".navbar-burger").click(function() {
      // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
      $(".navbar-burger").toggleClass("is-active");
      $(".navbar-menu").toggleClass("is-active");

    });

    var options = {
			slidesToScroll: 1,
			slidesToShow: 3,
			loop: true,
			infinite: true,
			autoplay: false,
			autoplaySpeed: 3000,
    }

		// Initialize all div with carousel class
    var carousels = bulmaCarousel.attach('.carousel', options);

    // Loop on each carousel initialized
    for(var i = 0; i < carousels.length; i++) {
    	// Add listener to  event
    	carousels[i].on('before:show', state => {
    		console.log(state);
    	});
    }

    // Access to bulmaCarousel instance of an element
    var element = document.querySelector('#my-element');
    if (element && element.bulmaCarousel) {
    	// bulmaCarousel instance is available as element.bulmaCarousel
    	element.bulmaCarousel.on('before-show', function(state) {
    		console.log(state);
    	});
    }

    // preloadInterpolationImages();

    // $('#interpolation-slider').on('input', function(event) {
    //   setInterpolationImage(this.value);
    // });
    // setInterpolationImage(0);
    // $('#interpolation-slider').prop('max', NUM_INTERP_FRAMES - 1);

    // bulmaSlider.attach();

    $(".fragility-frame").on("mouseenter mousemove", function(event) {
      var rect = this.getBoundingClientRect();
      var x = ((event.clientX - rect.left) / rect.width) * 100;
      var y = ((event.clientY - rect.top) / rect.height) * 100;

      x = Math.max(0, Math.min(100, x));
      y = Math.max(0, Math.min(100, y));

      this.style.setProperty("--zoom-x", x + "%");
      this.style.setProperty("--zoom-y", y + "%");
      var noteX = Math.max(8, Math.min(62, x));
      var noteY = Math.max(18, Math.min(92, y));

      this.style.setProperty("--note-x", noteX + "%");
      this.style.setProperty("--note-y", noteY + "%");
      this.classList.add("is-zooming");
      $(this).closest(".fragility-item").addClass("is-zooming");
    });

    $(".fragility-frame").on("mouseleave", function() {
      this.classList.remove("is-zooming");
      $(this).closest(".fragility-item").removeClass("is-zooming");
      this.style.setProperty("--zoom-x", "50%");
      this.style.setProperty("--zoom-y", "50%");
      this.style.setProperty("--note-x", "0.75rem");
      this.style.setProperty("--note-y", "calc(100% - 0.75rem)");
    });

    var overviewDefaultTitle = $("#overview-info-panel h3").text();
    var overviewDefaultDescription = $("#overview-info-panel p").text();

    function resetOverviewHighlight() {
      $(".overview-hotspot").removeClass("is-active");
      $(".overview-target").removeClass("is-active");
      $("#overview-info-panel h3").text(overviewDefaultTitle);
      $("#overview-info-panel p").text(overviewDefaultDescription);
    }

    $(".overview-hotspot").on("click", function(event) {
      event.stopPropagation();
      var target = this.getAttribute("data-target");
      var title = this.getAttribute("data-title") || "StereoPolicy module";
      var description = this.getAttribute("data-description") || "";

      $(".overview-hotspot").removeClass("is-active");
      $(".overview-target").removeClass("is-active");
      $(this).addClass("is-active");
      if (target) {
        $('.overview-target[data-target-id="' + target + '"]').addClass("is-active");
      }
      $("#overview-info-panel h3").text(title);
      $("#overview-info-panel p").text(description);
    });

    $(".overview-interactive").on("click", function(event) {
      if (!$(event.target).closest(".overview-hotspot").length) {
        resetOverviewHighlight();
      }
    });

    $(document).on("click", function(event) {
      var isOverviewUi = $(event.target).closest(".overview-interactive, .overview-info-panel, .overview-click-note").length > 0;
      if (!isOverviewUi) {
        resetOverviewHighlight();
      }
    });

    $(".overview-hotspot").on("mouseenter", function() {
      $(".overview-hotspot").not(this).removeClass("is-hovering");
      $(this).addClass("is-hovering");
    });

	    $(".overview-hotspot").on("mouseleave", function() {
	      $(this).removeClass("is-hovering");
	    });

	    function activateTabletopTask(taskId) {
	      var $selectedButton = $('.task-selector-button[data-task="' + taskId + '"]');
	      var $selectedPanel = $('.tabletop-task-panel[data-task-panel="' + taskId + '"]');

	      if (!$selectedButton.length || !$selectedPanel.length) {
	        return;
	      }

	      $(".task-selector-button").removeClass("is-active").attr("aria-selected", "false");
	      $selectedButton.addClass("is-active").attr("aria-selected", "true");

	      $(".tabletop-task-panel").each(function() {
	        var isSelected = this === $selectedPanel[0];
	        $(this).toggleClass("is-active", isSelected).prop("hidden", !isSelected);

	        $(this).find("video").each(function() {
	          if (isSelected) {
	            var playPromise = this.play();
	            if (playPromise && typeof playPromise.catch === "function") {
	              playPromise.catch(function() {});
	            }
	          } else {
	            this.pause();
	          }
	        });
	      });
	    }

	    $(".task-selector-button").on("click", function() {
	      activateTabletopTask(this.getAttribute("data-task"));
	    });

	    $(".task-selector-button").on("keydown", function(event) {
	      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
	        return;
	      }

	      event.preventDefault();
	      var buttons = $(".task-selector-button").toArray();
	      var currentIndex = buttons.indexOf(this);
	      var direction = event.key === "ArrowRight" ? 1 : -1;
	      var nextButton = buttons[(currentIndex + direction + buttons.length) % buttons.length];
	      nextButton.focus();
	      activateTabletopTask(nextButton.getAttribute("data-task"));
	    });

	    activateTabletopTask($(".task-selector-button.is-active").attr("data-task"));

	    var singleTaskVideo = document.getElementById("single-task-result-video");
    var multiTaskVideo = document.getElementById("multi-task-result-video");
    if (singleTaskVideo) {
      singleTaskVideo.playbackRate = 2.0;
    }
    if (multiTaskVideo) {
      multiTaskVideo.playbackRate = 2.0;
    }

})
