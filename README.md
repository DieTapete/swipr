#swipr

swipr is a jquery plugin that creates one of those wonderful slideshows/galleries that can be found all over the internet.
it's focused on performance and mobile friendliness.
Warning swipr is not in a stable state and it's discouraged from being used as is in production.

##Philosophy
swipr has a module based approach. it starts out with a barebone gallery that can only be used via swipe gestures or scrolling.
but modules like a paginator or visual buttons can be added if needed.

##Examples
See example.html for a full working example.

##Installation
	For now you have to clone the repo to get started.

##Options
	var defaults = {
		orientation: HORIZONTAL,
		childSelector: '',
		loop: false,
		slideDuration: 0.5,
		usePaginator: true
	};

##Methods
- goto
- gotoNext
- gotoPrev
- gotoEnd
- gotoStart

- moveTo
- moveToNext
- moveToPrev
- moveToEnd
- moveToStart

##Events
- beforeMove
  Parameters: index - index of the current slide before moving
- afterMove
  Parameters: index - index of the new slide after moving

##Credits
swipr was created by Henner Woehler
www.henner-woehler.de
