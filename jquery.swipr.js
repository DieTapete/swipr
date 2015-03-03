//TODO: Add diagonal mode

!function($) {
	'use strict';

	// CONSTANTS
	var NAME = 'swipr',
		HORIZONTAL = 'horizontal',
		VERTICAL = 'vertical',

	// variables
		isAnimating = false,
		animatingTimeout=0;

	// Default Settings
	var defaults = {
		orientation: HORIZONTAL,
		childSelector: '',
		loop: false,
		slideDuration: 0.5,
		usePaginator: true
	};

	$.fn.swipr = function(options) {
		var settings = $.extend({}, defaults, options);
      	
      	var $container,//$(settings.container),
      		$children, $currentSlide,
			currentIndex=0, numSlides,
      		swiprWidth, swiprHeight,
      		paginator, $paginator,
      		t  = this;

      	t.AFTER_MOVE = 'afterMove';
      	t.BEFORE_MOVE = 'beforeMove';

      	function reload(){
      		$container = t;
      		$children = $container.children(settings.childSelector);
      		var $firstSlide = $($children.get(0));
      		$currentSlide = $firstSlide;
      		resize();
			numSlides = $children.length;
      		if (currentIndex >= numSlides) {
				currentIndex = numSlides-1;
      		}
      		rebuildPaginator();
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
      		if (settings.usePaginator) {
      			createPaginator();
      		}

      		reload();

      		$container.wrap('<div class="'+NAME+'-window"></div>')
	      	.css({width:'100%', height:'100%'});

	      	// $container.parent().css({width:swiprWidth+'px', height:swiprHeight+'px'});
			
			$children.each(function() {
			   $(this).addClass(NAME+'-slide')
			   .attr('draggable', 'false')
			   .css('visibility', 'hidden')
			   // .css('display', 'none');
			});

			addSlide($currentSlide);
			
			//Bind events
			$(window).resize(function(){resize();});
			
			//paginator hack
			var $paginator = t.parent().parent().find('.swipr-paginator');
			$paginator.children(':first-child').addClass('active');
			
			$paginator.children().on('click', function(){
				t.moveTo($(this).index());
			});
      	}

      	
      	
  		//public methods
		t.goto = function(index, animated){
			if ($currentSlide && index === currentIndex || isAnimating){
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

			isAnimating = animated;
			/*clearTimeout(animatingTimeout);
			if (animated){
				animatingTimeout = setTimeout(function(){
					isAnimating = false;
				}, settings.slideDuration);
			}*/

			var direction = (index < currentIndex) ? -1:1;
			if ($currentSlide){
				$currentSlide.removeClass('active');
				leaveSlide($currentSlide, direction, animated);
			}
			var $slide = $($children.get(index));
			callSlide($slide, direction, animated, function(){
				$currentSlide = $slide;
				isAnimating = false;
				t.trigger(t.AFTER_MOVE, {index:currentIndex});
			});

			currentIndex = index;

			paginator.select(currentIndex);
		};

		//Convenience Methods
		t.gotoNext = function(){ t.goto(currentIndex+1); };
		t.gotoPrev = function(){ t.goto(currentIndex-1); };
		t.gotoEnd = function(){ t.goto(numSlides-1); };
		t.gotoStart = function(){ t.goto(0); };
		t.moveTo = function(index){ t.goto(index, true); };
		t.moveToNext = function(){ t.moveTo(currentIndex+1); };
		t.moveToPrev = function(){ t.moveTo(currentIndex-1); };
		t.moveToEnd = function(){ t.moveTo(numSlides-1); };
		t.moveToStart = function(){ t.moveTo(0); };

		function createPaginator(){
			$paginator = $('<ul class="swipr-paginator"></ul>');
			t.parent().append($paginator);
			$paginator = t.parent().parent().find('.swipr-paginator');
			// paginator = new SelectionGroup($paginator, '.swipr-paginator-item', '.swipr-paginator-item', 'active');
			// 
			paginator = {
				select:function(index){
					var $children = $paginator.children();
					$children.removeClass('active');
					$($children.get(index)).addClass('active');
				}	
			};

			rebuildPaginator();
		}

		function rebuildPaginator(){
			$paginator.empty();
			for (var i=numSlides-1; i>=0; i--){
				$paginator.append('<li class="swipr-paginator-item"></li>');
			}

			paginator.select(currentIndex);
		}

		//private methods
		function moveSlide($slide, to, from, onComplete){
			onComplete = onComplete || function(){};

			//Check from where to where to move the slide
			if (from){
				to.onComplete = to.onComplete || onComplete;

				TweenLite.set($slide, from);
				to.force3D = true; 
				TweenLite.to($slide, settings.slideDuration, to);
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
			var to = {y : -direction*swiprHeight};
			if (settings.orientation == HORIZONTAL){
				to = {x : -direction*swiprWidth };	
			} 

			function callback(){
				removeSlide($slide);
				if (onComplete){
					onComplete();
				}
			}

			var from = animated ? {y:0, x:0} : null;

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
				from = {x : direction*swiprWidth }; 
				if (settings.orientation == VERTICAL){
					from = {y : direction*swiprHeight };
				}
			}

			moveSlide($slide, {y:0, x:0}, from, onComplete);
		}

		init();
		return t;
	};

	//--  Required Modules --
	//
	////buttonSelector and selectedClass are optional
	//@selectedclass[default=active]
	var SelectionGroup = function($container, elementSelector, buttonSelector, selectedClass, options){
	    var ACTIVATE = 'selection_group_activate';
	    var DEACTIVATE = 'selection_group_deactivate';
	    //Set default options
	    options = options || {observeMutations:true};
	    selectedClass = selectedClass || 'active';
	    var $buttonElements,
	        $currentButton;

	    function init(){
	        $container.addClass('selection_group');
	        t.$elements = elementSelector ? $container.find(elementSelector) : $container.children(),
	        t.$buttonElements = buttonSelector ? $container.find(buttonSelector) : t.$elements,
	        $currentButton = null;
	        t.currentIndex = -1;
	        t.$elements.removeClass(selectedClass);

	        // t.$buttonElements.off('click');
	        t.$buttonElements.on('click', function(){
	        	var $buttonElement = $(this),
	                index = t.$buttonElements.index($buttonElement),
	                $element = t.getElement(index);

	            //check if there is another open element, if so close it
	            if (t.currentIndex != -1 && index != t.currentIndex){
	                var $lastElement = t.getElement(t.currentIndex);
	                $lastElement.removeClass(selectedClass);
	                $container.trigger(DEACTIVATE, {$element:$lastElement, index:t.currentIndex});
	            }

	            $element.toggleClass(selectedClass);
	            
	            //check if the element is open and supposed to be closed
	            if (index == t.currentIndex){
	                t.currentIndex = -1;
	                $container.trigger(DEACTIVATE, {$element:$element, index:index});
	            }
	            //open element
	            else {
	                t.currentIndex = index;
	                $container.trigger(ACTIVATE, {$element:$element, index:index});
	            } 

	            //if parent selectiongroup deactivates, also deactivate our own
	            $container.parent().closest('.selection_group').on(DEACTIVATE, function(){
	                t.close();
	            });
	        });
	    }    

	    var t = {
	        $container: $container, 
	        $elements: null,
	        $buttonElements: null,
	        currentIndex: -1,

	        selectElement:function($buttonElement){
	            $buttonElement.trigger('click');
	        },
	        select:function(index){
	            $(t.$buttonElements[index]).trigger('click');
	        },
	        close:function(){
	            if (t.currentIndex!=-1){
	                var $element = t.getElement(t.currentIndex);
	                $element.removeClass(selectedClass);
	                $container.trigger(module.exports.DEACTIVATE, {$element:$element, index:t.currentIndex});
	                t.currentIndex = -1;
	            }
	        },
	        getElement:function(index){
	            return $(t.$elements[index]);
	        },
	        getSelectedElement:function(index){
	            return t.getElement(t.currentIndex);
	        },
	        rebuild:function(){
	            init();
	        }
	    };

	    function createMutationObserver(){
	        t.mutationObserver = new MutationObserver(function(){
	            init();
	        });
	        t.mutationObserver.observe(t.$container[0], {childList:true});
	    }

	    init();
	    if (options.observeMutations){
	        createMutationObserver();
	    }

	    return t;
	};    


}($);