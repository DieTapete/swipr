//TODO: Add diagonal mode

!function($) {
	'use strict';

	//CONSTANTS
	var NAME = 'swipr',
		HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical';

	//Default Settings
	var defaults = {
		// container: '.'+NAME,
		orientation: HORIZONTAL,
		childSelector: '',
		loop: false,
		slideDuration: 0.5
	};

	$.fn.swipr = function(options) {
		var settings = $.extend({}, defaults, options);
      	
      	var $container,//$(settings.container),
      		$children, $currentSlide,
			currentIndex, numSlides,
      		swiprWidth, swiprHeight,
      		t  = this;

      	t.AFTER_MOVE = 'afterMove';
      	t.BEFORE_MOVE = 'beforeMove';

      	function reload(){
      		$container = t;
      		$children = $container.children(settings.childSelector);
      		var $firstSlide = $($children.get(0));
      		$currentSlide = $firstSlide;
			currentIndex = 0;
			numSlides = $children.length;
      		resize();
      	}

      	function resize(){
      		swiprWidth = t.width();
      		swiprHeight = t.height();

      		$children.each(function(){
      			var $this = $(this);
      			$this.width(swiprWidth);
      			$this.height(swiprHeight);
      		});
      	}

      	function init(){
      		reload();

      		$container.wrap('<div class="'+NAME+'-window"></div>')
	      	.css({width:'100%', height:'100%'});

	      	// $container.parent().css({width:swiprWidth+'px', height:swiprHeight+'px'});
			
			//TODO: Add Vertical Mode
			$children.each(function(i) {
			   $(this).addClass(NAME+'-slide')
			   // .attr('data-index', i)
			   .attr('draggable', 'false')
			   .css('visibility', 'hidden')
			   // .css('display', 'none');
			});

			// $container.empty();

			addSlide($currentSlide);
			//Bind events
			$(window).resize(function(){resize();});
      	}

      	
      	
  		//public methods
		t.goto = function(index, animated){
			if ($currentSlide && index === currentIndex){
				return;
			}
			if (index >= numSlides){
				if (!settings.loop){
					return;
				}
				else{
					index = 0;
				}
			}
			else if (index < 0){
				if (!settings.loop){
					return;
				}
				else{
					index = numSlides-1;
				}
			}

			t.trigger(t.BEFORE_MOVE, {index:currentIndex});

			var direction = (index < currentIndex) ? -1:1;
			if ($currentSlide){
				$currentSlide.removeClass('active');
				leaveSlide($currentSlide, direction, animated);
			}
			var $slide = $($children.get(index));
			callSlide($slide, direction, animated, function(){
				$currentSlide = $slide;
				t.trigger(t.AFTER_MOVE, {index:currentIndex});
			});

			currentIndex = index;
		};

		//Convenience Methods
		t.gotoNext = function(){ t.goto(currentIndex+1); };
		t.gotoPrev = function(){ t.goto(currentIndex-1); };
		t.moveTo = function(index){ t.goto(index, true); };
		t.moveToNext = function(){ t.moveTo(currentIndex+1); };
		t.moveToPrev = function(){ t.moveTo(currentIndex-1); };

		//private methods
		function moveSlide($slide, to, from, onComplete){
			onComplete = onComplete || function(){};

			//Check from where to where to move the slide
			if (from){
				to.onComplete = to.onComplete || onComplete;

				$slide.css(from);
				TweenLite.to($slide, settings.slideDuration, to);
				// $slide.css(to);
			}
			//No Animation, just set the slide to its position immediately
			else{
				$slide.css(to);
				onComplete();
			}
		}

		function removeSlide($slide){
			// $slide.css('display', 'none');
			$slide.css('visibility', 'hidden');
			$currentSlide = null;
		}

		function leaveSlide($slide, direction, animated, onComplete){
			var to = {top:-direction*swiprHeight+'px'};
			if (settings.orientation == HORIZONTAL){
				to = {left:-direction*swiprWidth+'px'};	
			} 

			function callback(){
				removeSlide($slide);
				if (onComplete){
					onComplete();
				}
			}

			var from = animated ? {top:'0px', left:'0px'} : null;

			moveSlide($slide, to, from, callback);
		}

		function addSlide($slide){
			$slide.css('visibility', 'visible');
			// $slide.css('display', 'block');
			$currentSlide = $slide;
			$currentSlide.addClass('active');
		}

		function callSlide($slide, direction, animated, onComplete){
			addSlide($slide);

			var from = null;
			if (animated){
				from = {left:(direction*swiprWidth)+'px'}; 
				if (settings.orientation == VERTICAL){
					from = {top:(direction*swiprHeight)+'px'};
				}
			}

			moveSlide($slide, {top:'0px', left:'0px'}, from, onComplete);
		}

		init();
		return t;
	};

}($);